import React, { useState } from "react";
import type { CartItem } from "../../types";
import api from "../../api/axios";
import toast from "react-hot-toast";

interface Props {
  cart: CartItem[];
  onClose: () => void;
  onSuccess: () => void;
}

const OrderModal: React.FC<Props> = ({ cart, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    timeOfArrival: "",
  });
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName || !form.customerPhone || !form.timeOfArrival) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      // Create the order directly in DB without payment step
      await api.post("/orders", {
        ...form,
        items: cart.map((c) => ({
          product: c._id,
          title: c.title,
          price: c.price,
          quantity: c.quantity,
        })),
        timeOfArrival: new Date(form.timeOfArrival).toISOString(),
        totalAmount: total,
      });

      toast.success("🎉 Order placed! Pay at the counter when you arrive.");
      onSuccess();
    } catch (err) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to place order";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const [minTime] = useState(() => {
    return new Date(Date.now() + 15 * 60 * 1000).toISOString().slice(0, 16);
  });

  return (
    <div className="customer-theme fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="card w-full max-w-lg p-8 animate-slide-up max-h-[95vh] overflow-y-auto bg-white shadow-2xl border-stone-100 rounded-[2.5rem]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-display text-3xl font-bold text-warm-500 uppercase tracking-tight">
            Confirm Order
          </h2>
          <button
            onClick={onClose}
            className="text-warm-200 hover:text-brand-500 text-3xl transition-colors"
          >
            ×
          </button>
        </div>

        {/* Cart Summary */}
        <div className="bg-cream/50 rounded-3xl p-6 mb-8 border border-stone-100">
          <h3 className="text-xs font-black text-warm-200 uppercase tracking-[0.2em] mb-4">
            Your Selection
          </h3>
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item._id}
                className="flex justify-between items-center text-sm"
              >
                <span className="text-warm-500 font-bold">
                  {item.title}{" "}
                  <span className="text-warm-200 font-normal ml-1">
                    × {item.quantity}
                  </span>
                </span>
                <span className="text-brand-500 font-black">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-stone-100 mt-6 pt-4 flex justify-between items-end">
            <span className="text-warm-300 text-xs font-black uppercase tracking-widest">
              Total Amount
            </span>
            <span className="text-brand-500 text-3xl font-black">₹{total}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-warm-300 text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1">
                Full Name
              </label>
              <input
                id="order-name"
                name="customerName"
                value={form.customerName}
                onChange={handleChange}
                className="input-field bg-stone-50/50"
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label className="block text-warm-300 text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1">
                Phone Number
              </label>
              <input
                id="order-phone"
                name="customerPhone"
                value={form.customerPhone}
                onChange={handleChange}
                className="input-field bg-stone-50/50"
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-warm-300 text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1">
              Email Address (Optional)
            </label>
            <input
              id="order-email"
              name="customerEmail"
              value={form.customerEmail}
              onChange={handleChange}
              className="input-field bg-stone-50/50"
              placeholder="john@example.com"
              type="email"
            />
          </div>

          <div>
            <label className="block text-warm-300 text-[10px] font-black uppercase tracking-widest mb-1.5 ml-1">
              Estimated Arrival Time
            </label>
            <input
              id="order-time"
              name="timeOfArrival"
              value={form.timeOfArrival}
              onChange={handleChange}
              className="input-field bg-stone-50/50 font-bold text-brand-500"
              type="datetime-local"
              min={minTime}
              required
            />
            <p className="text-warm-200 text-[10px] mt-2 font-bold uppercase tracking-tighter">
              Please choose a time at least 15 minutes from now
            </p>
          </div>

          <button
            type="submit"
            id="place-order-btn"
            disabled={loading}
            className="btn-primary w-full py-5 rounded-[1.5rem] mt-4 text-lg font-black uppercase tracking-[0.2em] shadow-2xl shadow-brand-500/20"
          >
            {loading ? "Sending Order..." : "Confirm My Sip →"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderModal;
