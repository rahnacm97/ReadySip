import { Document } from "mongoose";
import type { UserRole } from "../../types/user";

export interface IUser extends Document {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  googleId?: string;
  role: UserRole;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordExpiry?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}
