import { IOrder } from "../models/order";
import { CreateOrderDTO } from "../../dtos/orderDto";
export interface IOrderService {
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
