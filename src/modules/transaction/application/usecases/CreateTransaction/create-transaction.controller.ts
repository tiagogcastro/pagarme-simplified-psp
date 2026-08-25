import { clientError, created } from '@/core/infra/HttpResponse';

import { Controller } from '@/core/infra/Controller';
import { CreatePayable } from '@/modules/payable/application/usecases/CreatePayable/create-payable';
import { PayableMapper } from '@/modules/payable/domain/mappers/payable-mapper';
import { PaymentMethod } from '@/modules/transaction/domain/entities/transaction/transaction';
import { TransactionMapper } from '@/modules/transaction/domain/mappers/transaction-mapper';
import { CreateTransaction } from './create-transaction';

type CreateTransactionRequest = {
  description?: string;
  payment_method: PaymentMethod;
  card_number: number;
  card_holder_name: string;
  card_expiration_date: Date;
  card_verification_code: number;
  value: number;
}

export class CreateTransactionController implements Controller {
  constructor(
    private readonly createTransaction: CreateTransaction,
    private readonly createPayable: CreatePayable,
  ) {}

  async handle(request: CreateTransactionRequest) {
    const transactionOrError = await this.createTransaction.execute(request);

    if (transactionOrError.isLeft()) {
      return clientError(transactionOrError.value);
    }

    const transaction = transactionOrError.value;

    const payable = await this.createPayable.execute({
      transaction,
    });

    const success = {
      transaction: TransactionMapper.transformForResponse(transaction),
      payable: PayableMapper.transformForResponse(payable, {
        omitTransaction: true,
      }),
    };

    return created(success);
  }
}
