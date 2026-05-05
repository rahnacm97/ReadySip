import { Request, Response } from "express";
export interface IAdminController {
    getDashboardStats(req: Request, res: Response): Promise<void>;
}
