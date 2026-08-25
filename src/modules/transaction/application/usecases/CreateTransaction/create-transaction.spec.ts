import { beforeAll, describe, expect, it } from 'vitest';

import { CreateTransaction } from './create-transaction';
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
  it('it should be able to create', async () => {
    const response = await createTransaction.execute({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: 123456789,
      card_verification_code: 123,
      payment_method: 'credit_card',
      description: 'Fake description',
      value: 10,
    });

    expect(await transactionRepository.exists(6789)).toBeTruthy();
    expect(response.isRight()).toBeTruthy();
  });

  it('it should be able return error if card_number is invalid', async () => {
    const response = await createTransaction.execute({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: Number('Invalid card number'),
      card_verification_code: 123,
      payment_method: 'credit_card',
      description: 'Fake description',
      value: 10,
    });

    expect(response.isLeft()).toBeTruthy();
    expect(response.value).toBeInstanceOf(InvalidCardNumberError)
  });

  it('must be able to create with processing fee using credit card', async () => {
    const value = 10;
    const payment_method = 'credit_card';;

    const feeRateOptions = {
      debit_card: 0.03,
      credit_card: 0.05,
    };

    const feeRate = feeRateOptions[payment_method];
    const fee = value * feeRate;
    const payableAmount = value - fee;

    const transaction = {
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: 123456789,
      card_verification_code: 123,
      payment_method: payment_method as PaymentMethod,
      description: 'Fake description',
      value: payableAmount,
    };

    const response = await createTransaction.execute(transaction);

    expect(await transactionRepository.exists(6789)).toBeTruthy();
    expect(response.isRight()).toBeTruthy();
  });

  it('must be able to create with processing fee using debit card', async () => {
    const value = 10;
    const payment_method = 'debit_card';;

    const feeRateOptions = {
      debit_card: 0.03,
      credit_card: 0.05,
    };

    const feeRate = feeRateOptions[payment_method];
    const fee = value * feeRate;
    const payableAmount = value - fee;

    const transaction = {
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: 123456789,
      card_verification_code: 123,
      payment_method: payment_method as PaymentMethod,
      description: 'Fake description',
      value: payableAmount,
    };

    const response = await createTransaction.execute(transaction);

    expect(await transactionRepository.exists(6789)).toBeTruthy();
    expect(response.isRight()).toBeTruthy();
  });
})