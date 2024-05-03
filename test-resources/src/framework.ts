import { Context } from "./context";

export const handlerConfig = { authenticator, validator };

function authenticator(_request: Request): Context {
  return {};
}

function validator(_parsed: any, _context: Context, _options?: {}): void {
  return;
}
