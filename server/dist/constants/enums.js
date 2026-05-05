"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseMessages = exports.HttpStatus = void 0;
var HttpStatus;
(function (HttpStatus) {
    HttpStatus[HttpStatus["OK"] = 200] = "OK";
    HttpStatus[HttpStatus["CREATED"] = 201] = "CREATED";
    HttpStatus[HttpStatus["ACCEPTED"] = 202] = "ACCEPTED";
    HttpStatus[HttpStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    HttpStatus[HttpStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatus[HttpStatus["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatus[HttpStatus["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatus[HttpStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatus[HttpStatus["CONFLICT"] = 409] = "CONFLICT";
    HttpStatus[HttpStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(HttpStatus || (exports.HttpStatus = HttpStatus = {}));
var ResponseMessages;
(function (ResponseMessages) {
    // Auth
    ResponseMessages["LOGIN_SUCCESS"] = "Login successful";
    ResponseMessages["SIGNUP_SUCCESS"] = "Signup successful. Please verify your email.";
    ResponseMessages["OTP_SENT"] = "OTP has been sent to your email";
    ResponseMessages["OTP_VERIFIED"] = "Email verified successfully";
    ResponseMessages["INVALID_OTP"] = "Invalid or expired OTP";
    ResponseMessages["INVALID_CREDENTIALS"] = "Invalid email or password";
    ResponseMessages["UNAUTHORIZED"] = "You are not authorized to access this resource";
    ResponseMessages["EMAIL_EXISTS"] = "Email already registered";
    ResponseMessages["NEEDS_VERIFICATION"] = "Please verify your email before logging in";
    ResponseMessages["INVALID_TOKEN"] = "Invalid or expired token";
    ResponseMessages["USER_NOT_FOUND"] = "User not found";
    // Generic
    ResponseMessages["SUCCESS"] = "Operation successful";
    ResponseMessages["ERROR"] = "Something went wrong";
    ResponseMessages["NOT_FOUND"] = "Resource not found";
    ResponseMessages["VALIDATION_ERROR"] = "Validation failed";
    ResponseMessages["SERVER_ERROR"] = "Internal server error";
})(ResponseMessages || (exports.ResponseMessages = ResponseMessages = {}));
//# sourceMappingURL=enums.js.map