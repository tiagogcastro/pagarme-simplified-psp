import { InMemoryTransactionRepository } from '@/modules/transaction/infra/repositories/in-memory/transactions-repository';
import { listTransactionsFactory } from './list-transactions.factory';

export function makeListTransactionsFactory() {
  const transactionRepository = new InMemoryTransactionRepository();

  const make = listTransactionsFactory(
    transactionRepository,
  )

  return make;
}