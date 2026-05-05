"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = exports.orderController = exports.productController = exports.authController = void 0;
const UserRepository_1 = require("./repositories/UserRepository");
const ProductRepository_1 = require("./repositories/ProductRepository");
const OrderRepository_1 = require("./repositories/OrderRepository");
const OtpRepository_1 = require("./repositories/OtpRepository");
// Notification services
const EmailService_1 = require("./services/EmailService");
const SMSService_1 = require("./services/SMSService");
// Domain services (injected with repos + notification services)
const AuthService_1 = require("./services/AuthService");
const ProductService_1 = require("./services/ProductService");
const OrderService_1 = require("./services/OrderService");
const PaymentService_1 = require("./services/PaymentService");
// Controllers (injected with services)
const AuthController_1 = require("./controllers/AuthController");
const ProductController_1 = require("./controllers/ProductController");
const OrderController_1 = require("./controllers/OrderController");
const PaymentController_1 = require("./controllers/PaymentController");
// --- Instantiate repositories ---
const userRepo = new UserRepository_1.UserRepository();
const productRepo = new ProductRepository_1.ProductRepository();
const orderRepo = new OrderRepository_1.OrderRepository();
const otpRepo = new OtpRepository_1.OTPRepository();
// --- Instantiate notification services ---
const emailService = new EmailService_1.EmailService();
const smsService = new SMSService_1.SMSService();
// --- Instantiate domain services ---
const authService = new AuthService_1.AuthService(userRepo, otpRepo, emailService);
const productService = new ProductService_1.ProductService(productRepo);
const orderService = new OrderService_1.OrderService(orderRepo, emailService, smsService);
const paymentService = new PaymentService_1.PaymentService(orderRepo);
// --- Instantiate controllers ---
exports.authController = new AuthController_1.AuthController(authService);
exports.productController = new ProductController_1.ProductController(productService);
exports.orderController = new OrderController_1.OrderController(orderService);
exports.paymentController = new PaymentController_1.PaymentController(paymentService);
//# sourceMappingURL=container.js.map