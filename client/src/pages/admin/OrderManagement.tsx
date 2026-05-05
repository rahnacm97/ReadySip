import React, { useEffect, useState, useCallback } from "react";
import api from "../../api/axios";
import type { Order } from "../../types";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  pending: "badge-pending",
  accepted: "badge-accepted",
  completed: "badge-completed",
  cancelled: "badge-cancelled",
};

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [updating, setUpdating] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/orders?page=${page}&limit=10`);
      const data = res.data as { orders: Order[]; totalPages: number };
      setOrders(data.orders);
      setTotalPages(data.totalPages);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    void fetchOrders();
    const socket = io("http://localhost:4000");
    socket.emit("join-admin");
    socket.on("new-order", ({ order }: { order: Order }) => {
      // If we are on the first page, add the new order
      if (page === 1) {
        setOrders((prev) => [order, ...prev.slice(0, 9)]);
      }
      toast.success(`New order from ${order.customerName}!`);
    });
    socket.on("order-updated", ({ order }: { order: Order }) => {
      setOrders((prev) => prev.map((o) => (o._id === order._id ? order : o)));
    });
    return () => {
      socket.disconnect();
    };
  }, [fetchOrders, page]);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await api.patch(`/orders/${orderId}/status`, { status });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, status: status as Order["status"] } : o,
        ),
      );
      toast.success(`Order ${status}!`);
    } catch {
      toast.error("Failed to update order");
    } finally {
      setUpdating(null);
    }
  };

  const displayed =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-stone-100">
          Order Management
        </h1>
        <p className="text-stone-400 mt-1">
          Accept, complete or cancel customer orders
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["all", "pending", "accepted", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            id={`order-filter-${s}`}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
              filter === s
                ? "bg-brand-600 text-white"
                : "bg-stone-800 text-stone-400 hover:text-stone-100"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-stone-800 rounded-2xl animate-pulse-soft"
            />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-20 text-stone-500">
          <div className="text-5xl mb-3">📭</div>
          <p>No {filter !== "all" ? filter : ""} orders found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayed.map((order) => (
              <div key={order._id} className="card p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-display text-lg font-semibold text-stone-100">
                        {order.customerName}
                      </span>
                      <span className={statusColors[order.status]}>
                        {order.status}
                      </span>
                      {order.paymentStatus === "paid" && (
                        <span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full text-xs">
                          💳 Paid
                        </span>
                      )}
                    </div>
                    <div className="text-stone-400 text-sm mb-3">
                      📞 {order.customerPhone}
                      {order.customerEmail && <> · 📧 {order.customerEmail}</>}
                    </div>
                    <div className="text-stone-400 text-sm mb-3">
                      🕐 Arrival:{" "}
                      <span className="text-stone-200">
                        {new Date(order.timeOfArrival).toLocaleString("en-IN", {
                          timeZone: "Asia/Kolkata",
                        })}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <div key={i} className="text-sm text-stone-300">
                          {item.title}{" "}
                          <span className="text-stone-500">
                            × {item.quantity}
                          </span>
                          <span className="text-brand-400 ml-2">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 font-semibold text-brand-400">
                      Total: ₹{order.totalAmount}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {order.status === "pending" && (
                      <>
                        <button
                          id={`accept-${order._id}`}
                          onClick={() =>
                            void updateStatus(order._id, "accepted")
                          }
                          disabled={updating === order._id}
                          className="btn-primary text-sm py-2"
                        >
                          {updating === order._id ? "…" : "✅ Accept"}
                        </button>
                        <button
                          id={`cancel-${order._id}`}
                          onClick={() =>
                            void updateStatus(order._id, "cancelled")
                          }
                          disabled={updating === order._id}
                          className="px-4 py-2 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 text-sm font-medium transition-all"
                        >
                          ❌ Cancel
                        </button>
                      </>
                    )}
                    {order.status === "accepted" && (
                      <button
                        id={`complete-${order._id}`}
                        onClick={() =>
                          void updateStatus(order._id, "completed")
                        }
                        disabled={updating === order._id}
                        className="btn-primary text-sm py-2"
                      >
                        {updating === order._id ? "…" : "🎯 Complete"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30 transition-all text-sm font-bold"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-2">
                <span className="text-stone-600 text-[10px] font-black uppercase tracking-widest">
                  Page
                </span>
                <span className="bg-brand-600 text-white px-3 py-1 rounded-lg text-sm font-black">
                  {page}
                </span>
                <span className="text-stone-600 text-[10px] font-black uppercase tracking-widest">
                  of {totalPages}
                </span>
              </div>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white disabled:opacity-30 transition-all text-sm font-bold"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrderManagement;
