import { payablesRepository } from '@/shared/container';
import { listBalanceFactory } from './list-balance.factory';

export function makeListBalanceFactory() {
  return listBalanceFactory(payablesRepository);
}
