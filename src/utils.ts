import { CommonResponse } from "@airent/api";
import createHttpError from "http-errors";

const withDecoded = <S extends Record<string, any>>(params: S) =>
  Object.entries(params).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
      (acc as Record<string, any>)[key] = decodeURIComponent(value);
    } else {
      (acc as Record<string, any>)[key] = value;
    }
    return acc;
  }, {} as S);

function respond<DATA, ERROR extends Error>(
  executed: CommonResponse<DATA, ERROR>
): DATA {
  const { result, error } = executed;
  if (result === undefined) {
    throw createHttpError.InternalServerError(error?.message);
  }
  return result;
}

export { respond, withDecoded };
