import { describe, expect, it } from 'vitest';

import { CardNumber } from '@/modules/transaction/domain/entities/transaction/card-number';
import { CreatePayable } from './create-payable';
import { DateFnsProvider } from '@/shared/providers/date/implementations/date-fns.provider';
import { DateProvider } from '@/shared/providers/date/models/date-provider';
import { IPayableRepository } from '@/modules/payable/domain/repositories/payable-repository';
import { InMemoryPayablesRepository } from '@/modules/payable/infra/repositories/in-memory/payables-repository';
import { Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';

let createPayable: CreatePayable;
let payableRepository: IPayableRepository;
let dateProvider: DateProvider;

const buildTransaction = (
  payment_method: 'credit_card' | 'debit_card',
  value: number,
): Transaction => {
  return Transaction.create({
    card_expiration_date: new Date(),
    card_holder_name: 'John Doe',
    card_number: CardNumber.create('1234567890123456').value as CardNumber,
    card_verification_code: '123',
    payment_method,
    description: 'Fake description',
    value,
  }).value!;
};

describe('Create Payable usecase', () => {
  payableRepository = new InMemoryPayablesRepository();
  dateProvider = new DateFnsProvider();

  createPayable = new CreatePayable(payableRepository, dateProvider);

  it('it should create one paid payable for a debit card', async () => {
    const transaction = buildTransaction('debit_card', 100);

    const payables = await createPayable.execute({
      transaction,
    });

    expect(payables).toHaveLength(1);

    const payable = payables[0]!;

    expect(payable.status).toStrictEqual('paid');

    const expectedDate = dateProvider.add(new Date(), { days: 1 });

    expect(dateProvider.differenceInDays(payable.payment_date, expectedDate)).toStrictEqual(0);

    expect(payable.value).toBeCloseTo(97, 10);
  });

  it('it should create four waiting_funds payables spaced by 30 days for a credit card', async () => {
    const transaction = buildTransaction('credit_card', 100);

    const payables = await createPayable.execute({
      transaction,
    });

    expect(payables).toHaveLength(4);

    payables.forEach((payable, index) => {
      expect(payable.status).toStrictEqual('waiting_funds');
      expect(payable.transaction_id).toStrictEqual(transaction.id);

      const expectedDate = dateProvider.add(new Date(), { days: 30 * (index + 1) });

      expect(dateProvider.differenceInDays(payable.payment_date, expectedDate)).toStrictEqual(0);
    });
  });

  it('it should discount the fee on the payable values splitting credit into four parts', async () => {
    const transaction = buildTransaction('credit_card', 10);

    const payables = await createPayable.execute({
      transaction,
    });

    const total = payables.reduce((acc, payable) => acc + payable.value, 0);

    expect(total).toBeCloseTo(9.5, 10);

    expect(payables.map(payable => payable.value)).toStrictEqual([2.37, 2.37, 2.37, 2.39]);
  });
});
