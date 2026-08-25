import { Either, right } from '@/core/logic/Either';

import { CardNumber } from './card-number';
import { Entity } from '@/core/domain/Entity';

export type PaymentMethod = 'debit_card' | 'credit_card';

export interface ITransaction {
  value: number;
  description?: string;
  payment_method: PaymentMethod;
  card_number: CardNumber;
  card_holder_name: string;
  card_expiration_date: Date;
  card_verification_code: string;
}

export class Transaction extends Entity<ITransaction> {
  constructor(props: ITransaction, id?: string) {
    super(props, id);
  }

  get value() {
    return this.props.value;
  }

  get description() {
    return this.props.description;
  }

  get payment_method() {
    return this.props.payment_method;
  }

  get card_number() {
    return this.props.card_number;
  }

  get card_holder_name() {
    return this.props.card_holder_name;
  }

  get card_expiration_date() {
    return this.props.card_expiration_date;
  }

  get card_verification_code() {
    return this.props.card_verification_code;
  }

  static create(props: ITransaction, id?: string): Either<null, Transaction> {
    const transaction = new Transaction(props, id);

    return right(transaction);
  }
}