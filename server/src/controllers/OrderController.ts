import type { Request, Response } from "express";
import type { OrderService } from "../services/OrderService";
import type { CreateOrderDTO } from "../dtos/orderDto";
import { HttpStatus, ResponseMessages } from "../constants/enums";
import User from "../models/User";
import { IOrderController } from "../interfaces/controllers/IOrderController";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export class OrderController implements IOrderController {
  constructor(private readonly orderService: OrderService) {}

  createOrder = async (req: Request, res: Response): Promise<void> => {
    try {
      const body = req.body as CreateOrderDTO & { timeOfArrival: string };
      if (
        !body.customerName ||
        !body.customerPhone ||
        !body.items?.length ||
        !body.timeOfArrival ||
        !body.totalAmount
      ) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: ResponseMessages.VALIDATION_ERROR });
        return;
      }
      const order = await this.orderService.createOrder({
        ...body,
        timeOfArrival: new Date(body.timeOfArrival),
      });
      res.status(HttpStatus.CREATED).json({ success: true, order });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err instanceof Error ? err.message : ResponseMessages.ERROR,
      });
    }
  };

  getMyOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      // Cast req to AuthRequest to access the user object attached by authMiddleware
      const userId = (req as AuthRequest).user?.id;
      if (!userId) {
        res
          .status(HttpStatus.UNAUTHORIZED)
          .json({ success: false, message: ResponseMessages.UNAUTHORIZED });
        return;
      }

      // We need the User model to fetch email and phone
      // Since we don't have it injected, we've imported it at the top
      const user = await User.findById(userId);

      if (!user) {
        res
          .status(HttpStatus.NOT_FOUND)
          .json({ success: false, message: ResponseMessages.USER_NOT_FOUND });
        return;
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 3;

      const { orders, totalPages, totalOrders } =
        await this.orderService.getOrdersByCustomerPaginated(
          page,
          limit,
          user.email,
          user.phone,
        );
      res.json({ success: true, orders, totalPages, totalOrders, currentPage: page });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err instanceof Error ? err.message : ResponseMessages.ERROR,
      });
    }
  };

  getAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { orders, totalPages, totalOrders } =
        await this.orderService.getAllOrders(page, limit);
      res.json({
        success: true,
        orders,
        totalPages,
        totalOrders,
        currentPage: page,
      });
    } catch (err) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: err instanceof Error ? err.message : ResponseMessages.ERROR,
      });
    }
  };

  getOrderById = async (req: Request, res: Response): Promise<void> => {
    try {
      const order = await this.orderService.getOrderById(
        req.params.id as string,
      );
      res.json({ success: true, order });
    } catch (err) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message:
          err instanceof Error ? err.message : ResponseMessages.NOT_FOUND,
      });
    }
  };

  updateStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.body as { status: string };
      const order = await this.orderService.updateStatus(
        req.params.id as string,
        status,
      );
      res.json({ success: true, order });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: err instanceof Error ? err.message : ResponseMessages.ERROR,
      });
    }
  };

  addFeedback = async (req: Request, res: Response): Promise<void> => {
    try {
      const { rating, feedback } = req.body as {
        rating: number;
        feedback: string;
      };
      if (!rating || typeof rating !== "number") {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ success: false, message: ResponseMessages.VALIDATION_ERROR });
        return;
      }
      const order = await this.orderService.addFeedback(
        req.params.id as string,
        rating,
        feedback ?? "",
      );
      res.json({ success: true, order });
    } catch (err) {
      res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message: err instanceof Error ? err.message : ResponseMessages.ERROR,
      });
    }
  };
}
