"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const generateToken_1 = require("../utils/generateToken");
const google_auth_library_1 = require("google-auth-library");
const enums_1 = require("../constants/enums");
const client = new google_auth_library_1.OAuth2Client(process.env["GOOGLE_CLIENT_ID"]);
class AuthService {
    constructor(userRepo, otpRepo, emailService) {
        this.userRepo = userRepo;
        this.otpRepo = otpRepo;
        this.emailService = emailService;
    }
    async signup(name, email, phone, password) {
        const exists = await this.userRepo.existsByEmail(email);
        if (exists)
            throw new Error(enums_1.ResponseMessages.EMAIL_EXISTS);
        const user = await this.userRepo.create({ name, email, phone, password });
        await this.sendOTP(email);
        return { userId: user._id.toString() };
    }
    async sendOTP(email) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await this.otpRepo.create(email, otp, expiresAt);
        await this.emailService.sendOTP(email, otp);
    }
    async verifyOTP(email, otp) {
        const record = await this.otpRepo.findByEmailAndOtp(email, otp);
        if (!record)
            throw new Error(enums_1.ResponseMessages.INVALID_OTP);
        if (record.expiresAt < new Date()) {
            await this.otpRepo.deleteById(record._id);
            throw new Error(enums_1.ResponseMessages.INVALID_OTP);
        }
        await this.otpRepo.deleteById(record._id);
        const user = await this.userRepo.setVerified(email);
        if (!user)
            throw new Error(enums_1.ResponseMessages.USER_NOT_FOUND);
        const token = (0, generateToken_1.generateToken)(user._id.toString(), user.role);
        return {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    }
    async login(email, password) {
        const user = await this.userRepo.findByEmail(email);
        if (!user)
            throw new Error(enums_1.ResponseMessages.INVALID_CREDENTIALS);
        if (!user.isVerified && user.role !== "admin") {
            throw new Error(enums_1.ResponseMessages.NEEDS_VERIFICATION);
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            throw new Error(enums_1.ResponseMessages.INVALID_CREDENTIALS);
        const token = (0, generateToken_1.generateToken)(user._id.toString(), user.role);
        return {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
        };
    }
    async googleLogin(credential) {
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env["GOOGLE_CLIENT_ID"],
        });
        const payload = ticket.getPayload();
        if (!payload || !payload.email)
            throw new Error(enums_1.ResponseMessages.INVALID_TOKEN);
        let user = await this.userRepo.findByEmail(payload.email);
        if (!user) {
            user = await this.userRepo.create({
                name: payload.name || "User",
                email: payload.email,
                googleId: payload.sub,
                isVerified: true,
            });
        }
        else if (!user.googleId) {
            user.googleId = payload.sub;
            await user.save();
        }
        const token = (0, generateToken_1.generateToken)(user._id.toString(), user.role);
        return {
            token,
            user: {
                id: user._id.toString(),
                name: user.name,
                email: user.email,
                phone: user.phone ?? "",
                role: user.role,
            },
        };
    }
    async getProfile(id) {
        const user = await this.userRepo.findById(id);
        if (!user)
            throw new Error(enums_1.ResponseMessages.USER_NOT_FOUND);
        return user;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map