export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  type: "tea" | "coffee" | "juice";
  imageUrl: string;
  isAvailable: boolean;
  averageRating: number;
  numReviews: number;
}

export interface OrderItem {
  product: string;
  title: string;
  price: number;
  quantity: number;
}

export interface Order {
  _id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  items: OrderItem[];
  timeOfArrival: string;
  totalAmount: number;
  status: "pending" | "accepted" | "completed" | "cancelled";
  paymentId?: string;
  razorpayOrderId?: string;
  paymentStatus: "pending" | "paid" | "failed";
  rating?: number;
  feedback?: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "admin";
}

export interface CartItem extends Product {
  quantity: number;
}
