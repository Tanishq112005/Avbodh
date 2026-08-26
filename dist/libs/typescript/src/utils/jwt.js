"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifiyingRefeshToken = verifiyingRefeshToken;
const tslib_1 = require("tslib");
const jsonwebtoken_1 = tslib_1.__importDefault(require("jsonwebtoken"));
function verifyAccessToken(token, key) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, key);
        return decoded;
    }
    catch (err) {
        return err;
    }
}
function verifiyingRefeshToken(token, key) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, key);
            return decoded;
        }
        catch (err) {
            return err;
        }
    });
}
//# sourceMappingURL=jwt.js.map