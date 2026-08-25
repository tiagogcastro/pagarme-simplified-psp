import { IPayableRepository } from '@/modules/payable/domain/repositories/payable-repository';
import { Payable } from '@/modules/payable/domain/entities/payable';

export type ListBalanceResponse = {
  available: {
    payables: Payable[];
    balance: number;
  };
  waiting_funds: {
    payables: Payable[];
    balance: number;
  };
};

export class ListBalance {
  constructor(
    private payableRepository: IPayableRepository,
  ) {}

  async execute(): Promise<ListBalanceResponse> {
    const available = await this.payableRepository.findManyByStatus('paid');
    const waiting_funds = await this.payableRepository.findManyByStatus('waiting_funds');

    const availableBalance = available.reduce((acc, current) => {
      return acc + current.value;
    }, 0);

    const waitingFundsBalance = waiting_funds.reduce((acc, current) => {
      return acc + current.value;
    }, 0);

    return {
      available: {
        payables: available,
        balance: availableBalance,
      },
      waiting_funds: {
        payables: waiting_funds,
        balance: waitingFundsBalance,
      },
    };
  }
}
