import { Either, left, right } from '@/core/logic/Either';

import { CardNumber } from '@/modules/transaction/domain/entities/transaction/card-number';
import { InvalidCardNumberError } from '@/modules/transaction/domain/entities/transaction/errors/InvalidCardNumberError';
import { PaymentMethod, Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';
import { ITransactionRepository } from '@/modules/transaction/domain/repositories/transaction-repository';

type CreateTransactionRequest = {
  description?: string;
  payment_method: PaymentMethod;
  card_number: string;
  card_holder_name: string;
  card_expiration_date: Date;
  card_verification_code: string;
  value: number;
}

type CreateTransactionResponse = Either<InvalidCardNumberError, Transaction>;

export class CreateTransaction {
  constructor(
    private transactionRepository: ITransactionRepository,
  ) {}

  async execute(data: CreateTransactionRequest): Promise<CreateTransactionResponse> {
    const { card_number } = data;

    const cardNumberOrError = CardNumber.create(card_number);

    if (cardNumberOrError.isLeft()) {
      return left(cardNumberOrError.value);
    }

    const transaction = new Transaction({
      ...data,
      card_number: cardNumberOrError.value,
    });

    await this.transactionRepository.create(transaction);

    return right(transaction);
  }
}
