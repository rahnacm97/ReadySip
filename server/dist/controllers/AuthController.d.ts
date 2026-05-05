import type { Request, Response } from "express";
import type { AuthService } from "../services/AuthService";
import { IAuthController } from "../interfaces/controllers/IAuthController";
interface AuthReq extends Request {
    user?: {
        id: string;
        role: string;
    };
}
export declare class AuthController implements IAuthController {
    private readonly authService;
    constructor(authService: AuthService);
    signup: (req: Request, res: Response) => Promise<void>;
    verifyOtp: (req: Request, res: Response) => Promise<void>;
    resendOtp: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    googleLogin: (req: Request, res: Response) => Promise<void>;
    getMe: (req: AuthReq, res: Response) => Promise<void>;
}
export {};
