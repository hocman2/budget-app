import MoneyValue from "./MoneyValue";
import IdProvider from "./IdProvider";
import UserAccounts from "./UserAccounts";

export default class Account {

    private name: string;
    private amount: MoneyValue;
    
    public readonly id: number;

    constructor(name: string, baseValue: MoneyValue)
    {
        this.name = name;
        this.amount = baseValue;
        this.id = IdProvider.getId();
    }

    public static findById(accounts: Account[], id: number): Account|undefined
    {
        return accounts.find((a) => a.id === id);
    }

    public getName(): string { return this.name; }

    public setName(newName: string)
    {
        this.name = newName;
        UserAccounts.get().requestUpdate();
    }

    public getAmount() : MoneyValue
    {
        return this.amount;
    }

    public decreaseAccountValue(amount: number)
    {
        this.amount = new MoneyValue(this.amount.value() - amount);
        UserAccounts.get().requestUpdate();
    }
    
    public increaseAccountValue(amount: number)
    {
        this.amount = new MoneyValue(this.amount.value() + amount);
        UserAccounts.get().requestUpdate();
    }
}