import Transaction from "./Transaction";
import Category from "./Category";
import MoneyValue from "./MoneyValue";
import SavingAccount from "./SavingAccount";
import Account from "./Account";
import Expense from "./Expense";
import Income from "./Income";
import { daysBetween } from "../scripts/utils";
import Transfer from "./Transfer";
import Balancing from "./Balancing";

export enum TransactionType {Expense, Income, Transfer, Balancing};
export type TransactionDefinition = {
    type: TransactionType,
    name: string,
    amount: MoneyValue,
    date: Date,
    account: Account,
    category?: Category,
    savingPercent?: number,
    otherAccount?: Account,
};

export default class TimePeriod {
    private startDate: Date;
    private duration: number;
    private endDate: Date;
    private transactions: Array<Transaction> = [];

    private transactionsUpdatedCallback: Array<(() => void)> = [];

    constructor(start: Date, durationDays: number) {
        this.startDate = start;
        this.duration = durationDays;
        this.endDate = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);
    }

    public getStartDate() { return this.startDate; }
    public getEndDate() { return this.endDate; }
    public getDuration() { return this.duration; }

    /// Get remaining days from provided date to budget end date
    getRemainingDays(from: Date): number
    {
        return daysBetween(from, this.endDate);
    }

    public makeAndAdd(...defs: Array<TransactionDefinition>)
    {
        defs.forEach((def) => { 
                switch(def.type)
                {
                    case TransactionType.Expense:
                        this.addTransaction(new Expense(def.name, def.amount, def.date, def.account, def.category));
                        break; 
                    case TransactionType.Income:
                        this.addTransaction(new Income(def.name, def.amount, def.date, def.account, def.otherAccount as SavingAccount|undefined, def.savingPercent));
                        break;
                    case TransactionType.Transfer:
                        this.addTransaction(new Transfer(def.name, def.amount, def.date, def.account, def.otherAccount!));
                        break;
                    case TransactionType.Balancing:
                        this.addTransaction(new Balancing(def.name, def.amount, def.date, def.account))
                        break;
                }
            });
    }

    private addTransaction(transaction: Transaction)
    {
        this.transactions.push(transaction);
        let amount = transaction.getAmount().value();

        if (transaction instanceof Expense)
        {
            transaction.account.decreaseAccountValue(amount);
        }
        else if (transaction instanceof Income)
        {
            transaction.account.increaseAccountValue(amount);
            // We must also link that income to a potential saving account
            transaction.savingAccount?.addIncomes(transaction);
        }
        else if (transaction instanceof Transfer)
        {
            transaction.getGiverAccount().decreaseAccountValue(amount);
            transaction.getReceiverAccount().increaseAccountValue(amount);
        }
        else if (transaction instanceof Balancing)
        {
            if (amount > 0)
            {
                transaction.account.increaseAccountValue(amount)
            }
            else
            {
                transaction.account.decreaseAccountValue(-amount);
            }
        }

        this.invokeUpdateEvent();
    }
    
    private invokeUpdateEvent()
    {        
        // Attention everyone: transactions have been updated 🚨
        this.transactionsUpdatedCallback.forEach((callback) => callback());
    }

    public onTransactionsUpdated(callback: ()=>void) 
    {
        this.transactionsUpdatedCallback.push(callback);
    }

    public getTransactions(): Array<Transaction>
    {
        return this.transactions.toReversed();
    }

    public getTransactionsForAccount(account: Account): Array<Transaction> 
    {
        return this.transactions.filter((t) => t.account === account );
    }

    public getTransactionsOfTypeForAccount<T extends Transaction>(type: new(...args: any[]) => T | typeof Transaction, account: Account): Array<T>
    {
        return this.transactions.filter((t): t is T => t instanceof type && t.account === account);
    }

    /// Returns the expenses that fit into at least one of the passed categories
    public findExpenses(...categories: Array<Category>): Array<Expense>
    {
        return this.transactions.filter((t): t is Expense => t instanceof Expense && t.category !== undefined && categories.includes(t.category));
    }

    public getTransactionsOfType<T extends Transaction>(type: new(...args: any[]) => T | typeof Transaction): Array<T>
    {
        return this.transactions.filter((t): t is T => t instanceof type);
    }

    public removeTransactions(transactions: Transaction[])
    {
        this.transactions = this.transactions.filter((t) => {
            let shouldKeep = !transactions.includes(t);
            if (shouldKeep) return true;
            // This transaction will be deleted, it might do some operations before
            t.preDeleteRoutine();
            return false;
        });

        this.invokeUpdateEvent();
    }
}