export const APP_ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  SIGNUP: "/signup",
  VERIFY_OTP: "/verify-otp",
  MENU: "/menu",
  PROFILE: "/profile",
  ORDERS: "/my-orders",
  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    PRODUCTS: "/admin/products",
    ORDERS: "/admin/orders",
  },
} as const;

export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    SIGNUP: "/auth/signup",
    VERIFY_OTP: "/auth/verify-otp",
    RESEND_OTP: "/auth/resend-otp",
    GOOGLE_LOGIN: "/auth/google-login",
    ME: "/auth/me",
  },
  PRODUCTS: {
    BASE: "/products",
    BY_ID: (id: string) => `/products/${id}`,
  },
  ORDERS: {
    BASE: "/orders",
    MY_ORDERS: "/orders/my-orders",
    FEEDBACK: (id: string) => `/orders/${id}/feedback`,
  },
  REVIEWS: {
    BASE: "/reviews",
    MY_REVIEWS: "/reviews/my-reviews",
    TESTIMONIALS: "/reviews/testimonials",
  },
} as const;
