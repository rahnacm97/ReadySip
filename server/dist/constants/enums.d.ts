export declare enum HttpStatus {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
}
export declare enum ResponseMessages {
    LOGIN_SUCCESS = "Login successful",
    SIGNUP_SUCCESS = "Signup successful. Please verify your email.",
    OTP_SENT = "OTP has been sent to your email",
    OTP_VERIFIED = "Email verified successfully",
    INVALID_OTP = "Invalid or expired OTP",
    INVALID_CREDENTIALS = "Invalid email or password",
    UNAUTHORIZED = "You are not authorized to access this resource",
    EMAIL_EXISTS = "Email already registered",
    NEEDS_VERIFICATION = "Please verify your email before logging in",
    INVALID_TOKEN = "Invalid or expired token",
    USER_NOT_FOUND = "User not found",
    SUCCESS = "Operation successful",
    ERROR = "Something went wrong",
    NOT_FOUND = "Resource not found",
    VALIDATION_ERROR = "Validation failed",
    SERVER_ERROR = "Internal server error"
}
