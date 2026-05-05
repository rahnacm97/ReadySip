import { IUser } from "../../interfaces/models/user";

export interface IUserRepository {
  findByEmail(email: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  create(data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    googleId?: string;
    role?: string;
    isVerified?: boolean;
  }): Promise<IUser>;
  setVerified(email: string): Promise<IUser | null>;
  existsByEmail(email: string): Promise<boolean>;
  findByResetToken(token: string): Promise<IUser | null>;
}
