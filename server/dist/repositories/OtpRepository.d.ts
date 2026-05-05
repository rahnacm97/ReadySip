import type { IOTPRepository } from "../interfaces/repositories/IOTPRepository";
export declare class OTPRepository implements IOTPRepository {
    create(email: string, otp: string, expiresAt: Date): Promise<void>;
    findByEmailAndOtp(email: string, otp: string): Promise<{
        _id: string;
        expiresAt: Date;
    } | null>;
    deleteByEmail(email: string): Promise<void>;
    deleteById(id: string): Promise<void>;
}
