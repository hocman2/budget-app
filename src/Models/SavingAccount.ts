import Account from "./Account";
import TimePeriod from "./TimePeriod";
import Income from "./Income";

// Saving account only handle the saving part of incomes
export default class SavingAccount extends Account {
    
    public addIncomes(...incomes: Array<Income>)
    {
        incomes.forEach((i) => {
            this.increaseAccountValue(i.getSavedAmount().value());
        });
    }

    public getIncomes(timePeriods: TimePeriod[]): Array<Income>
    {
        return timePeriods.map((tp) => tp.getTransactionsOfTypeForAccount(Income, this)).flat();
    }
}