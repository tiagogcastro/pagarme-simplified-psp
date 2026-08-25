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

describe('Create Payable usecase', () => {
  payableRepository = new InMemoryPayablesRepository();
  dateProvider = new DateFnsProvider();

  createPayable = new CreatePayable(payableRepository, dateProvider);

  it('it should be able create with waiting_funds status if payment method is credit_card', async () => {
    const transaction = Transaction.create({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: CardNumber.create(123456789).value as CardNumber,
      card_verification_code: 123,
      payment_method: 'credit_card',
      description: 'Fake description',
      value: 10
    }).value!;

    const response = await createPayable.execute({
      transaction
    });

    expect(response.status).toStrictEqual('waiting_funds');
  });

  it('30 days must be added to payment_date if payment method is credit_card', async () => {
    const transaction = Transaction.create({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: CardNumber.create(123456789).value as CardNumber,
      card_verification_code: 123,
      payment_method: 'credit_card',
      description: 'Fake description',
      value: 10

    }).value!;

    const response = await createPayable.execute({
      transaction
    });

    const payment_date = response.payment_date;

    const dateNowThirtyDayAfter = dateProvider.add(new Date(), {
      days: 30,
    });

    const differenceDays = dateProvider.differenceInDays(payment_date, dateNowThirtyDayAfter);

    expect(differenceDays).toStrictEqual(0);
  });

  it('it should be able create with paid status if payment method is debit_card', async () => {
    const transaction = Transaction.create({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: CardNumber.create(123456789).value as CardNumber,
      card_verification_code: 123,
      payment_method: 'debit_card',
      description: 'Fake description',
      value: 10
    }).value!;

    const response = await createPayable.execute({
      transaction
    });

    expect(response.status).toStrictEqual('paid');
  });
});