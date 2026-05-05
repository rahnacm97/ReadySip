import type { OrderStatus } from "../../types/order";
import { IOrder } from "../models/order";
import { CreateOrderDTO } from "../../dtos/orderDto";
export interface IOrderRepository {
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
