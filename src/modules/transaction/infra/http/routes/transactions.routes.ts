import { Router } from 'express';
import { adaptRoute } from '@/core/infra/adapters/ExpressRouteAdapter';
import { makeCreateTransactionFactory } from '../factories/controllers/create-transaction-factory';
import { makeListTransactionsFactory } from '../factories/controllers/list-transactions-factory';
import { createTransactionSchema } from '../schemas/create-transaction.schema';

export const transactionsRouter = Router();

transactionsRouter.post('/create', adaptRoute(makeCreateTransactionFactory(), createTransactionSchema));
transactionsRouter.get('/list', adaptRoute(makeListTransactionsFactory()));
