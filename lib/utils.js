"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDecoded = exports.respond = void 0;
const http_errors_1 = __importDefault(require("http-errors"));
const withDecoded = (params) => Object.entries(params).reduce((acc, [key, value]) => {
    if (typeof value === "string") {
        acc[key] = decodeURIComponent(value);
    }
    else {
        acc[key] = value;
    }
    return acc;
}, {});
exports.withDecoded = withDecoded;
function respond(executed) {
    const { result, error } = executed;
    if (result === undefined) {
        throw http_errors_1.default.InternalServerError(error === null || error === void 0 ? void 0 : error.message);
    }
    return result;
}
exports.respond = respond;
//# sourceMappingURL=utils.js.map