import type { IOrderRepository } from "../interfaces/repositories/IOrderRepository";
import { CreateOrderDTO } from "../dtos/orderDto";
import { IOrder } from "../interfaces/models/order";
import type { OrderStatus } from "../types/order";
export declare class OrderRepository implements IOrderRepository {
    findAll(): Promise<IOrder[]>;
    findAllPaginated(page: number, limit: number): Promise<{
        orders: IOrder[];
        totalPages: number;
        totalOrders: number;
    }>;
    findById(id: string): Promise<IOrder | null>;
    findByCustomer(email?: string, phone?: string): Promise<IOrder[]>;
    findByCustomerPaginated(page: number, limit: number, email?: string, phone?: string): Promise<{
        orders: IOrder[];
        totalPages: number;
        totalOrders: number;
    }>;
    create(data: CreateOrderDTO): Promise<IOrder>;
    updateStatus(id: string, status: OrderStatus): Promise<IOrder | null>;
    updatePayment(id: string, paymentId: string): Promise<IOrder | null>;
    addFeedback(id: string, rating: number, feedback: string): Promise<IOrder | null>;
}
