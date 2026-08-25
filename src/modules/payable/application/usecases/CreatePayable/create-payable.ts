import { IPayable, Payable, PayableStatus } from '@/modules/payable/domain/entities/payable';
import { CREDIT_INSTALLMENTS, FEE_RATE_BY_PAYMENT_METHOD } from '@/modules/payable/domain/payable-fee';
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

  async execute({ transaction }: CreatePayableInput): Promise<Payable[]> {
    const grossCents = Math.round(transaction.value * 100);
    const feeRate = FEE_RATE_BY_PAYMENT_METHOD[transaction.payment_method];
    const netCents = grossCents - Math.round(grossCents * feeRate);

    if (transaction.payment_method === 'debit_card') {
      const payable = this.buildPayable({
        transaction,
        status: 'paid',
        value: netCents / 100,
        paymentDate: this.dateProvider.add(new Date(), { days: 1 }),
      });

      await this.payableRepository.create(payable);

      return [payable];
    }

    const installmentCents = Math.floor(netCents / CREDIT_INSTALLMENTS);
    const lastInstallmentCents = netCents - installmentCents * (CREDIT_INSTALLMENTS - 1);

    const payables: Payable[] = [];

    for (let installment = 1; installment <= CREDIT_INSTALLMENTS; installment++) {
      const isLast = installment === CREDIT_INSTALLMENTS;

      payables.push(
        this.buildPayable({
          transaction,
          status: 'waiting_funds',
          value: (isLast ? lastInstallmentCents : installmentCents) / 100,
          paymentDate: this.dateProvider.add(new Date(), { days: 30 * installment }),
        })
      );
    }

    for (const payable of payables) {
      await this.payableRepository.create(payable);
    }

    return payables;
  }

  private buildPayable(input: {
    transaction: Transaction;
    status: PayableStatus;
    value: number;
    paymentDate: Date;
  }): Payable {
    const payableInput: IPayable = {
      value: input.value,
      payment_date: input.paymentDate,
      status: input.status,
      transaction: input.transaction,
      transaction_id: input.transaction.id,
    };

    return new Payable(payableInput);
  }
}
