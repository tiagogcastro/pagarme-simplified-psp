import { IPayable, Payable, PayableStatus } from '@/modules/payable/domain/entities/payable';
import { IPayableRepository } from '@/modules/payable/domain/repositories/payable-repository';
import { Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';
import { DateProvider } from '@/shared/providers/date/models/date-provider';

export type CreatePayableInput = {
  transaction: Transaction;
}

export class CreatePayable {
  constructor(
    private payableRepository: IPayableRepository,
    private dateProvider: DateProvider,
  ) {}

  async execute({ transaction }: CreatePayableInput): Promise<Payable> {
    let paymentDate = new Date();
    let status: PayableStatus = 'waiting_funds';

    if (transaction.payment_method === 'debit_card') {
      status = 'paid';
    }

    if (transaction.payment_method === 'credit_card') {
      paymentDate = this.dateProvider.add(paymentDate, {
        days: 30,
      });
    }

    const payableInput: IPayable = {
      payment_date: paymentDate,
      status,
      transaction,
      transaction_id: transaction.id,
    };

    const payable = new Payable(payableInput);

    await this.payableRepository.create(payable);

    return payable;
  }
}
