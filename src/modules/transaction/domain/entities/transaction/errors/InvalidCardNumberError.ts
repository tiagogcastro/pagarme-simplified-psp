import { DomainError } from '@/core/domain/errors/DomainError';

export class InvalidCardNumberError extends Error implements DomainError {
  constructor(card_number: string) {
    super(`The card number ${card_number} is invalid.`)
    this.name = 'InvalidCardNumberError'
  }
}
