import * as z from "zod";
import { CommonResponse } from "../../../src";
import { Context } from "../context";

export const Params = z.object({});
type Params = z.infer<typeof Params>;

export function executor(params: Params, context: Context): CommonResponse {
  return { success: true, data: { params, context } };
}
