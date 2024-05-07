import { CronConfig } from "./types";
declare function handleCron<CONTEXT, DATA, ERROR, OPTIONS>(config: CronConfig<CONTEXT, DATA, ERROR, OPTIONS>): (request: Request) => Promise<Response>;
export { handleCron };
