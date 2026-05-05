import { Request, Response } from "express";
import { IAdminController } from "../interfaces/controllers/IAdminController";
export declare class AdminController implements IAdminController {
    getDashboardStats: (req: Request, res: Response) => Promise<void>;
}
export declare const adminController: AdminController;
