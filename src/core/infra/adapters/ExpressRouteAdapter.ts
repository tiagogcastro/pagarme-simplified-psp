import { NextFunction, Request, Response } from 'express';
import { ZodError, ZodType } from 'zod';

import { Controller } from '../Controller';
import { HttpResponse } from '../HttpResponse';

type RequestData = Record<string, unknown>;

const collectRequestData = (request: Request): RequestData => {
  return {
    ...request.body,
    ...request.params,
    ...request.query,
  };
};

export const adaptRoute = (controller: Controller, schema?: ZodType) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    try {
      const requestData = collectRequestData(request);

      const data = schema ? await schema.parseAsync(requestData) : requestData;

      const result: HttpResponse = await controller.handle(data);

      return response.status(result.statusCode).json(result.body);
    } catch (error) {
      return next(error);
    }
  };
};

export { ZodError };
