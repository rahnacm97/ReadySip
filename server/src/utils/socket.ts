import { Server as SocketServer } from "socket.io";
import { Server as HttpServer } from "http";

let io: SocketServer;

export const initSocket = (httpServer: HttpServer): SocketServer => {
  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env["FRONTEND_URL"] || "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Admin joins admin room on connection
    socket.on("join-admin", () => {
      void socket.join("admin-room");
      console.log(`👑 Admin joined room: ${socket.id}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketServer => {
  if (!io) throw new Error("Socket.io not initialized");
  return io;
};
