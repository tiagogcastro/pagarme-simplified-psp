import { describe, expect, it } from 'vitest';

import { CardNumber } from './card-number';
import { InvalidCardNumberError } from './errors/InvalidCardNumberError';

describe('CardNumber entity domain', () => {
  it('Should be able to create', () => {
    const cardNumberOrError = CardNumber.create(123456789);

    expect(cardNumberOrError.isRight()).toBeTruthy();
  });

  it('Should be able to return an error if it is invalid', () => {
    const cardNumberOrError = CardNumber.create(Number('invalid card number'));

    expect(cardNumberOrError.isLeft()).toBeTruthy();
    expect(cardNumberOrError.value).toBeInstanceOf(InvalidCardNumberError)
  });
})