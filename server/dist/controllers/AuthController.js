"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const enums_1 = require("../constants/enums");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.signup = async (req, res) => {
            try {
                console.log("📝 Signup Request:", req.body);
                const { name, email, phone, password } = req.body;
                if (!name || !email || !phone || !password) {
                    res
                        .status(enums_1.HttpStatus.BAD_REQUEST)
                        .json({ success: false, message: enums_1.ResponseMessages.VALIDATION_ERROR });
                    return;
                }
                const result = await this.authService.signup(name, email, phone, password);
                res
                    .status(enums_1.HttpStatus.CREATED)
                    .json({
                    success: true,
                    message: enums_1.ResponseMessages.SIGNUP_SUCCESS,
                    ...result,
                });
            }
            catch (err) {
                console.error("❌ Signup Error:", err);
                const msg = err instanceof Error ? err.message : "Signup failed";
                res.status(enums_1.HttpStatus.BAD_REQUEST).json({ success: false, message: msg });
            }
        };
        this.verifyOtp = async (req, res) => {
            try {
                const { email, otp } = req.body;
                if (!email || !otp) {
                    res
                        .status(enums_1.HttpStatus.BAD_REQUEST)
                        .json({ success: false, message: enums_1.ResponseMessages.VALIDATION_ERROR });
                    return;
                }
                const result = await this.authService.verifyOTP(email, otp);
                res.json({ success: true, ...result });
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : "Verification failed";
                res.status(enums_1.HttpStatus.BAD_REQUEST).json({ success: false, message: msg });
            }
        };
        this.resendOtp = async (req, res) => {
            try {
                const { email } = req.body;
                await this.authService.sendOTP(email);
                res.json({ success: true, message: enums_1.ResponseMessages.OTP_SENT });
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to resend OTP";
                res.status(enums_1.HttpStatus.BAD_REQUEST).json({ success: false, message: msg });
            }
        };
        this.login = async (req, res) => {
            try {
                const { email, password } = req.body;
                if (!email || !password) {
                    res
                        .status(enums_1.HttpStatus.BAD_REQUEST)
                        .json({ success: false, message: enums_1.ResponseMessages.VALIDATION_ERROR });
                    return;
                }
                const result = await this.authService.login(email, password);
                res.json({ success: true, ...result });
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : "Login failed";
                res
                    .status(enums_1.HttpStatus.UNAUTHORIZED)
                    .json({ success: false, message: msg });
            }
        };
        this.googleLogin = async (req, res) => {
            try {
                const { credential } = req.body;
                if (!credential) {
                    res
                        .status(enums_1.HttpStatus.BAD_REQUEST)
                        .json({ success: false, message: enums_1.ResponseMessages.VALIDATION_ERROR });
                    return;
                }
                const result = await this.authService.googleLogin(credential);
                res.json({ success: true, ...result });
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : "Google login failed";
                res
                    .status(enums_1.HttpStatus.UNAUTHORIZED)
                    .json({ success: false, message: msg });
            }
        };
        this.getMe = async (req, res) => {
            try {
                const user = await this.authService.getProfile(req.user?.id ?? "");
                res.json({ success: true, user });
            }
            catch (err) {
                const msg = err instanceof Error ? err.message : "Not found";
                res.status(404).json({ success: false, message: msg });
            }
        };
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map