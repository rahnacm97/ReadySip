import type { IOTPRepository } from "../interfaces/repositories/IOTPRepository";
import OTPModel from "../models/OTP";

export class OTPRepository implements IOTPRepository {
  async create(email: string, otp: string, expiresAt: Date): Promise<void> {
    await OTPModel.deleteMany({ email });
    await OTPModel.create({ email, otp, expiresAt });
  }

  async findByEmailAndOtp(
    email: string,
    otp: string,
  ): Promise<{ _id: string; expiresAt: Date } | null> {
    const record = await OTPModel.findOne({ email, otp });
    if (!record) return null;
    return { _id: record._id.toString(), expiresAt: record.expiresAt };
  }

  async deleteByEmail(email: string): Promise<void> {
    await OTPModel.deleteMany({ email });
  }

  async deleteById(id: string): Promise<void> {
    await OTPModel.deleteOne({ _id: id });
  }
}
