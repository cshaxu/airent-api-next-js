import { wrappableHandle } from "@airent/api";
import { CronConfig } from "./types";

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

export { handleCron };
