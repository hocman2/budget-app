import Account from "./Account";
import Budget from "./Budget";
import Category from "./Category";
import MoneyValue from "./MoneyValue";
import type TimePeriod from "./TimePeriod";
import Transaction from "./Transaction";

export default class Expense extends Transaction {

    public readonly category?: Category;

    constructor(name: string, amount: MoneyValue, date: Date, account: Account, category?: Category)
    {
        super(name, amount, date, account);
        this.category = category;
    }

    getRelatedBudget(budgets: Array<Budget>): Budget|undefined
    {
        if (!this.category) return undefined;

        return budgets.find((b) => { return b.getCategories().includes(this.category!)});
    }

    static getExpensesByDate(timePeriods: TimePeriod[]): Map<Date, Array<Expense>> 
    {
        return super.getTransactionsByDate(Expense, timePeriods);    
    }
};