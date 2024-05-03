import * as z from "zod";
import { CommonResponse } from "../../../src";
import { Context } from "../context";

const Params = z.object({});
type Params = z.infer<typeof Params>;

export const parser = (request: Request) =>
  request.json().then(Params.parseAsync);

export const validator = (
  _params: Params,
  _context: Context,
  _options?: {}
) => {
  return;
};

export function executor(body: Params, context: Context): CommonResponse {
  return { success: true, data: { body, rc: context } };
}
