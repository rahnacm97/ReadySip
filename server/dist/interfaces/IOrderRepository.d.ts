import type { IOrder, OrderStatus } from '../models/Order';
export interface CreateOrderDTO {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    items: {
        product: string;
        title: string;
        price: number;
        quantity: number;
    }[];
    timeOfArrival: Date;
    totalAmount: number;
    razorpayOrderId?: string;
}
export interface IOrderRepository {
    findAll(): Promise<IOrder[]>;
    findAllPaginated(page: number, limit: number): Promise<{
        orders: IOrder[];
        totalPages: number;
        totalOrders: number;
    }>;
    findById(id: string): Promise<IOrder | null>;
    findByCustomer(email?: string, phone?: string): Promise<IOrder[]>;
    create(data: CreateOrderDTO): Promise<IOrder>;
    updateStatus(id: string, status: OrderStatus): Promise<IOrder | null>;
    updatePayment(id: string, paymentId: string): Promise<IOrder | null>;
    addFeedback(id: string, rating: number, feedback: string): Promise<IOrder | null>;
}
