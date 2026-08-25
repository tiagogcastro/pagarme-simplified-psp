import { Payable, PayableStatus } from '../entities/payable';

export interface IPayableRepository {
  create(payable: Payable): Promise<Payable>;
  exists(payable_id: string): Promise<Payable | null>;
  findManyByStatus(payable_status: PayableStatus): Promise<Payable[]>;
  findMany(): Promise<Payable[]>;
}
