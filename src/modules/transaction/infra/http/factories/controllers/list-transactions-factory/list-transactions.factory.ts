import { ITransactionRepository } from '@/modules/transaction/domain/repositories/transaction-repository';
import { ListManyTransaction } from '@/modules/transaction/application/usecases/ListTransactions/list-many-transactions';
import { ListTransactionsController } from '@/modules/transaction/application/usecases/ListTransactions/list-many-transactions.controller';

export function listTransactionsFactory(
  transactionRepository: ITransactionRepository,
) {
  const listTransactions = new ListManyTransaction(transactionRepository);

  const listTransactionsController = new ListTransactionsController(
    listTransactions,
  );

  return listTransactionsController;
}