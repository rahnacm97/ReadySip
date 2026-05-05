import type { IUserRepository } from "../interfaces/repositories/IUserRepository";
import type { IOTPRepository } from "../interfaces/repositories/IOTPRepository";
import type { IEmailService } from "../interfaces/services/INotificationService";
import { generateToken } from "../utils/generateToken";
import { IUser } from "../interfaces/models/user";
import { OAuth2Client } from "google-auth-library";
import { ResponseMessages } from "../constants/enums";
import {
  SignupResult,
  LoginResult,
  IAuthService,
} from "../interfaces/services/IAuthService";
import type { VerifyResult } from "../types/user";

const client = new OAuth2Client(process.env["GOOGLE_CLIENT_ID"]);

export class AuthService implements IAuthService {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly otpRepo: IOTPRepository,
    private readonly emailService: IEmailService,
  ) {}

  async signup(
    name: string,
    email: string,
    phone: string,
    password: string,
  ): Promise<SignupResult> {
    const exists = await this.userRepo.existsByEmail(email);
    if (exists) throw new Error(ResponseMessages.EMAIL_EXISTS);

    const user = await this.userRepo.create({ name, email, phone, password });
    await this.sendOTP(email);
    return { userId: user._id.toString() };
  }

  async sendOTP(email: string): Promise<void> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await this.otpRepo.create(email, otp, expiresAt);
    await this.emailService.sendOTP(email, otp);
  }

  async verifyOTP(email: string, otp: string): Promise<VerifyResult> {
    const record = await this.otpRepo.findByEmailAndOtp(email, otp);
    if (!record) throw new Error(ResponseMessages.INVALID_OTP);
    if (record.expiresAt < new Date()) {
      await this.otpRepo.deleteById(record._id);
      throw new Error(ResponseMessages.INVALID_OTP);
    }
    await this.otpRepo.deleteById(record._id);

    const user = await this.userRepo.setVerified(email);
    if (!user) throw new Error(ResponseMessages.USER_NOT_FOUND);

    const token = generateToken(user._id.toString(), user.role);
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

  async login(email: string, password: string): Promise<LoginResult> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new Error(ResponseMessages.INVALID_CREDENTIALS);

    if (!user.isVerified && user.role !== "admin") {
      throw new Error(ResponseMessages.NEEDS_VERIFICATION);
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error(ResponseMessages.INVALID_CREDENTIALS);

    const token = generateToken(user._id.toString(), user.role);
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

  async googleLogin(credential: string): Promise<LoginResult> {
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env["GOOGLE_CLIENT_ID"],
    });
    const payload = ticket.getPayload();
    if (!payload || !payload.email)
      throw new Error(ResponseMessages.INVALID_TOKEN);

    let user = await this.userRepo.findByEmail(payload.email);
    if (!user) {
      user = await this.userRepo.create({
        name: payload.name || "User",
        email: payload.email,
        googleId: payload.sub,
        isVerified: true,
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    const token = generateToken(user._id.toString(), user.role);
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

  async getProfile(id: string): Promise<IUser> {
    const user = await this.userRepo.findById(id);
    if (!user) throw new Error(ResponseMessages.USER_NOT_FOUND);
    return user;
  }
}
