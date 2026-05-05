import type { Request, Response } from "express";
import type { OrderService } from "../services/OrderService";
import { IOrderController } from "../interfaces/controllers/IOrderController";
export declare class OrderController implements IOrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    createOrder: (req: Request, res: Response) => Promise<void>;
    getMyOrders: (req: Request, res: Response) => Promise<void>;
    getAllOrders: (req: Request, res: Response) => Promise<void>;
    getOrderById: (req: Request, res: Response) => Promise<void>;
    updateStatus: (req: Request, res: Response) => Promise<void>;
    addFeedback: (req: Request, res: Response) => Promise<void>;
}
