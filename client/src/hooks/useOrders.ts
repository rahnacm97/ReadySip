import { useState, useEffect, useCallback } from "react";
import { orderService } from "../services/orderService";
import type { Order } from "../types";
import toast from "react-hot-toast";

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await orderService.getAll();
      setOrders(data);
    } catch {
      setError("Failed to load orders");
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetch();
  }, [fetch]);

  const updateOrderStatus = async (
    id: string,
    status: string,
  ): Promise<Order> => {
    const updated = await orderService.updateStatus(id, status);
    setOrders((prev) => prev.map((o) => (o._id === id ? updated : o)));
    return updated;
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const syncOrder = (order: Order) => {
    setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
  };

  return {
    orders,
    loading,
    error,
    refetch: fetch,
    updateOrderStatus,
    addOrder,
    syncOrder,
  };
};
