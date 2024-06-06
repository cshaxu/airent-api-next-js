import { Context } from "../context";
import { CommonResponse } from "../types";

export const maxDuration = 60;

export const schedule = "0 1 * * *";

export function executor(context: Context): CommonResponse<Context> {
  return { success: true, data: context };
}
