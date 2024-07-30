import {
  Awaitable,
  CommonResponse,
  Dispatcher,
  DispatcherContext,
  ErrorHandler,
  isNil,
  isReadableStream,
} from "@airent/api";
import createHttpError from "http-errors";

type Authenticator<CONTEXT> = (request: Request) => Awaitable<CONTEXT>;

type RequestParser<DATA> = (request: Request) => Awaitable<DATA>;

type HandlerConfig<CONTEXT, DATA, PARSED, RESULT, ERROR> = {
  authenticator: Authenticator<CONTEXT>;
  requestParser: RequestParser<DATA>;
  errorHandler?: ErrorHandler<CONTEXT, DATA, PARSED, RESULT, ERROR>;
};

type Handler = (request: Request) => Promise<Response>;

async function jsonRequestParser<DATA extends object>(
  request: Request
): Promise<DATA> {
  try {
    return await request.json();
  } catch (error: any) {
    throw createHttpError.BadRequest(error.message);
  }
}

function handleWith<CONTEXT, DATA, PARSED, RESULT, ERROR>(
  dispatcher: Dispatcher<CONTEXT, DATA, RESULT, ERROR>,
  config: HandlerConfig<CONTEXT, DATA, PARSED, RESULT, ERROR>
): Handler {
  const { authenticator, requestParser } = config;
  const errorHandler =
    config.errorHandler ??
    ((error) => {
      throw error;
    });

  return async (request: Request) => {
    const dispatcherContext: DispatcherContext<CONTEXT, DATA, PARSED, RESULT> =
      {};
    try {
      dispatcherContext.context = await authenticator(request);
      dispatcherContext.data = await requestParser(request);
      const commonResponse = await dispatcher(
        dispatcherContext.data,
        dispatcherContext.context
      );
      return respond(commonResponse);
    } catch (error) {
      const commonResponse = await errorHandler(error, dispatcherContext);
      return respond(commonResponse);
    }
  };
}

function respond<RESULT, ERROR>(
  commonResponse: CommonResponse<RESULT, ERROR>
): Response {
  const { code, result, error } = commonResponse;
  if (isReadableStream(result)) {
    const headers = { "Content-Type": "text/plain" };
    return new Response(result as ReadableStream, { headers });
  }
  const json = isNil(error) ? result ?? null : { error };
  return Response.json(json, { status: code });
}

export {
  Authenticator,
  Handler,
  HandlerConfig,
  handleWith,
  jsonRequestParser,
  RequestParser,
};
