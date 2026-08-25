import { beforeAll, describe, expect, it } from 'vitest';

import { CardNumber } from '@/modules/transaction/domain/entities/transaction/card-number';
import { ITransactionRepository } from '@/modules/transaction/domain/repositories/transaction-repository';
import { InMemoryTransactionRepository } from '@/modules/transaction/infra/repositories/in-memory/transactions-repository';
import { ListManyTransaction } from './list-many-transactions';
import { Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';

let listManyTransaction: ListManyTransaction;
let transactionRepository: ITransactionRepository;

describe('List Many Transaction use-case', () => {
  beforeAll(() => {
    transactionRepository = new InMemoryTransactionRepository();
    listManyTransaction = new ListManyTransaction(transactionRepository);
  })
  it('Should be able to list all transactions', async () => {
    const transaction = Transaction.create({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: CardNumber.create('1234567890123456').value as CardNumber,
      card_verification_code: '123',
      payment_method: 'credit_card',
      description: 'Fake description',
      value: 10,
    });

    await transactionRepository.create(transaction.value!);

    const response = await listManyTransaction.execute();

    expect(response).toStrictEqual([transaction.value!]);
  });
})