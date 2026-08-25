import { Payable, PayableStatus } from '@/modules/payable/domain/entities/payable';
import { IPayableRepository } from '@/modules/payable/domain/repositories/payable-repository';

export class InMemoryPayablesRepository implements IPayableRepository {
  private payables: Payable[] = [];

  async create(payable: Payable): Promise<Payable> {
    this.payables.push(payable);

    return payable;
  }

  async exists(payable_id: string): Promise<Payable | null> {
    const found = this.payables.find(payable => payable.id === payable_id);

    return found ?? null;
  }

  async findMany(): Promise<Payable[]> {
    return [...this.payables];
  }

  async findManyByStatus(payable_status: PayableStatus): Promise<Payable[]> {
    return this.payables.filter(payable => payable.status === payable_status);
  }
}
