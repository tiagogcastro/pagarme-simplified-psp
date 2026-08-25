import { Payable, PayableStatus } from '@/modules/payable/domain/entities/payable';
import { TransactionMapper } from '@/modules/transaction/domain/mappers/transaction-mapper';

export type PayableResponse = {
  id: string;
  payment_date: Date;
  status: PayableStatus;
  transaction_id: string;
}

export type PayableWithTransactionResponse = PayableResponse & {
  transaction: ReturnType<typeof TransactionMapper.transformForResponse>;
}

export class PayableMapper {
  static transformForResponse(
    payable: Payable,
    options?: { omitTransaction?: boolean },
  ): PayableResponse | PayableWithTransactionResponse {
    const base: PayableResponse = {
      id: payable.id,
      payment_date: payable.payment_date,
      status: payable.status,
      transaction_id: payable.transaction_id,
    };

    if (options?.omitTransaction) {
      return base;
    }

    return {
      ...base,
      transaction: TransactionMapper.transformForResponse(payable.transaction),
    };
  }
}
