import { Either, left, right } from '@/core/logic/Either';

import { InvalidCardNumberError } from './errors/InvalidCardNumberError';

export class CardNumber {
  private readonly card_number: number;

  private constructor(card_number: number) {
    this.card_number = card_number
  }

  get value() {
    return this.card_number;
  }

  static checkIfCardNumberIsInvalid(card_number: number) {
    if (isNaN(card_number)) {
      return true;
    }

    return false;
  }

  static getTheFourLastCardNumber(card_number: number) {
    const result = String(card_number).slice(-4);

    return Number(result);
  }

  static create(card_number: number): Either<InvalidCardNumberError, CardNumber> {
    if (this.checkIfCardNumberIsInvalid(card_number)) {
      return left(new InvalidCardNumberError(card_number));
    }

    card_number = this.getTheFourLastCardNumber(card_number);

    return right(new CardNumber(card_number));
  }
}