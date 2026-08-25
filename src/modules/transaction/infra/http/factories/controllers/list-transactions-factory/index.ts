import { transactionRepository } from '@/shared/container';
import { listTransactionsFactory } from './list-transactions.factory';

export function makeListTransactionsFactory() {
  return listTransactionsFactory(transactionRepository);
}
