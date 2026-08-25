import { fail, ok } from '@/core/infra/HttpResponse';

import { Controller } from '@/core/infra/Controller';
import { PayableMapper } from '@/modules/payable/domain/mappers/payable-mapper';
import { ListBalance } from './list-balance';

export class ListBalanceController implements Controller {
  constructor(
    private readonly listBalance: ListBalance,
  ) {}

  async handle() {
    try {
      const balance = await this.listBalance.execute();

      const result = {
        available: {
          ...balance.available,
          payables: balance.available.payables.map(payable =>
            PayableMapper.transformForResponse(payable),
          ),
        },
        waiting_funds: {
          ...balance.waiting_funds,
          payables: balance.waiting_funds.payables.map(payable =>
            PayableMapper.transformForResponse(payable),
          ),
        },
      };

      return ok(result);
    } catch (error) {
      return fail(error);
    }
  }
}
