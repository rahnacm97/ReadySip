"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPRepository = void 0;
const OTP_1 = __importDefault(require("../models/OTP"));
class OTPRepository {
    async create(email, otp, expiresAt) {
        await OTP_1.default.deleteMany({ email });
        await OTP_1.default.create({ email, otp, expiresAt });
    }
    async findByEmailAndOtp(email, otp) {
        const record = await OTP_1.default.findOne({ email, otp });
        if (!record)
            return null;
        return { _id: record._id.toString(), expiresAt: record.expiresAt };
    }
    async deleteByEmail(email) {
        await OTP_1.default.deleteMany({ email });
    }
    async deleteById(id) {
        await OTP_1.default.deleteOne({ _id: id });
    }
}
exports.OTPRepository = OTPRepository;
//# sourceMappingURL=OtpRepository.js.map