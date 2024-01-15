import { currentTimePeriod } from "../scripts/app-state";
import type Account from "./Account";
import type SavingAccount from "./SavingAccount";
import type SpendingAccount from "./SpendingAccount";

// A singleton class that holds user accounts, mainly used to get notified when accounts are changed
export default class UserAccounts {
    private spendingAccounts: Array<SpendingAccount> = [];
    private savingAccounts: Array<SavingAccount> = [];

    private updateCallbacks: Array<() => void> = [];

    private timeoutId: number|undefined = undefined;

    private static instance: UserAccounts|null = null;

    private constructor()
    {
        UserAccounts.instance = this;
    }
    
    public set(spendingAccounts: SpendingAccount[], savingAccounts: SavingAccount[])
    {
        let instance = UserAccounts.get();
        instance.spendingAccounts = spendingAccounts;
        instance.savingAccounts = savingAccounts;
        return instance;
    }

    public static get(): UserAccounts
    { 
        if (UserAccounts.instance === null)
        {
            return new UserAccounts();
        }

        return UserAccounts.instance; 
    }

    public getSpendingAccounts() { return this.spendingAccounts; }
    public getSavingAccounts() { return this.savingAccounts; }
    public getAllAccounts(): Account[] { return this.spendingAccounts.concat(...this.savingAccounts); }

    public addSavingAccount(account: SavingAccount)
    {
        UserAccounts.instance!.savingAccounts.push(account);
        UserAccounts.instance!.requestUpdate();
    }

    public addSpendingAccount(account: SpendingAccount)
    {
        UserAccounts.instance!.spendingAccounts.push(account);
        UserAccounts.instance!.requestUpdate();
    }

    public onAccountsUpdated(callback: () => void)
    {
        this.updateCallbacks.push(callback);
    }

    public deleteAccount(id: number)
    {
        //this is normally the job of a backend

        let instance = UserAccounts.instance!;
        
        // Try to find index of account in spending accounts first
        let idx = instance.spendingAccounts.findIndex((a) => a.id === id);
        // Look for id in saving accounts
        if (idx === -1)
        {
            idx = instance.savingAccounts.findIndex((a) => a.id === id);
            if (idx === -1) return;

            let deletedAccount: Account = instance.savingAccounts.splice(idx, 1)[0];
            instance.removeRelatedTransactions(deletedAccount);
            instance.requestUpdate();
        }
        // Found in spending accounts
        else
        {
            // Remove and update
            let deletedAccount: Account = instance.spendingAccounts.splice(idx, 1)[0];
            instance.removeRelatedTransactions(deletedAccount);
            instance.requestUpdate();
        }
    }

    private removeRelatedTransactions(account: Account)
    {
        // Only for current time period because this demo app only features one time period, otherwise
        // it'd be in all time periods
        let transactions = currentTimePeriod.getTransactionsForAccount(account);
        currentTimePeriod.removeTransactions(transactions);
    }

    public requestUpdate()
    {
        // If an update is already pending, no need to do anything
        if (this.timeoutId) {return;}
        
        // Set an update next tick, this allows us to receive multiple update request but fire the event only once
        this.timeoutId = setTimeout(this.runCallbacks, 0);
    }

    private runCallbacks()
    {
        let instance = UserAccounts.get();
        instance.updateCallbacks.forEach((cb) => cb());
        instance.timeoutId = undefined;
    }
}