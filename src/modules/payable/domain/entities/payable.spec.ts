import { describe, expect, it } from 'vitest';

import { CardNumber } from '@/modules/transaction/domain/entities/transaction/card-number';
import { Payable } from './payable';
import { Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';

describe('Payable Entity domain', () => {
  it('Should be able to create', () => {
    const transaction = Transaction.create({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: CardNumber.create('1234567890123456').value as CardNumber,
      card_verification_code: '123',
      payment_method: 'credit_card',
      description: 'Fake description',
      value: 10
    }).value!;

    const payableOrError = Payable.create({
      value: 9.5,
      payment_date: new Date(),
      status: 'waiting_funds',
      transaction_id: transaction.id,
      transaction,
    });

    expect(payableOrError.isRight()).toBeTruthy();
    expect(payableOrError.value).toMatchObject({
      value: 9.5,
      status: 'waiting_funds',
      transaction_id: transaction.id,
    });
    expect(payableOrError.value!.id).toBeTruthy();
  });

  it('Should be able to create a paid payable for debit transactions', () => {
    const transaction = Transaction.create({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: CardNumber.create('1234567890126788').value as CardNumber,
      card_verification_code: '123',
      payment_method: 'debit_card',
      description: 'Fake description',
      value: 10
    }).value!;

    const payableOrError = Payable.create({
      value: 9.7,
      payment_date: new Date(),
      status: 'paid',
      transaction_id: transaction.id,
      transaction,
    });

    expect(payableOrError.isRight()).toBeTruthy();
    expect(payableOrError.value!.status).toStrictEqual('paid');
  });
})
