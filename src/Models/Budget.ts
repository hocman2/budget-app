import type Category from "./Category";
import type Expense from "./Expense";
import { daysBetween } from "../scripts/utils";
import MoneyValue from "./MoneyValue";
import type TimePeriod from "./TimePeriod";
import { periodDuration } from "../scripts/constants";

export default class Budget {
    private currentSpent: number = 0;
    private max: MoneyValue;
    private name: string;
    private numPeriods: number;
    private categories: Array<Category>;

    constructor(name: string, max: MoneyValue, numPeriods:number, categories: Array<Category>) {
        this.max = max;
        this.name = name;
        this.numPeriods = numPeriods;
        this.categories = categories;
    }

    changeData(name?: string, max?: MoneyValue, categories?: Array<Category>)
    {
        if (name) this.name = name;
        if (max) this.max = max;
        if (categories) { this.categories = categories; }
    }

    getName(): string { return this.name; }
    getMax(): MoneyValue { return this.max; }
    getCategories(): Array<Category> { return this.categories; }
    getCurrentSpent(): MoneyValue { return new MoneyValue(this.currentSpent); }

    getRemainingDays(from: Date, currentTimePeriod: TimePeriod): number
    {
        return currentTimePeriod.getRemainingDays(from) + (this.numPeriods-1) * periodDuration;
    }

    calculatePctValue(): number
    {
        return this.currentSpent * 100 / this.max.value();
    }

    isOverspent(): boolean
    {
        return this.currentSpent >= this.max.value();
    }

    calculateRemainingSpend(): MoneyValue
    {
        return new MoneyValue(this.max.value() - this.currentSpent);
    }

    /// Get average spending from budget start date to provided date
    calculateAverageSpent(from:Date, to: Date): number
    {
        let numActiveDays = daysBetween(from, to);
        
        if (numActiveDays === 0) numActiveDays = 1;

        return this.currentSpent / numActiveDays;
    }

    calculateDaysBeforeOverflow(avg: number)
    {
        return this.max.value() / avg;
    }

    calculateCurrentSpent(timePeriod: TimePeriod): MoneyValue {
        // Sum up all expenses that match this budget
        this.currentSpent = this.findRelatedExpenses(timePeriod)
            .map((e) => { return e.getAmount().value()}) // From Expense to number
            .reduce((p, c) => { return p + c}, 0);  // Sum

        return new MoneyValue(this.currentSpent);
    }

    findRelatedExpenses(timePeriod: TimePeriod): Array<Expense> {
        return timePeriod.findExpenses(...this.categories);
    }
};