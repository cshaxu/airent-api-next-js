import { Awaitable, WrappableHandlerConfig } from "@airent/api";
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

export { CommonResponse, CronConfig, DebugConfig };
