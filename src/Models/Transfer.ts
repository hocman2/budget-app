import type Account from "./Account";
import type MoneyValue from "./MoneyValue";
import Transaction from "./Transaction";

export default class Transfer extends Transaction {
    
    public readonly receiverAccount: Account;
    constructor(name: string, amount: MoneyValue, date: Date,
        account: Account, receiver: Account) {
            super(name, amount, date, account);
            this.receiverAccount = receiver;
    }

    public getGiverAccount(): Account { return this.account; }
    public getReceiverAccount(): Account { return this.receiverAccount; }
    public preDeleteRoutine() 
    {
        // Here we might do something when an account is deleted with transfer transactions
        // For now it's kept like so
    }
}