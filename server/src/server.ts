import "dotenv/config";
import express from "express";
import http from "http";
import cors from "cors";
import connectDB from "./config/db";
import { initSocket } from "./utils/socket";

// Routes
import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import orderRoutes from "./routes/orderRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import reviewRoutes from "./routes/reviewRoutes";
import adminRoutes from "./routes/adminRoutes";

const app = express();
const httpServer = http.createServer(app);

// Initialize Socket.io
initSocket(httpServer);

// Middleware
app.use(
  cors({
    origin: process.env["FRONTEND_URL"] || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/admin", adminRoutes);

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
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`🚀 ReadySip server running on http://localhost:${PORT}`);
  });
};

start().catch(console.error);
