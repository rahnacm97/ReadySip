import type { IOrderRepository } from "../interfaces/repositories/IOrderRepository";
import { CreateOrderDTO } from "../dtos/orderDto";
import type { IEmailService, ISMSService } from "../interfaces/services/INotificationService";
import { IOrder } from "../interfaces/models/order";
import { IOrderService } from "../interfaces/services/IOrderService";
export declare class OrderService implements IOrderService {
    private readonly orderRepo;
    private readonly emailService;
    private readonly smsService;
    constructor(orderRepo: IOrderRepository, emailService: IEmailService, smsService: ISMSService);
    createOrder(data: CreateOrderDTO): Promise<IOrder>;
    getAllOrders(page: number, limit: number): Promise<{
        orders: IOrder[];
        totalPages: number;
        totalOrders: number;
    }>;
    getOrdersByCustomer(email?: string, phone?: string): Promise<IOrder[]>;
    getOrdersByCustomerPaginated(page: number, limit: number, email?: string, phone?: string): Promise<{
        orders: IOrder[];
        totalPages: number;
        totalOrders: number;
    }>;
    getOrderById(id: string): Promise<IOrder>;
    updateStatus(id: string, status: string): Promise<IOrder>;
    addFeedback(id: string, rating: number, feedback: string): Promise<IOrder>;
}
