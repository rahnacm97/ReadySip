"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io;
const initSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
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
exports.initSocket = initSocket;
const getIO = () => {
    if (!io)
        throw new Error("Socket.io not initialized");
    return io;
};
exports.getIO = getIO;
//# sourceMappingURL=socket.js.map