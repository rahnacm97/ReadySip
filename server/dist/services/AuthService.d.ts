import type { IUserRepository } from "../interfaces/repositories/IUserRepository";
import type { IOTPRepository } from "../interfaces/repositories/IOTPRepository";
import type { IEmailService } from "../interfaces/services/INotificationService";
import { IUser } from "../interfaces/models/user";
import { SignupResult, LoginResult, IAuthService } from "../interfaces/services/IAuthService";
import type { VerifyResult } from "../types/user";
export declare class AuthService implements IAuthService {
    private readonly userRepo;
    private readonly otpRepo;
    private readonly emailService;
    constructor(userRepo: IUserRepository, otpRepo: IOTPRepository, emailService: IEmailService);
    signup(name: string, email: string, phone: string, password: string): Promise<SignupResult>;
    sendOTP(email: string): Promise<void>;
    verifyOTP(email: string, otp: string): Promise<VerifyResult>;
    login(email: string, password: string): Promise<LoginResult>;
    googleLogin(credential: string): Promise<LoginResult>;
    getProfile(id: string): Promise<IUser>;
}
