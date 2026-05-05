import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import type { Order } from "../types";

interface UseSocketOptions {
  onNewOrder?: (order: Order) => void;
  onOrderUpdated?: (order: Order) => void;
}

const SOCKET_URL =
  (import.meta.env["VITE_SOCKET_URL"] as string) ?? "http://localhost:4000";

export const useAdminSocket = ({
  onNewOrder,
  onOrderUpdated,
}: UseSocketOptions) => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join-admin");
    });

    if (onNewOrder) {
      socket.on("new-order", ({ order }: { order: Order }) =>
        onNewOrder(order),
      );
    }

    if (onOrderUpdated) {
      socket.on("order-updated", ({ order }: { order: Order }) =>
        onOrderUpdated(order),
      );
    }

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return socketRef;
};
