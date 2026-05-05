import React, { useState, useEffect } from "react";
import Navbar from "../../components/other/Navbar";
import ProductCard from "../../components/other/ProductCard";
import OrderModal from "../../components/other/OrderModal";
import { useProducts } from "../../hooks/useProducts";
import { useCart } from "../../hooks/useCart";

type DrinkFilter = "all" | "tea" | "coffee" | "juice";

const filters: { label: string; value: DrinkFilter; icon: string }[] = [
  { label: "All", value: "all", icon: "🍶" },
  { label: "Tea", value: "tea", icon: "🍵" },
  { label: "Coffee", value: "coffee", icon: "☕" },
  { label: "Juice", value: "juice", icon: "🥤" },
];

const MenuPage: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<DrinkFilter>("all");
  const [showModal, setShowModal] = useState(false);

  // Pagination and Search from hook (uses backend search and pagination)
  const { products, loading, page, setPage, totalPages, search, setSearch } =
    useProducts(activeFilter !== "all" ? activeFilter : undefined, 12); // 9 per page for customers

  const { cart, cartCount, cartTotal, addToCart, removeFromCart, clearCart } =
    useCart();

  // Reset to first page when filter changes
  useEffect(() => {
    setPage(1);
  }, [activeFilter, setPage]);

  return (
    <div className="customer-theme">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-warm-500 mb-3 uppercase tracking-tight">
            Our Menu
          </h1>
          <p className="text-warm-400 text-lg font-medium">
            Pick your brew, set your time, and walk in ready
          </p>
        </div>

        <div className="max-w-md mx-auto mb-8 relative group">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-200 group-focus-within:text-brand-500 transition-colors font-bold">
            🔍
          </span>
          <input
            id="menu-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-12 text-left bg-white shadow-sm border-stone-200 text-warm-500"
            placeholder="Search drinks..."
          />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {filters.map((f) => (
            <button
              key={f.value}
              id={`filter-${f.value}`}
              onClick={() => setActiveFilter(f.value)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all duration-300 border-2 ${
                activeFilter === f.value
                  ? "bg-brand-500 border-brand-500 text-white shadow-lg shadow-brand-500/30"
                  : "bg-white border-stone-200 text-warm-400 hover:border-brand-500 hover:text-brand-500"
              }`}
            >
              <span className="text-xl">{f.icon}</span> {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="card h-80 animate-pulse-soft bg-white" />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-stone-400 bg-white/50 rounded-3xl border-2 border-dashed border-stone-200">
            <div className="text-7xl mb-4 opacity-50">🫗</div>
            <p className="text-xl font-display uppercase tracking-widest">
              No drinks found matching your search
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                  cartItem={cart.find((c) => c._id === p._id)}
                  onAdd={addToCart}
                  onRemove={removeFromCart}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-6 mt-20 animate-fade-in">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-8 py-3 rounded-2xl bg-white border-2 border-stone-100 text-stone-500 font-bold disabled:opacity-30 hover:border-brand-500 hover:text-brand-500 transition-all shadow-md"
                >
                  ← Previous
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-warm-200 text-xs font-bold uppercase tracking-widest">
                    Page
                  </span>
                  <span className="bg-brand-500 text-white px-4 py-2 rounded-xl font-black shadow-lg shadow-brand-500/20">
                    {page}
                  </span>
                  <span className="text-warm-200 text-xs font-bold uppercase tracking-widest">
                    of {totalPages}
                  </span>
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-8 py-3 rounded-2xl bg-white border-2 border-stone-100 text-stone-500 font-bold disabled:opacity-30 hover:border-brand-500 hover:text-brand-500 transition-all shadow-md"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {cartCount > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <button
            id="open-cart-btn"
            onClick={() => setShowModal(true)}
            className="flex items-center gap-6 bg-brand-500 hover:bg-brand-600 text-white px-10 py-5 rounded-3xl shadow-2xl shadow-brand-500/40 transition-all duration-300 font-black uppercase tracking-widest"
          >
            <span className="bg-white/20 rounded-2xl px-4 py-1.5 text-sm">
              {cartCount}
            </span>
            <span className="text-lg">Checkout</span>
            <span className="text-white/40 font-thin">|</span>
            <span className="text-lg">₹{cartTotal}</span>
          </button>
        </div>
      )}

      {showModal && (
        <OrderModal
          cart={cart}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            clearCart();
          }}
        />
      )}
    </div>
  );
};

export default MenuPage;
