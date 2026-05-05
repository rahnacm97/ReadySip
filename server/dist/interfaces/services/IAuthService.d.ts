import { IUser } from "../../interfaces/models/user";
import type { VerifyResult } from "../../types/user";
export interface SignupResult {
    userId: string;
}
export interface LoginResult {
    token: string;
    user: Pick<IUser, "name" | "email" | "phone" | "role"> & {
        id: string;
    };
}
export interface IAuthService {
    signup(name: string, email: string, phone: string, password: string): Promise<SignupResult>;
    sendOTP(email: string): Promise<void>;
    verifyOTP(email: string, otp: string): Promise<VerifyResult>;
    login(email: string, password: string): Promise<LoginResult>;
    googleLogin(credential: string): Promise<LoginResult>;
    getProfile(id: string): Promise<IUser>;
}
