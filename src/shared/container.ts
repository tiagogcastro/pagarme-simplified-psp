import { InMemoryPayablesRepository } from '@/modules/payable/infra/repositories/in-memory/payables-repository';
import { InMemoryTransactionRepository } from '@/modules/transaction/infra/repositories/in-memory/transactions-repository';
import { DateFnsProvider } from '@/shared/providers/date/implementations/date-fns.provider';

export const dateProvider = new DateFnsProvider();
export const transactionRepository = new InMemoryTransactionRepository();
export const payablesRepository = new InMemoryPayablesRepository();
