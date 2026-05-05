import { UserRepository } from "./repositories/UserRepository";
import { ProductRepository } from "./repositories/ProductRepository";
import { OrderRepository } from "./repositories/OrderRepository";
import { OTPRepository } from "./repositories/OtpRepository";

// Notification services
import { EmailService } from "./services/EmailService";
import { SMSService } from "./services/SMSService";

// Domain services (injected with repos + notification services)
import { AuthService } from "./services/AuthService";
import { ProductService } from "./services/ProductService";
import { OrderService } from "./services/OrderService";
import { PaymentService } from "./services/PaymentService";

// Controllers (injected with services)
import { AuthController } from "./controllers/AuthController";
import { ProductController } from "./controllers/ProductController";
import { OrderController } from "./controllers/OrderController";
import { PaymentController } from "./controllers/PaymentController";

// --- Instantiate repositories ---
const userRepo = new UserRepository();
const productRepo = new ProductRepository();
const orderRepo = new OrderRepository();
const otpRepo = new OTPRepository();

// --- Instantiate notification services ---
const emailService = new EmailService();
const smsService = new SMSService();

// --- Instantiate domain services ---
const authService = new AuthService(userRepo, otpRepo, emailService);
const productService = new ProductService(productRepo);
const orderService = new OrderService(orderRepo, emailService, smsService);
const paymentService = new PaymentService(orderRepo);

// --- Instantiate controllers ---
export const authController = new AuthController(authService);
export const productController = new ProductController(productService);
export const orderController = new OrderController(orderService);
export const paymentController = new PaymentController(paymentService);
