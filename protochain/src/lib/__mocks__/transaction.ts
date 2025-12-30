import TransactionType from "../transactionType";
import Validation from "../validation";

/**
 * Mocked Transaction class
 */
export default class Transaction {
  type: TransactionType;
  timestamp: number;
  hash: string;
  data: string;

  /**
   * Creates a new tx
   * @param tx The tx data
   */
  constructor(tx?: Transaction) {
    this.type = tx?.type || TransactionType.REGULAR;
    this.timestamp = tx?.timestamp || Date.now();
    this.data = tx?.data || "";
    this.hash = tx?.hash || this.getHash();
  }

  getHash(): string {
    return "abc";
  }

  isValid(): Validation {
    if (!this.data)
      return new Validation(false, "Invalid mocked transaction data.");
    return new Validation();
  }
}
