import { beforeAll, describe, expect, it } from 'vitest';

import { CreateTransaction } from './create-transaction';
import { Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';
import { ITransactionRepository } from '@/modules/transaction/domain/repositories/transaction-repository';
import { InMemoryTransactionRepository } from '@/modules/transaction/infra/repositories/in-memory/transactions-repository';
import { InvalidCardNumberError } from '@/modules/transaction/domain/entities/transaction/errors/InvalidCardNumberError';
import { PaymentMethod } from '@/modules/transaction/domain/entities/transaction/transaction';

let createTransaction: CreateTransaction;
let transactionRepository: ITransactionRepository;

describe('Create Transaction use-case', () => {
  beforeAll(() => {
    transactionRepository = new InMemoryTransactionRepository();

    createTransaction = new CreateTransaction(transactionRepository);
  })
  it('it should be able to create keeping the full value on the transaction', async () => {
    const response = await createTransaction.execute({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: '1234567890123456',
      card_verification_code: '123',
      payment_method: 'credit_card',
      description: 'Fake description',
      value: 10,
    });

    expect(response.isRight()).toBeTruthy();

    const transaction = response.value as Transaction;

    expect(transaction!.value).toStrictEqual(10);
    expect(transaction!.card_number.value).toStrictEqual('3456');
    expect(await transactionRepository.exists('3456')).toBeTruthy();
  });

  it('it should be able return error if card_number is invalid', async () => {
    const response = await createTransaction.execute({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: 'invalid card number',
      card_verification_code: '123',
      payment_method: 'credit_card',
      description: 'Fake description',
      value: 10,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidCardNumberError)
  });

  it('it should keep the same stored value regardless of payment method', async () => {
    const paymentMethods: PaymentMethod[] = ['debit_card', 'credit_card'];

    for (const payment_method of paymentMethods) {
      const response = await createTransaction.execute({
        card_expiration_date: new Date(),
        card_holder_name: 'John Doe',
        card_number: '1234567812346789',
        card_verification_code: '123',
        payment_method,
        description: 'Fake description',
        value: 100,
      });

      expect(response.isRight()).toBeTruthy();
      expect((response.value as Transaction).value).toStrictEqual(100);
    }
  });
})
