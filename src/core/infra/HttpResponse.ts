export type HttpResponse = {
  statusCode: number;
  body: unknown;
}

export function ok<T>(data: T): HttpResponse {
  return {
    statusCode: 200,
    body: { data },
  };
}

export function created<T>(data: T): HttpResponse {
  return {
    statusCode: 201,
    body: { data },
  };
}

export function clientError(error: Error): HttpResponse {
  return {
    statusCode: 400,
    body: {
      error: {
        message: error.message,
        name: error.name,
      },
    },
  };
}
