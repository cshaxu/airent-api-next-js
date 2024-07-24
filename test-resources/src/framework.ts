import { Context } from "./context";

export const dispatcherConfig = {};

export const handlerConfig = { authenticator, requestParser, errorHandler };

function authenticator(_request: Request): Context {
  return {};
}

function requestParser(request: Request): Request {
  return request;
}

function errorHandler(error: any, _: any): any {
  return error;
}
