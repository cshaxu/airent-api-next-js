import { wrappableHandle } from "@airent/api";
import createHttpError from "http-errors";
import { CronConfig, DebugConfig } from "./types";

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

export { handleCron, handleDebug, handleWebhook };
