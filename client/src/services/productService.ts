import api from "../api/axios";
import type { Product } from "../types";

export const productService = {
  async getAll(
    options: {
      type?: string;
      search?: string;
      page?: number;
      limit?: number;
    } = {},
  ): Promise<{
    products: Product[];
    total: number;
    totalPages: number;
    page: number;
  }> {
    const { type, search, page, limit } = options;
    const params = new URLSearchParams();
    if (type && type !== "all") params.append("type", type);
    if (search) params.append("search", search);
    if (page) params.append("page", String(page));
    if (limit) params.append("limit", String(limit));

    const res = await api.get<{
      products: Product[];
      total: number;
      totalPages: number;
      page: number;
    }>(`/products?${params.toString()}`);
    return res.data;
  },

  async getById(id: string): Promise<Product> {
    const res = await api.get<{ product: Product }>(`/products/${id}`);
    return res.data.product;
  },

  async create(data: {
    title: string;
    description: string;
    price: number;
    type: string;
    imageUrl?: string;
    isAvailable?: boolean;
  }): Promise<Product> {
    const res = await api.post<{ product: Product }>("/products", data);
    return res.data.product;
  },

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const res = await api.put<{ product: Product }>(`/products/${id}`, data);
    return res.data.product;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
