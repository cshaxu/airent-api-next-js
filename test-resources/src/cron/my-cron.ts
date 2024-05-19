import { CommonResponse } from "@airent/utils";
import { Context } from "../context";

export const maxDuration = 60;

export const schedule = "0 1 * * *";

export function executor(context: Context): CommonResponse<Context> {
  return { success: true, data: context };
}
