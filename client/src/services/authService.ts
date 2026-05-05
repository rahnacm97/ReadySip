import api from "../api/axios";
import type { User } from "../types";
import { API_ROUTES } from "../constants/routes";

interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

interface SignupResponse {
  success: boolean;
  message: string;
  userId?: string;
}

export const authService = {
  async signup(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }): Promise<SignupResponse> {
    const res = await api.post<SignupResponse>(API_ROUTES.AUTH.SIGNUP, data);
    return res.data;
  },

  async verifyOtp(email: string, otp: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(API_ROUTES.AUTH.VERIFY_OTP, {
      email,
      otp,
    });
    return res.data;
  },

  async resendOtp(email: string): Promise<void> {
    await api.post(API_ROUTES.AUTH.RESEND_OTP, { email });
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, {
      email,
      password,
    });
    return res.data;
  },

  async getMe(): Promise<User> {
    const res = await api.get<{ user: User }>(API_ROUTES.AUTH.ME);
    return res.data.user;
  },

  async googleLogin(credential: string): Promise<AuthResponse> {
    const res = await api.post<AuthResponse>(API_ROUTES.AUTH.GOOGLE_LOGIN, {
      credential,
    });
    return res.data;
  },
};
