import { wrappableHandle } from "@airent/api";
import { CronConfig, DebugConfig } from "./types";
declare function handleCron<CONTEXT, DATA, ERROR, OPTIONS>(config: CronConfig<CONTEXT, DATA, ERROR, OPTIONS>): (request: Request) => Promise<Response>;
declare const handleDebug: <CONTEXT, PARSED extends {
    name: string;
}, OPTIONS>(config: DebugConfig<CONTEXT, PARSED, OPTIONS>) => (request: Request) => Promise<Response>;
declare const handleWebhook: typeof wrappableHandle;
export { handleCron, handleDebug, handleWebhook };
