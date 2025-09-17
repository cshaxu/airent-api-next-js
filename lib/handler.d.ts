import { Dispatcher, ErrorHandler } from "@airent/api";
import { Awaitable } from "airent";
type Authenticator<CONTEXT> = (request: Request) => Awaitable<CONTEXT>;
type RequestParser<DATA> = (request: Request) => Awaitable<DATA>;
type HandlerConfig<CONTEXT, DATA, PARSED, RESULT, ERROR> = {
    isCustomResponse?: boolean;
    authenticator: Authenticator<CONTEXT>;
    requestParser: RequestParser<DATA>;
    errorHandler?: ErrorHandler<CONTEXT, DATA, PARSED, RESULT, ERROR>;
};
type Handler = (request: Request) => Promise<Response>;
declare function jsonRequestParser<DATA extends object>(request: Request): Promise<DATA>;
declare function handleWith<CONTEXT, DATA, PARSED, RESULT, ERROR>(dispatcher: Dispatcher<CONTEXT, DATA, RESULT, ERROR>, config: HandlerConfig<CONTEXT, DATA, PARSED, RESULT, ERROR>): Handler;
export { Authenticator, Handler, HandlerConfig, handleWith, jsonRequestParser, RequestParser, };
