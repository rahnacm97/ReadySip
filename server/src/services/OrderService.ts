import type { IOrderRepository } from "../interfaces/repositories/IOrderRepository";
import { CreateOrderDTO } from "../dtos/orderDto";
import type {
  IEmailService,
  ISMSService,
} from "../interfaces/services/INotificationService";
import { IOrder } from "../interfaces/models/order";
import type { OrderStatus } from "../types/order";
import { getIO } from "../utils/socket";
import { IOrderService } from "../interfaces/services/IOrderService";

export class OrderService implements IOrderService {
  constructor(
    private readonly orderRepo: IOrderRepository,
    private readonly emailService: IEmailService,
    private readonly smsService: ISMSService,
  ) {}

  async createOrder(data: CreateOrderDTO): Promise<IOrder> {
    const order = await this.orderRepo.create(data);

    // Real-time admin notification
    try {
      getIO().to("admin-room").emit("new-order", { order });
    } catch {
      /* Socket not yet connected — safe to ignore */
    }

    const adminPhone = process.env["ADMIN_PHONE"] ?? "";
    const arrivalStr = new Date(data.timeOfArrival).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
    });

    void this.emailService
      .sendOrderConfirmationToAdmin({
        customerName: data.customerName,
        customerPhone: data.customerPhone,
        items: data.items,
        timeOfArrival: arrivalStr,
        totalAmount: data.totalAmount,
        orderId: order._id.toString(),
      })
      .catch((e: unknown) => console.error("Admin email error:", e));

    void this.smsService
      .sendNewOrderAlert(adminPhone, data.customerName, order._id.toString())
      .catch((e: unknown) => console.error("Admin SMS error:", e));

    return order;
  }

  async getAllOrders(
    page: number,
    limit: number,
  ): Promise<{ orders: IOrder[]; totalPages: number; totalOrders: number }> {
    return this.orderRepo.findAllPaginated(page, limit);
  }

  async getOrdersByCustomer(email?: string, phone?: string): Promise<IOrder[]> {
    return this.orderRepo.findByCustomer(email, phone);
  }

  async getOrdersByCustomerPaginated(
    page: number,
    limit: number,
    email?: string,
    phone?: string,
  ): Promise<{ orders: IOrder[]; totalPages: number; totalOrders: number }> {
    return this.orderRepo.findByCustomerPaginated(page, limit, email, phone);
  }

  async getOrderById(id: string): Promise<IOrder> {
    const order = await this.orderRepo.findById(id);
    if (!order) throw new Error("Order not found");
    return order;
  }

  async updateStatus(id: string, status: string): Promise<IOrder> {
    const validStatuses: OrderStatus[] = [
      "pending",
      "accepted",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status as OrderStatus)) {
      throw new Error("Invalid order status");
    }

    const order = await this.orderRepo.updateStatus(id, status as OrderStatus);
    if (!order) throw new Error("Order not found");

    if (status === "accepted") {
      const arrivalStr = order.timeOfArrival.toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

      if (order.customerEmail) {
        void this.emailService
          .sendOrderAcceptedToCustomer(
            order.customerEmail,
            order.customerName,
            arrivalStr,
          )
          .catch((e: unknown) => console.error("Customer email error:", e));
      }

      void this.smsService
        .sendOrderAccepted(order.customerPhone, order.customerName, arrivalStr)
        .catch((e: unknown) => console.error("Customer SMS error:", e));
    }

    // Broadcast update to admin dashboard
    try {
      getIO().to("admin-room").emit("order-updated", { order });
    } catch {
      /* ignore */
    }

    return order;
  }

  async addFeedback(
    id: string,
    rating: number,
    feedback: string,
  ): Promise<IOrder> {
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    const order = await this.orderRepo.addFeedback(id, rating, feedback);
    if (!order) throw new Error("Order not found");
    return order;
  }
}
