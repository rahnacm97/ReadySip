import type { Request, Response } from "express";
import type { AuthService } from "../services/AuthService";
import { HttpStatus, ResponseMessages } from "../constants/enums";
import { IAuthController } from "../interfaces/controllers/IAuthController";

interface AuthReq extends Request {
  user?: { id: string; role: string };
}

export class AuthController implements IAuthController {
  constructor(private readonly authService: AuthService) {}

  signup = async (req: Request, res: Response): Promise<void> => {
    try {
      console.log("📝 Signup Request:", req.body);
      const { name, email, phone, password } = req.body as Record<
        string,
        string
      >;
      if (!name || !email || !phone || !password) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: ResponseMessages.VALIDATION_ERROR });
        return;
      }
      const result = await this.authService.signup(
        name,
        email,
        phone,
        password,
      );
      res
        .status(HttpStatus.CREATED)
        .json({
          success: true,
          message: ResponseMessages.SIGNUP_SUCCESS,
          ...result,
        });
    } catch (err) {
      console.error("❌ Signup Error:", err);
      const msg = err instanceof Error ? err.message : "Signup failed";
      res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: msg });
    }
  };

  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, otp } = req.body as Record<string, string>;
      if (!email || !otp) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: ResponseMessages.VALIDATION_ERROR });
        return;
      }
      const result = await this.authService.verifyOTP(email, otp);
      res.json({ success: true, ...result });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: msg });
    }
  };

  resendOtp = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body as { email: string };
      await this.authService.sendOTP(email);
      res.json({ success: true, message: ResponseMessages.OTP_SENT });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resend OTP";
      res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: msg });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as Record<string, string>;
      if (!email || !password) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: ResponseMessages.VALIDATION_ERROR });
        return;
      }
      const result = await this.authService.login(email, password);
      res.json({ success: true, ...result });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed";
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: msg });
    }
  };

  googleLogin = async (req: Request, res: Response): Promise<void> => {
    try {
      const { credential } = req.body as { credential: string };
      if (!credential) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: ResponseMessages.VALIDATION_ERROR });
        return;
      }
      const result = await this.authService.googleLogin(credential);
      res.json({ success: true, ...result });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Google login failed";
      res
        .status(HttpStatus.UNAUTHORIZED)
        .json({ success: false, message: msg });
    }
  };

  getMe = async (req: AuthReq, res: Response): Promise<void> => {
    try {
      const user = await this.authService.getProfile(req.user?.id ?? "");
      res.json({ success: true, user });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Not found";
      res.status(404).json({ success: false, message: msg });
    }
  };
}
