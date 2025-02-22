import { CommonResponse } from "@airent/api";
declare const toDecoded: <S extends Record<string, any>>(params: S) => S;
declare function toResult<RESULT = unknown, ERROR = unknown>(executed: CommonResponse<RESULT, ERROR>): RESULT;
export { toDecoded, toResult };
