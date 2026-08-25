import { Either, left, right } from '@/core/logic/Either';

import { InvalidCardNumberError } from './errors/InvalidCardNumberError';

const MIN_CARD_NUMBER_DIGITS = 12;
const MAX_CARD_NUMBER_DIGITS = 19;

export class CardNumber {
  private readonly lastFourDigits: string;

  private constructor(lastFourDigits: string) {
    this.lastFourDigits = lastFourDigits;
  }

  get value(): string {
    return this.lastFourDigits;
  }

  static sanitize(rawCardNumber: string): string {
    return rawCardNumber.replace(/[\s-]/g, '');
  }

  static isValidDigitString(cardNumber: string): boolean {
    const digitCount = cardNumber.length;

    return (
      digitCount >= MIN_CARD_NUMBER_DIGITS &&
      digitCount <= MAX_CARD_NUMBER_DIGITS &&
      /^\d+$/.test(cardNumber)
    );
  }

  static create(card_number: string): Either<InvalidCardNumberError, CardNumber> {
    const sanitized = CardNumber.sanitize(card_number);

    if (!CardNumber.isValidDigitString(sanitized)) {
      return left(new InvalidCardNumberError(card_number));
    }

    return right(new CardNumber(sanitized.slice(-4)));
  }
}
