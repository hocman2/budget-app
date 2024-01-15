import Account from "./Account";
import MoneyValue from "./MoneyValue";
import type TimePeriod from "./TimePeriod";

export default class Transaction {
    public readonly name: string;
    protected readonly amount: MoneyValue;
    public readonly date: Date;
    public readonly account: Account;

    constructor(name: string, amount: MoneyValue, date: Date, account: Account)
    {
        this.name = name;
        this.amount = amount;
        this.date = date;
        this.account = account;
    }

    public getAmount(): MoneyValue
    {
        return this.amount;
    }

    public preDeleteRoutine(){}

    static getTransactionsByDate<T extends Transaction>(type: new(...args:any[]) => T, timePeriods: Array<TimePeriod>): Map<Date, Array<T>>
    {
        // We can't use Date directly as keys so we use their Time value instead
        let dateExpenses = new Map<number, Array<T>>();

        timePeriods.forEach((timeSpan) => {
            timeSpan.getTransactionsOfType(type).forEach((transac) => {
                let dateTime = transac.date.getTime();
                if (dateExpenses.has(dateTime))
                {
                    // Unshift to show most recent expense first (last in transaction list)
                    dateExpenses.get(dateTime)!.unshift(transac); 
                }
                else
                {
                    dateExpenses.set(dateTime, [transac]);
                }
            });
        });
        
        // Here, dates as time are converted back do Date instances
        return new Map<Date, Array<T>>(
            Array.from(dateExpenses, ([k, v]) => [new Date(k), v])
            );
    }
}