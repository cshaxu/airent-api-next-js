import { parseBodyWith } from "@airent/api";
import * as z from "zod";
import { Context } from "../context";
import { CommonResponse } from "../types";

const Params = z.object({});
type Params = z.infer<typeof Params>;

export const parser = parseBodyWith(Params);

export function executor(params: Params, context: Context): CommonResponse {
  return { success: true, data: { params, context } };
}
