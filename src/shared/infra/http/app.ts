import cors from 'cors';
import express, { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

import { router } from './routes';

const app = express();

app.use(
  cors({
    exposedHeaders: ['x-total-count', 'Content-Type', 'Content-Length'],
  })
);

app.use(
  express.json({
    type: ['application/json', 'text/plain'],
  })
);

app.use(router);

const notFoundHandler: RequestHandler = (request, response) => {
  return response.status(404).json({
    error: {
      message: `Cannot ${request.method} ${request.originalUrl}`,
      name: 'NotFoundError',
    },
  });
};

const globalErrorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof ZodError) {
    return response.status(400).json({
      error: {
        message: 'Validation failed',
        name: 'ValidationError',
        details: error.issues.map(issue => ({
          field: issue.path.join('.'),
          message: issue.message,
        })),
      },
    });
  }

  console.error(error);

  return response.status(500).json({
    error: {
      message: 'Internal server error',
      name: 'InternalServerError',
    },
  });
};

app.use(notFoundHandler);
app.use(globalErrorHandler);

export { app };
