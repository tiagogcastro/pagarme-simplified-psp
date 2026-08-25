import { fail, ok } from '@/core/infra/HttpResponse';

import { Controller } from '@/core/infra/Controller';
import { TransactionMapper } from '@/modules/transaction/domain/mappers/transaction-mapper';
import { ListManyTransaction } from './list-many-transactions';

export class ListTransactionsController implements Controller {
  constructor(
    private readonly listTransactions: ListManyTransaction,
  ) {}

  async handle() {
    try {
      const transactions = await this.listTransactions.execute();

      const success = {
        transaction: transactions.map(transaction =>
          TransactionMapper.transformForResponse(transaction),
        ),
      };

      return ok(success);
    } catch (error) {
      return fail(error);
    }
  }
}
