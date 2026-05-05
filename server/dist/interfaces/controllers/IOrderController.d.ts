import { Request, Response } from "express";
export interface IOrderController {
    createOrder(req: Request, res: Response): Promise<void>;
    getMyOrders(req: Request, res: Response): Promise<void>;
    getAllOrders(req: Request, res: Response): Promise<void>;
    getOrderById(req: Request, res: Response): Promise<void>;
    updateStatus(req: Request, res: Response): Promise<void>;
    addFeedback(req: Request, res: Response): Promise<void>;
}
