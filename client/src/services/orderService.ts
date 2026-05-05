import api from "../api/axios";
import type { Order } from "../types";

export interface CreateOrderPayload {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: { product: string; title: string; price: number; quantity: number }[];
  timeOfArrival: string;
  totalAmount: number;
  razorpayOrderId?: string;
}

export const orderService = {
  async create(data: CreateOrderPayload): Promise<Order> {
    const res = await api.post<{ order: Order }>("/orders", data);
    return res.data.order;
  },

  async getAll(): Promise<Order[]> {
    const res = await api.get<{ orders: Order[] }>("/orders");
    return res.data.orders;
  },

  async getById(id: string): Promise<Order> {
    const res = await api.get<{ order: Order }>(`/orders/${id}`);
    return res.data.order;
  },

  async updateStatus(id: string, status: string): Promise<Order> {
    const res = await api.patch<{ order: Order }>(`/orders/${id}/status`, {
      status,
    });
    return res.data.order;
  },
};
