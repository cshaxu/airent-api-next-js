import {
  Awaitable,
  WrappableHandlerConfig,
  wrappableHandle,
} from "@airent/api";
import createHttpError from "http-errors";
import * as z from "zod";

type CommonResponse<DATA = unknown, ERROR = unknown> = {
  success: boolean;
  data?: DATA;
  error?: ERROR;
};

type CronConfig<CONTEXT, DATA, ERROR, OPTIONS> = Omit<
  WrappableHandlerConfig<CONTEXT, {}, CommonResponse<DATA, ERROR>, OPTIONS>,
  "parser" | "executor"
> & {
  executor: (context: CONTEXT) => Awaitable<CommonResponse<DATA, ERROR>>;
};

function handleCron<CONTEXT, DATA, ERROR, OPTIONS>(
  config: CronConfig<CONTEXT, DATA, ERROR, OPTIONS>
): (request: Request) => Promise<Response> {
  const { executor, ...handlerConfig } = config;
  return wrappableHandle({
    ...handlerConfig,
    parser: () => Promise.resolve({}),
    executor: (_parsed: {}, context: CONTEXT) => executor(context),
  });
}

type DebugMap<CONTEXT> = Map<
  string,
  [
    z.ZodTypeAny,
    (params: any, context: CONTEXT) => Awaitable<CommonResponse<any, any>>
  ]
>;

type DebugConfig<CONTEXT, PARSED, OPTIONS> = Omit<
  WrappableHandlerConfig<CONTEXT, PARSED, CommonResponse<any, any>, OPTIONS>,
  "parser" | "executor"
> & {
  map: DebugMap<CONTEXT>;
};

const handleDebug = <CONTEXT, PARSED extends { name: string }, OPTIONS>(
  config: DebugConfig<CONTEXT, PARSED, OPTIONS>
) =>
  wrappableHandle({
    ...config,
    parser: (request: Request) =>
      request
        .json()
        .then((body) =>
          body.name && config.map.has(body.name)
            ? Promise.resolve(body)
            : Promise.reject(
                createHttpError.BadRequest(
                  "Debug script '${body.name}' does not exist"
                )
              )
        ),
    executor: async (parsed: PARSED, context: CONTEXT) => {
      const { name, ...rest } = parsed;
      const debugEntry = config.map.get(name)!;
      const [debugValidator, debugExecutor] = debugEntry;
      const params = await debugValidator.parseAsync(rest);
      return await debugExecutor(params, context);
    },
  });

const handleWebhook = wrappableHandle;

export {
  CommonResponse,
  CronConfig,
  DebugConfig,
  handleCron,
  handleDebug,
  handleWebhook,
};
