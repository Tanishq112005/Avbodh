"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
class ApiError {
    constructor(message = "Something went wrong", errors = {}) {
        this.success = false;
        this.message = message;
        this.errors = errors;
    }
}
exports.ApiError = ApiError;
//# sourceMappingURL=ApiError.js.map