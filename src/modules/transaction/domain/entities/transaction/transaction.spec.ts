import { describe, expect, it } from 'vitest';

import { CardNumber } from './card-number';
import { Transaction } from './transaction';

describe('Transaction entity domain', () => {
  it('Should be able to create', () => {
    const card_expiration_date = new Date();
    const card_number = CardNumber.create('1234567890123456').value as CardNumber;

    const transactionOrError = Transaction.create({
      card_expiration_date,
      description: 'fake',
      card_holder_name: 'John Doe',
      card_number,
      card_verification_code: '123',
      payment_method: 'credit_card',
      value: 10,
    });

    expect(transactionOrError.isRight()).toBeTruthy();
    expect(transactionOrError.value).toMatchObject({
      description: 'fake',
      card_holder_name: 'John Doe',
      card_verification_code: '123',
      payment_method: 'credit_card',
      card_expiration_date,
      value: 10,
    });
    expect(transactionOrError.value!.card_number).toBeInstanceOf(CardNumber);
  });
})
