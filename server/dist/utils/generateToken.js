"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env["JWT_SECRET"] || "readysip_secret";
const JWT_EXPIRY = process.env["JWT_ACCESS_EXPIRY"] || "7d";
const generateToken = (id, role) => {
    return jsonwebtoken_1.default.sign({ id, role }, JWT_SECRET, {
        expiresIn: JWT_EXPIRY,
    });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=generateToken.js.map