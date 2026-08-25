import { HttpResponse } from './HttpResponse';

export interface Controller<T = unknown> {
  handle(request: T): Promise<HttpResponse>;
}
