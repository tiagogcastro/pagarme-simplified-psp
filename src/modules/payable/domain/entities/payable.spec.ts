import { describe, expect, it } from 'vitest';

import { CardNumber } from '@/modules/transaction/domain/entities/transaction/card-number';
import { Payable } from './payable';
import { Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';

describe('Payable Entity domain', () => {
  it('it should be able create with paid status', () => {
    const transaction = Transaction.create({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: CardNumber.create(123456789).value as CardNumber,
      card_verification_code: 123,
      payment_method: 'debit_card',
      description: 'Fake description',
      value: 10
    }).value!;

    const payment_date = new Date();
    const status = 'paid';

    const payableOrError = Payable.create({
      payment_date,
      status,
      transaction_id: transaction.id,
      transaction,
    });

    expect(payableOrError.value).toMatchObject({
      payment_date,
      status,
      transaction_id: transaction.id,
      transaction,
    });
  });

  it('it should be able create with waiting_funds status', () => {
    const transaction = Transaction.create({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: CardNumber.create(123456789).value as CardNumber,
      card_verification_code: 123,
      payment_method: 'credit_card',
      description: 'Fake description',
      value: 10
    }).value!;

    const payment_date = new Date();
    const status = 'waiting_funds';

    const payableOrError = Payable.create({
      payment_date,
      status,
      transaction_id: transaction.id,
      transaction,
    });

    expect(payableOrError.value).toMatchObject({
      payment_date,
      status,
      transaction_id: transaction.id,
      transaction,
    });
  });
});