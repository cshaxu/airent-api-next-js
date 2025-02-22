"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toResult = exports.toDecoded = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const toDecoded = (params) => Object.entries(params).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
        acc[key] = decodeURIComponent(value);
    }
    else {
        acc[key] = value;
    }
    return acc;
}, {});
exports.toDecoded = toDecoded;
function toResult(executed) {
    const { result, error } = executed;
    if (result === undefined) {
        throw error !== null && error !== void 0 ? error : http_errors_1.default.InternalServerError();
    }
    return result;
}
exports.toResult = toResult;
//# sourceMappingURL=utils.js.map