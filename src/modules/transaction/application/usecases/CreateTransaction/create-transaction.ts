import { Either, left, right } from '@/core/logic/Either';

import { CardNumber } from '@/modules/transaction/domain/entities/transaction/card-number';
import { InvalidCardNumberError } from '@/modules/transaction/domain/entities/transaction/errors/InvalidCardNumberError';
import { PaymentMethod, Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';
import { ITransactionRepository } from '@/modules/transaction/domain/repositories/transaction-repository';

type CreateTransactionRequest = {
  description?: string;
  payment_method: PaymentMethod;
  card_number: number;
  card_holder_name: string;
  card_expiration_date: Date;
  card_verification_code: number;
  value: number;
}

type CreateTransactionResponse = Either<InvalidCardNumberError, Transaction>;

const FEE_RATES: Record<PaymentMethod, number> = {
  debit_card: 0.03,
  credit_card: 0.05,
};

export class CreateTransaction {
  constructor(
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(data: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const { card_number, value, payment_method } = data;

    const cardNumberOrError = CardNumber.create(card_number);

    if (cardNumberOrError.isLeft()) {
      return left(cardNumberOrError.value);
    }

    const feeRate = FEE_RATES[payment_method];
    const fee = value * feeRate;
    const payableAmount = value - fee;

    const transaction = new Transaction({
      ...data,
      value: payableAmount,
      card_number: cardNumberOrError.value,
    });

    await this.transactionRepository.create(transaction);

    return right(transaction);
  }
}
