import { IPayableRepository } from '@/modules/payable/domain/repositories/payable-repository';
import { ListBalance } from '@/modules/payable/application/usecases/ListBalance/list-balance';
import { ListBalanceController } from '@/modules/payable/application/usecases/ListBalance/list-balance.controller';

export function listBalanceFactory(
  payableRepository: IPayableRepository,
) {
  const listBalance = new ListBalance(payableRepository);

  const listBalanceController = new ListBalanceController(
    listBalance,
  );

  return listBalanceController;
}