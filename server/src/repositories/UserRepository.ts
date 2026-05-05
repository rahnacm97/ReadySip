import type { IUserRepository } from "../interfaces/repositories/IUserRepository";
import UserModel from "../models/User";
import { IUser } from "../interfaces/models/user";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }

  async findById(id: string): Promise<IUser | null> {
    return UserModel.findById(id).select("-password");
  }

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    googleId?: string;
    role?: string;
    isVerified?: boolean;
  }): Promise<IUser> {
    return UserModel.create(data);
  }

  async setVerified(email: string): Promise<IUser | null> {
    return UserModel.findOneAndUpdate(
      { email },
      { isVerified: true },
      { new: true },
    );
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await UserModel.countDocuments({ email });
    return count > 0;
  }

  async findByResetToken(token: string): Promise<IUser | null> {
    return UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiry: { $gt: new Date() },
    });
  }
}
