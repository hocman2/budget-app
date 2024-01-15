import Transaction from "./Transaction";
import Account from "./Account";
import MoneyValue from "./MoneyValue";
import SavingAccount from "./SavingAccount";
import type TimePeriod from "./TimePeriod";

export default class Income extends Transaction {

    public readonly percentSavings: number = 0;
    public readonly savingAccount?: SavingAccount;

    constructor(name: string, amount: MoneyValue, date: Date,
        account: Account, savingAccount?: SavingAccount, percentSavings: number = 0)
    {
        super(name, amount, date, account);
        this.savingAccount = savingAccount;
        this.percentSavings = Math.min(1, Math.max(0, percentSavings));
    }

    static getIncomesByDate(timePeriods: TimePeriod[]): Map<Date, Array<Income>> 
    {
        return super.getTransactionsByDate(Income, timePeriods);    
    }

    private getSavedAmountNumber(): number 
    {
        return this.amount.value() * this.percentSavings;
    }

    // GetTotalAmount is a replacement of og getAmount()
    public getTotalAmount(): MoneyValue
    {
        return this.amount;
    }

    // Here we override Account's getAmount() default behavior to return the amount - the percentage saved
    public getAmount(): MoneyValue
    {
        if (this.savingAccount === undefined)
        {
            return this.getTotalAmount();
        }
        
        return new MoneyValue(this.amount.value() - this.getSavedAmountNumber());
    }

    public getSavedAmount(): MoneyValue
    {
        return new MoneyValue(this.getSavedAmountNumber());
    }

    // When an income is deleted, we'd like to remove the saved amount from the saving account
    public preDeleteRoutine()
    {
        this.savingAccount?.decreaseAccountValue(this.getSavedAmountNumber());
    }
}