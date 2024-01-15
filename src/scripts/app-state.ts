import Budget from '../Models/Budget';
import Category from '../Models/Category';
import MoneyValue from '../Models/MoneyValue';
import SpendingAccount from '../Models/SpendingAccount';
import SavingAccount from '../Models/SavingAccount';
import TimePeriod, { TransactionType } from '../Models/TimePeriod';
import { periodDuration } from './constants';
import UserAccounts from '../Models/UserAccounts';

// Re-exported for convenience
export { today, periodDuration } from './constants';

// Think of it as an enum that holds Category objects
export class Categories {

  static readonly None = undefined;
  static readonly Errands = new Category("Errands");
  static readonly Gas = new Category("Gas"); 
  static readonly Clothing = new Category("Clothing");
  static readonly Other = new Category("Other");
  static readonly Education = new Category("Education");
  static readonly House = new Category("House");
  static readonly Fixed = new Category("Fixed Expenses");

  /// Returns the Category object associated with the given identifier
  /// Identifier is expected to be a property name of Categories
  static getCategory(identifier: string): Category|undefined
  {
      let value: Category|undefined = (Categories as any)[identifier]; // 🖕 typechecking
      return value;
  }

  /// Returns the first identifier found for the given Category
  static getIdentifier(value: Category): string|null
  {
      let foundItem = Object.entries(Categories).find((cat) => cat[1] instanceof Category && cat[1] === value);

      return (foundItem) ? <string>foundItem[0] : null;
  }

  static getAllIdentifiers(includeNone: boolean = false): Array<string>
  {
    if (includeNone)
    {
      return Object.keys(Categories);
    }

    return Object.keys(Categories).filter((key) => key !== "None");
  }

  private constructor() {}
};

export let timePeriods: Array<TimePeriod> = [
  new TimePeriod(new Date(2023, 8, 20), periodDuration),
];

export let currentTimePeriod = timePeriods[timePeriods.length-1];

let spendingAccounts: Array<SpendingAccount> = [
    new SpendingAccount("Main account", new MoneyValue(0)),
    new SpendingAccount("Cash", new MoneyValue(315)),
];

let savingAccounts: Array<SavingAccount> = [
    new SavingAccount("Bank account", new MoneyValue(0)),
];

export let userAccounts = UserAccounts.get().set(spendingAccounts, savingAccounts);

export let budgets: Array<Budget> = [
  new Budget("Food", new MoneyValue(250), 1, [Categories.Errands]),
  new Budget("Gas", new MoneyValue(170), 1, [Categories.Gas]),
  new Budget("Clothing", new MoneyValue(200), 1, [Categories.Clothing]),
];

currentTimePeriod.makeAndAdd(
  {
    type: TransactionType.Income,
    name: "Salary",
    amount: new MoneyValue(1534.22),
    date: new Date(2023, 8, 22),
    account: spendingAccounts[0],
    savingPercent: .1,
    otherAccount: userAccounts.getSavingAccounts()[0]
  },
  {
    type: TransactionType.Expense,
    name: "Errands",
    amount: new MoneyValue(84.27),
    category: Categories.Errands,
    date: new Date(2023, 8, 22),
    account: userAccounts.getSpendingAccounts()[0],
  },
  {
    type: TransactionType.Expense,
    name: "Car insurance",
    amount: new MoneyValue(112.33),
    category: Categories.Fixed,
    date: new Date(2023, 8, 22),
    account: userAccounts.getSpendingAccounts()[0],
  },
);