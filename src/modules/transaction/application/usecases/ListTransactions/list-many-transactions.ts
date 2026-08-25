import { ITransactionRepository } from '@/modules/transaction/domain/repositories/transaction-repository';
import { Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';

export class ListManyTransaction {
  constructor(
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(): Promise<Transaction[]> {
    const transactions = await this.transactionRepository.findMany();

    return transactions;
  }
}
