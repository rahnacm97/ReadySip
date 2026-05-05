"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const socket_1 = require("../utils/socket");
class OrderService {
    constructor(orderRepo, emailService, smsService) {
        this.orderRepo = orderRepo;
        this.emailService = emailService;
        this.smsService = smsService;
    }
    async createOrder(data) {
        const order = await this.orderRepo.create(data);
        // Real-time admin notification
        try {
            (0, socket_1.getIO)().to("admin-room").emit("new-order", { order });
        }
        catch {
            /* Socket not yet connected — safe to ignore */
        }
        const adminPhone = process.env["ADMIN_PHONE"] ?? "";
        const arrivalStr = new Date(data.timeOfArrival).toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
        });
        void this.emailService
            .sendOrderConfirmationToAdmin({
            customerName: data.customerName,
            customerPhone: data.customerPhone,
            items: data.items,
            timeOfArrival: arrivalStr,
            totalAmount: data.totalAmount,
            orderId: order._id.toString(),
        })
            .catch((e) => console.error("Admin email error:", e));
        void this.smsService
            .sendNewOrderAlert(adminPhone, data.customerName, order._id.toString())
            .catch((e) => console.error("Admin SMS error:", e));
        return order;
    }
    async getAllOrders(page, limit) {
        return this.orderRepo.findAllPaginated(page, limit);
    }
    async getOrdersByCustomer(email, phone) {
        return this.orderRepo.findByCustomer(email, phone);
    }
    async getOrdersByCustomerPaginated(page, limit, email, phone) {
        return this.orderRepo.findByCustomerPaginated(page, limit, email, phone);
    }
    async getOrderById(id) {
        const order = await this.orderRepo.findById(id);
        if (!order)
            throw new Error("Order not found");
        return order;
    }
    async updateStatus(id, status) {
        const validStatuses = [
            "pending",
            "accepted",
            "completed",
            "cancelled",
        ];
        if (!validStatuses.includes(status)) {
            throw new Error("Invalid order status");
        }
        const order = await this.orderRepo.updateStatus(id, status);
        if (!order)
            throw new Error("Order not found");
        if (status === "accepted") {
            const arrivalStr = order.timeOfArrival.toLocaleString("en-IN", {
                timeZone: "Asia/Kolkata",
            });
            if (order.customerEmail) {
                void this.emailService
                    .sendOrderAcceptedToCustomer(order.customerEmail, order.customerName, arrivalStr)
                    .catch((e) => console.error("Customer email error:", e));
            }
            void this.smsService
                .sendOrderAccepted(order.customerPhone, order.customerName, arrivalStr)
                .catch((e) => console.error("Customer SMS error:", e));
        }
        // Broadcast update to admin dashboard
        try {
            (0, socket_1.getIO)().to("admin-room").emit("order-updated", { order });
        }
        catch {
            /* ignore */
        }
        return order;
    }
    async addFeedback(id, rating, feedback) {
        if (rating < 1 || rating > 5) {
            throw new Error("Rating must be between 1 and 5");
        }
        const order = await this.orderRepo.addFeedback(id, rating, feedback);
        if (!order)
            throw new Error("Order not found");
        return order;
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=OrderService.js.map