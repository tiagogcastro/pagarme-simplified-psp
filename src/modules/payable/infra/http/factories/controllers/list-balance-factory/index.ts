import { InMemoryPayablesRepository } from '@/modules/payable/infra/repositories/in-memory/payables-repository';
import { listBalanceFactory } from './list-balance.factory';

export function makeListBalanceFactory() {
  const payableRepository = new InMemoryPayablesRepository();

  const make = listBalanceFactory(
    payableRepository,
  )

  return make;
}