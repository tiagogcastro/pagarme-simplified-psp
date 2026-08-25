import { dateProvider, payablesRepository, transactionRepository } from '@/shared/container';
import { createTransactionFactory } from './create-transaction.factory';

export function makeCreateTransactionFactory() {
  return createTransactionFactory(
    transactionRepository,
    payablesRepository,
    dateProvider,
  );
}
