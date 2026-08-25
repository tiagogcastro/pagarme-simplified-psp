import { Router } from 'express';
import { adaptRoute } from '@/core/infra/adapters/ExpressRouteAdapter';
import { makeCreateTransactionFactory } from '../factories/controllers/create-transaction-factory';
import { makeListTransactionsFactory } from '../factories/controllers/list-transactions-factory';

export const transactionsRouter = Router();

transactionsRouter.post('/create', adaptRoute(makeCreateTransactionFactory()));
transactionsRouter.get('/list', adaptRoute(makeListTransactionsFactory()));