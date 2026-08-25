import { Router } from 'express';
import { adaptRoute } from '@/core/infra/adapters/ExpressRouteAdapter';
import { makeListBalanceFactory, } from '../factories/controllers/list-balance-factory';

export const payablesRouter = Router();

payablesRouter.get('/list-balance', adaptRoute(makeListBalanceFactory()));