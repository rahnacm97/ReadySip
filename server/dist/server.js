"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("./config/db"));
const socket_1 = require("./utils/socket");
// Routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
// Initialize Socket.io
(0, socket_1.initSocket)(httpServer);
// Middleware
app.use((0, cors_1.default)({
    origin: process.env["FRONTEND_URL"] || "http://localhost:5173",
    credentials: true,
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/products", productRoutes_1.default);
app.use("/api/orders", orderRoutes_1.default);
app.use("/api/payments", paymentRoutes_1.default);
app.use("/api/upload", uploadRoutes_1.default);
app.use("/api/reviews", reviewRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
// Health check
app.get("/health", (_req, res) => {
    res.json({
        status: "ok",
        app: "ReadySip API",
        timestamp: new Date().toISOString(),
    });
});
// 404 handler
app.use((_req, res) => {
    res.status(404).json({ success: false, message: "Route not found" });
});
const PORT = parseInt(process.env["PORT"] || "4000");
const start = async () => {
    await (0, db_1.default)();
    httpServer.listen(PORT, () => {
        console.log(`🚀 ReadySip server running on http://localhost:${PORT}`);
    });
};
start().catch(console.error);
//# sourceMappingURL=server.js.map