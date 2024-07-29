import { CommonResponse } from "@airent/api";
declare const withDecoded: <S extends Record<string, any>>(params: S) => S;
declare function respond<RESULT = unknown, ERROR = unknown>(executed: CommonResponse<RESULT, ERROR>): RESULT;
export { respond, withDecoded };
