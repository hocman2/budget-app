export enum Currency { Euro = '€', Dollar = '$', Yen = '¥'};

export default class MoneyValue {
    public readonly amount: number;
    public static readonly currencyType: Currency = Currency.Euro;

    public constructor(amount: number)
    {
        this.amount = amount;
    }

    value(): number
    {
        return this.amount;
    }

    toString() : string
    {
        const [integerPart, decimalPart] = this.amount.toFixed(2).toString().split('.');
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, "'");

        return `${formattedInteger},${decimalPart}${MoneyValue.currencyType}`;
    }

    static currency() { return MoneyValue.currencyType; }
}