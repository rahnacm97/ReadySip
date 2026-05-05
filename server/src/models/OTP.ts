import mongoose, { Schema } from "mongoose";
import { IOTP } from "../interfaces/models/otp";

const otpSchema = new Schema<IOTP>({
  email: { type: String, required: true, lowercase: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

export default mongoose.model<IOTP>("OTP", otpSchema);
