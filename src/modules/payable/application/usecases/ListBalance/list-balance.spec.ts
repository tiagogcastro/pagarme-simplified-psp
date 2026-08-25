import { describe, expect, it } from 'vitest';

import { CardNumber } from '@/modules/transaction/domain/entities/transaction/card-number';
import { IPayableRepository } from '@/modules/payable/domain/repositories/payable-repository';
import { InMemoryPayablesRepository } from '@/modules/payable/infra/repositories/in-memory/payables-repository';
import { ListBalance } from './list-balance';
import { Payable } from '@/modules/payable/domain/entities/payable';
import { Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';

let listBalance: ListBalance;
let payableRepository: IPayableRepository;

describe('List Balance usecase', () => {
  payableRepository = new InMemoryPayablesRepository();

  listBalance = new ListBalance(payableRepository);

  it('it should be able list balance', async () => {
    const transactionWithCreditCard = Transaction.create({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: CardNumber.create(123456789).value as CardNumber,
      card_verification_code: 123,
      payment_method: 'credit_card',
      description: 'Fake description',
      value: 10
    }).value!;

    const transactionWithDebitCard = Transaction.create({
      card_expiration_date: new Date(),
      card_holder_name: 'John Doe',
      card_number: CardNumber.create(123456788).value as CardNumber,
      card_verification_code: 123,
      payment_method: 'debit_card',
      description: 'Fake description',
      value: 10
    }).value!;

    const payableWithWaitingFunds = new Payable({
      payment_date: new Date(),
      status: 'waiting_funds',
      transaction_id: transactionWithCreditCard.id,
      transaction: transactionWithCreditCard,
    });

    const payableWithPaid = new Payable({
      payment_date: new Date(),
      status: 'paid',
      transaction_id: transactionWithDebitCard.id,
      transaction: transactionWithDebitCard,
    });

    await payableRepository.create(payableWithWaitingFunds);
    await payableRepository.create(payableWithPaid);

    const response = await listBalance.execute();

    expect(response).toStrictEqual({
      waiting_funds: {
        payables: [payableWithWaitingFunds],
        balance: transactionWithCreditCard.value,
      },
      available: {
        payables: [payableWithPaid],
        balance: transactionWithDebitCard.value,
      },
    });
  });
});