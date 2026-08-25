import { Either, right } from '@/core/logic/Either';

import { Entity } from '@/core/domain/Entity';
import { Transaction } from '@/modules/transaction/domain/entities/transaction/transaction';

export type PayableStatus = 'paid' | 'waiting_funds';

export interface IPayable {
  value: number;
  payment_date: Date;
  transaction_id: string;

  status: PayableStatus;

  transaction: Transaction;
}

export class Payable extends Entity<IPayable> {

  constructor(props: IPayable, id?: string) {
    super(props, id);
  }

  get value() {
    return this.props.value;
  }

  get payment_date() {
    return this.props.payment_date;
  }

  get transaction_id() {
    return this.props.transaction_id;
  }

  get status() {
    return this.props.status;
  }

  get transaction() {
    return this.props.transaction;
  }

  static create(props: IPayable, id?: string): Either<null, Payable> {
    const payable = new Payable(props, id);

    return right(payable);
  }
}
