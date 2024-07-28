import { CommonResponse } from "@airent/api";
declare const withDecoded: <S extends Record<string, any>>(params: S) => S;
declare function respond<DATA, ERROR extends Error>(executed: CommonResponse<DATA, ERROR>): DATA;
export { respond, withDecoded };
