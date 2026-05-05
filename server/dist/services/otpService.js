"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyOTP = exports.createAndSendOTP = void 0;
const OTP_1 = __importDefault(require("../models/OTP"));
const emailService_1 = require("./emailService");
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
const createAndSendOTP = async (email) => {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    // Remove existing OTP for this email
    await OTP_1.default.deleteMany({ email });
    await OTP_1.default.create({ email, otp, expiresAt });
    await (0, emailService_1.sendOTPEmail)(email, otp);
};
exports.createAndSendOTP = createAndSendOTP;
const verifyOTP = async (email, otp) => {
    const record = await OTP_1.default.findOne({ email, otp });
    if (!record)
        return false;
    if (record.expiresAt < new Date()) {
        await OTP_1.default.deleteOne({ _id: record._id });
        return false;
    }
    await OTP_1.default.deleteOne({ _id: record._id });
    return true;
};
exports.verifyOTP = verifyOTP;
//# sourceMappingURL=otpService.js.map