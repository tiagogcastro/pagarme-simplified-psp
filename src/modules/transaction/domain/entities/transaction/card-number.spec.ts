import { describe, expect, it } from 'vitest';

import { CardNumber } from './card-number';
import { InvalidCardNumberError } from './errors/InvalidCardNumberError';

describe('CardNumber entity domain', () => {
  it('Should be able to create and store only the last four digits', () => {
    const cardNumberOrError = CardNumber.create('1234567890123456');

    expect(cardNumberOrError.isRight()).toBeTruthy();

    const cardNumber = cardNumberOrError.value as CardNumber;

    expect(cardNumber.value).toBe('3456');
  });

  it('Should ignore spaces and dashes before validating', () => {
    const cardNumberOrError = CardNumber.create('1234 5678-9012-3456');

    expect(cardNumberOrError.isRight()).toBeTruthy();

    const cardNumber = cardNumberOrError.value as CardNumber;

    expect(cardNumber.value).toBe('3456');
  });

  it('Should be able to return an error if it has non digit characters', () => {
    const cardNumberOrError = CardNumber.create('invalid card number');

    expect(cardNumberOrError.isLeft()).toBeTruthy();
    expect(cardNumberOrError.value).toBeInstanceOf(InvalidCardNumberError)
  });

  it('Should be able to return an error if it is too short or too long', () => {
    const tooShort = CardNumber.create('12345678901');
    const tooLong = CardNumber.create('12345678901234567890');

    expect(tooShort.isLeft()).toBeTruthy();
    expect(tooLong.isLeft()).toBeTruthy();
  });
})
