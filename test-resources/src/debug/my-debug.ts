import { parseBodyWith } from "@airent/api";
import { CommonResponse } from "@airent/utils";
import * as z from "zod";
import { Context } from "../context";

const Params = z.object({});
type Params = z.infer<typeof Params>;

export const parser = parseBodyWith(Params);

export function executor(params: Params, context: Context): CommonResponse {
  return { success: true, data: { params, context } };
}
