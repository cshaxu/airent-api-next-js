"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jsonRequestParser = exports.handleWith = void 0;
const api_1 = require("@airent/api");
const http_errors_1 = __importDefault(require("http-errors"));
function jsonRequestParser(request) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            return yield request.json();
        }
        catch (error) {
            throw http_errors_1.default.BadRequest(error.message);
        }
    });
}
exports.jsonRequestParser = jsonRequestParser;
function handleWith(dispatcher, config) {
    var _a;
    const { authenticator, requestParser } = config;
    const errorHandler = (_a = config.errorHandler) !== null && _a !== void 0 ? _a : ((error) => {
        throw error;
    });
    return (request) => __awaiter(this, void 0, void 0, function* () {
        const dispatcherContext = {};
        try {
            dispatcherContext.context = yield authenticator(request);
            dispatcherContext.data = yield requestParser(request);
            const commonResponse = yield dispatcher(dispatcherContext.data, dispatcherContext.context);
            return respond(commonResponse);
        }
        catch (error) {
            const commonResponse = yield errorHandler(error, dispatcherContext);
            return respond(commonResponse);
        }
    });
}
exports.handleWith = handleWith;
function respond(commonResponse) {
    const { code, result, error } = commonResponse;
    if ((0, api_1.isReadableStream)(result)) {
        const headers = { "Content-Type": "text/plain" };
        return new Response(result, { headers });
    }
    const json = (0, api_1.isNil)(error) ? result !== null && result !== void 0 ? result : null : { error };
    return Response.json(json, { status: code });
}
//# sourceMappingURL=handler.js.map