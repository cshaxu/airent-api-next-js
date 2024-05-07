import { Awaitable, WrappableHandlerConfig } from "@airent/api";

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

export { CommonResponse, CronConfig };
