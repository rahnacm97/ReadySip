import React, { useState, useEffect } from "react";
import Navbar from "../../components/other/Navbar";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useAppSelector } from "../../store/hooks";
import { Navigate } from "react-router-dom";
import type { Order } from "../../types";
import { API_ROUTES } from "../../constants/routes";

const statusColors = {
  pending: "bg-amber-100 text-amber-600 border-amber-200",
  accepted: "bg-blue-100 text-blue-600 border-blue-200",
  completed: "bg-brand-50 text-brand-600 border-brand-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
};

const MyOrdersPage: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Feedback State
  const [activeFeedbackId, setActiveFeedbackId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [feedback, setFeedback] = useState("");

  // Item Feedback State
  interface Review {
    product: string;
    rating: number;
    comment: string;
  }
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [itemRating, setItemRating] = useState<number>(5);
  const [itemComment, setItemComment] = useState("");

  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const [ordersRes, reviewsRes] = await Promise.all([
          api.get(`${API_ROUTES.ORDERS.MY_ORDERS}?page=${page}&limit=3`),
          api.get(API_ROUTES.REVIEWS.MY_REVIEWS),
        ]);
        setOrders(ordersRes.data.orders);
        setTotalPages(ordersRes.data.totalPages);
        setUserReviews(reviewsRes.data.reviews);
      } catch {
        toast.error("Failed to load your orders");
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [user, page]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const submitFeedback = async (orderId: string) => {
    setSubmittingFeedback(true);
    try {
      await api.post(API_ROUTES.ORDERS.FEEDBACK(orderId), { rating, feedback });
      setOrders(
        orders.map((o) => (o._id === orderId ? { ...o, rating, feedback } : o)),
      );
      toast.success("Thank you for your café feedback!");
      setActiveFeedbackId(null);
      setRating(5);
      setFeedback("");
    } catch {
      toast.error("Failed to submit feedback");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const submitItemReview = async (productId: string, orderId: string) => {
    setSubmittingFeedback(true);
    try {
      const res = await api.post(API_ROUTES.REVIEWS.BASE, {
        productId,
        rating: itemRating,
        comment: itemComment,
      });
      if (res.data.success) {
        setUserReviews([...userReviews, res.data.review]);
        toast.success("Product review submitted!");
        setActiveItemId(`${orderId}-${productId}`);
        setItemRating(5);
        setItemComment("");
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Failed to submit review";
      toast.error(msg);
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const renderStars = (currentRating: number, setter?: (n: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!setter || submittingFeedback}
            onClick={() => setter && setter(star)}
            className={`text-2xl transition-all duration-300 ${setter ? "hover:scale-125 hover:rotate-12" : ""} ${star <= currentRating ? "text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" : "text-stone-200"}`}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen relative customer-theme selection:bg-brand-100 selection:text-brand-900 !bg-transparent">
      {/* Dynamic Background to match Landing Page theme */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_#f5efe6_0%,_#FDF5E6_100%)] -z-20 pointer-events-none" />
      
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        {/* Header Section */}
        <div className="relative mb-16 text-center">
          <div className="absolute inset-0 -top-20 -z-10 blur-3xl opacity-20">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-400 rounded-full mix-blend-multiply" />
          </div>
          <h1 className="font-display text-5xl sm:text-6xl font-black text-stone-900 mb-4 tracking-tighter animate-slide-up">
            Order <span className="text-brand-600">History</span>
          </h1>
          <p className="text-stone-500 text-lg font-medium max-w-xl mx-auto animate-slide-up delay-100">
            A journey of your favorite sips and treats. Revisit your past experiences.
          </p>
        </div>

        {loading ? (
          <div className="space-y-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-64 bg-white/50 backdrop-blur-sm rounded-[2.5rem] border border-stone-100 animate-pulse-soft shadow-sm"
              ></div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="relative group p-12 text-center bg-white rounded-[3rem] border-2 border-dashed border-stone-200 shadow-2xl shadow-stone-200/50 overflow-hidden animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <div className="relative z-10">
              <div className="text-8xl mb-8 transform group-hover:scale-110 transition-transform duration-500 grayscale group-hover:grayscale-0">☕</div>
              <h3 className="text-2xl font-black text-stone-900 uppercase tracking-widest mb-3">
                Your cup is empty
              </h3>
              <p className="text-stone-500 mb-8 font-medium max-w-md mx-auto">
                Looks like you haven't discovered your favorite brew yet. Let's change that!
              </p>
              <a
                href="/menu"
                className="inline-flex items-center gap-3 bg-stone-900 text-white px-10 py-4 rounded-2xl font-bold text-sm uppercase tracking-widest hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-200 transition-all duration-300 group"
              >
                Explore Menu
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>
        ) : (
          <div className="space-y-10 animate-fade-in">
            {orders.map((order, idx) => (
              <div
                key={order._id}
                style={{ animationDelay: `${idx * 150}ms` }}
                className="group relative bg-white/80 backdrop-blur-md rounded-[3rem] border border-stone-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] hover:border-brand-200 transition-all duration-500 animate-slide-up-subtle overflow-hidden"
              >
                {/* Status Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                  <div className={`h-full w-full transition-all duration-500 ${
                    order.status === 'completed' ? 'bg-brand-500' : 
                    order.status === 'accepted' ? 'bg-blue-500' :
                    order.status === 'cancelled' ? 'bg-red-500' : 'bg-amber-500'
                  }`} />
                </div>

                <div className="p-8 sm:p-12">
                  <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left: Order Info */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-8">
                        <span className="px-5 py-2 rounded-2xl bg-stone-100 text-stone-600 text-[10px] font-black uppercase tracking-widest">
                          #{order._id.slice(-6).toUpperCase()}
                        </span>
                        <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border ${statusColors[order.status]}`}>
                          {order.status}
                        </span>
                        <span className="text-stone-400 text-sm font-medium ml-auto italic">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>

                      <div className="space-y-6">
                        {order.items.map((item, i) => {
                          const itemReview = userReviews.find((r) => r.product === item.product);
                          const isRatingThisItem = activeItemId === `${order._id}-${item.product}`;

                          return (
                            <div key={i} className="relative group/item bg-stone-50/50 rounded-[2rem] p-6 border border-stone-100/50 transition-all hover:bg-white hover:shadow-lg hover:shadow-stone-100 hover:border-brand-100">
                              <div className="flex justify-between items-start mb-4">
                                <div>
                                  <h4 className="text-stone-900 font-bold text-lg mb-1">{item.title}</h4>
                                  <p className="text-stone-400 text-sm font-medium">Quantity: {item.quantity}</p>
                                </div>
                                <span className="text-brand-600 font-black text-xl">₹{item.price * item.quantity}</span>
                              </div>

                              {/* Item Review System */}
                              {order.status === "completed" && (
                                <div className="mt-4 pt-4 border-t border-stone-100">
                                  {itemReview ? (
                                    <div className="flex items-center justify-between">
                                      <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, starIdx) => (
                                          <span key={starIdx} className={`text-sm ${starIdx < itemReview.rating ? "text-amber-400" : "text-stone-200"}`}>★</span>
                                        ))}
                                      </div>
                                      <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full">Reviewed</span>
                                    </div>
                                  ) : isRatingThisItem ? (
                                    <div className="animate-fade-in space-y-4">
                                      {renderStars(itemRating, setItemRating)}
                                      <textarea
                                        className="w-full bg-white border border-stone-200 rounded-2xl p-4 text-sm text-stone-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none shadow-inner"
                                        rows={2}
                                        placeholder="Tell us what you liked about this..."
                                        value={itemComment}
                                        onChange={(e) => setItemComment(e.target.value)}
                                      />
                                      <div className="flex justify-end gap-3">
                                        <button onClick={() => setActiveItemId(null)} className="text-[10px] font-black uppercase text-stone-400 hover:text-stone-600 transition-colors">Cancel</button>
                                        <button 
                                          onClick={() => void submitItemReview(item.product, order._id)}
                                          disabled={submittingFeedback}
                                          className="bg-stone-900 text-white text-[10px] px-6 py-2.5 rounded-xl font-black uppercase tracking-widest hover:bg-brand-600 transition-all shadow-lg shadow-stone-200"
                                        >
                                          {submittingFeedback ? "..." : "Submit"}
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setActiveItemId(`${order._id}-${item.product}`);
                                        setItemRating(5);
                                        setItemComment("");
                                      }}
                                      className="flex items-center gap-2 text-[10px] font-black text-stone-400 uppercase tracking-widest hover:text-brand-600 transition-colors group/btn"
                                    >
                                      <span className="text-lg group-hover/btn:rotate-12 transition-transform">⭐</span> Rate this item
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right: Summary & Cafe Review */}
                    <div className="lg:w-80">
                      <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-stone-300 mb-8 relative overflow-hidden group/card">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500 rounded-full blur-3xl opacity-20 -mr-16 -mt-16 group-hover/card:opacity-40 transition-opacity" />
                        
                        <div className="relative z-10">
                          <div className="mb-8">
                            <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest block mb-2">Arrival Slot</span>
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">⏰</span>
                              <span className="font-bold text-lg">
                                {new Date(order.timeOfArrival).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                              </span>
                            </div>
                          </div>

                          <div className="pt-8 border-t border-white/10">
                            <span className="text-stone-500 text-[10px] font-black uppercase tracking-widest block mb-2">Total Amount</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-brand-400 text-sm font-bold">₹</span>
                              <span className="text-4xl font-black tracking-tighter">{order.totalAmount}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Cafe Review Section */}
                      {order.status === "completed" && (
                        <div className="animate-fade-in">
                          {order.rating ? (
                            <div className="bg-brand-50/50 rounded-[2rem] p-6 border border-brand-100">
                              <div className="flex items-center justify-between mb-3">
                                <span className="text-[10px] font-black text-brand-600 uppercase tracking-widest">Experience</span>
                                {renderStars(order.rating)}
                              </div>
                              {order.feedback && <p className="text-stone-500 text-sm italic font-medium">"{order.feedback}"</p>}
                            </div>
                          ) : activeFeedbackId === order._id ? (
                            <div className="bg-white rounded-[2.5rem] p-8 border border-brand-200 shadow-xl shadow-brand-100/50">
                              <h4 className="font-black text-stone-900 text-xs uppercase tracking-widest mb-4">The Café Vibe?</h4>
                              <div className="mb-6">{renderStars(rating, setRating)}</div>
                              <textarea
                                className="w-full bg-stone-50 border border-stone-100 rounded-2xl p-4 text-sm text-stone-700 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 outline-none transition-all resize-none mb-4"
                                rows={3}
                                placeholder="Service, ambiance, wait time..."
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                              />
                              <div className="flex flex-col gap-2">
                                <button onClick={() => void submitFeedback(order._id)} className="w-full bg-stone-900 text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-600 transition-all">
                                  {submittingFeedback ? "..." : "Submit Experience"}
                                </button>
                                <button onClick={() => setActiveFeedbackId(null)} className="w-full py-2 text-stone-400 text-[10px] font-black uppercase tracking-widest hover:text-stone-600 transition-colors">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => { setActiveFeedbackId(order._id); setRating(5); setFeedback(""); }}
                              className="w-full group/rate flex flex-col items-center gap-3 p-8 bg-white/50 backdrop-blur-sm border-2 border-dashed border-stone-200 rounded-[2.5rem] hover:border-brand-400 hover:bg-brand-50/30 transition-all duration-300"
                            >
                              <span className="text-3xl group-hover/rate:scale-125 transition-transform duration-500">☕</span>
                              <span className="text-[10px] font-black text-stone-400 group-hover/rate:text-brand-600 uppercase tracking-[0.2em] transition-colors">Rate Café Experience</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-20 pb-10">
                <button
                  onClick={() => { setPage((p) => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === 1}
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-stone-200 text-stone-600 font-bold text-sm uppercase tracking-widest hover:border-brand-500 hover:text-brand-600 disabled:opacity-30 disabled:hover:border-stone-200 disabled:hover:text-stone-600 transition-all duration-300 shadow-lg shadow-stone-100"
                >
                  <span className="group-hover:-translate-x-1 transition-transform">←</span>
                  Prev
                </button>
                
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-stone-900 text-white font-black text-lg shadow-xl shadow-stone-300">
                    {page}
                  </div>
                  <span className="text-stone-300 font-bold text-sm uppercase tracking-widest">of</span>
                  <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white border border-stone-200 text-stone-600 font-black text-lg shadow-sm">
                    {totalPages}
                  </div>
                </div>

                <button
                  onClick={() => { setPage((p) => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  disabled={page === totalPages}
                  className="group flex items-center gap-3 px-8 py-4 rounded-2xl bg-white border border-stone-200 text-stone-600 font-bold text-sm uppercase tracking-widest hover:border-brand-500 hover:text-brand-600 disabled:opacity-30 disabled:hover:border-stone-200 disabled:hover:text-stone-600 transition-all duration-300 shadow-lg shadow-stone-100"
                >
                  Next
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default MyOrdersPage;
