import { Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';
import { ITransactionRepository } from '@/modules/transaction/domain/repositories/transaction-repository';

export class InMemoryTransactionRepository implements ITransactionRepository {
  private transactions: Transaction[] = [];

  async create(transaction: Transaction): Promise<Transaction> {
    this.transactions.push(transaction);

    return transaction;
  }

  async findMany(): Promise<Transaction[]> {
    return [...this.transactions];
  }

  async exists(card_number: string): Promise<Transaction | null> {
    const found = this.transactions.find(
      transaction => transaction.card_number.value === card_number,
    );

    return found ?? null;
  }
}
