import Transaction from "./Transaction";

/// A type of transaction used when editing an account's value manually.
/// Changing the account's value directly would not work since all transactions would deduce
/// from that new amount
export default class Balancing extends Transaction
{

}