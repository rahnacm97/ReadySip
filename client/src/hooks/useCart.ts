import { useState } from "react";
import type { Product, CartItem } from "../types";
import toast from "react-hot-toast";

export const useCart = () => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === product._id);
      if (existing) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.title} added!`, { duration: 1200 });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === productId);
      if (!existing) return prev;
      if (existing.quantity === 1)
        return prev.filter((i) => i._id !== productId);
      return prev.map((i) =>
        i._id === productId ? { ...i, quantity: i.quantity - 1 } : i,
      );
    });
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return { cart, cartCount, cartTotal, addToCart, removeFromCart, clearCart };
};
