import type {
  IOrderRepository,
} from "../interfaces/repositories/IOrderRepository";
import OrderModel from "../models/Order";
import { CreateOrderDTO } from "../dtos/orderDto";
import { IOrder } from "../interfaces/models/order";
import type { OrderStatus } from "../types/order";


export class OrderRepository implements IOrderRepository {
  async findAll(): Promise<IOrder[]> {
    return OrderModel.find().sort({ createdAt: -1 });
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ orders: IOrder[]; totalPages: number; totalOrders: number }> {
    const totalOrders = await OrderModel.countDocuments();
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return { orders, totalPages, totalOrders };
  }

  async findById(id: string): Promise<IOrder | null> {
    return OrderModel.findById(id);
  }

  async findByCustomer(email?: string, phone?: string): Promise<IOrder[]> {
    return OrderModel.find({
      $or: [{ customerEmail: email }, { customerPhone: phone }],
    }).sort({ createdAt: -1 });
  }

  async findByCustomerPaginated(
    page: number,
    limit: number,
    email?: string,
    phone?: string,
  ): Promise<{ orders: IOrder[]; totalPages: number; totalOrders: number }> {
    const filter = {
      $or: [{ customerEmail: email }, { customerPhone: phone }],
    };
    const totalOrders = await OrderModel.countDocuments(filter);
    const totalPages = Math.ceil(totalOrders / limit);
    const orders = await OrderModel.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return { orders, totalPages, totalOrders };
  }

  async create(data: CreateOrderDTO): Promise<IOrder> {
    return OrderModel.create(data);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<IOrder | null> {
    const update: { status: OrderStatus; paymentStatus?: string } = { status };
    if (status === "completed") {
      update.paymentStatus = "paid";
    }
    return OrderModel.findByIdAndUpdate(id, update, { new: true });
  }

  async updatePayment(id: string, paymentId: string): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(
      id,
      { paymentId, paymentStatus: "paid" },
      { new: true },
    );
  }

  async addFeedback(
    id: string,
    rating: number,
    feedback: string,
  ): Promise<IOrder | null> {
    return OrderModel.findByIdAndUpdate(
      id,
      { rating, feedback },
      { new: true },
    );
  }
}
