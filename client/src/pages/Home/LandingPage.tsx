import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/other/Navbar";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";

const features = [
  {
    icon: "⚡",
    title: "Skip the Wait",
    desc: "Order ahead and walk in to a ready brew — no queue, no stress.",
  },
  {
    icon: "🎯",
    title: "Pick Your Time",
    desc: "Choose your arrival time and we'll have your order perfectly timed.",
  },
  {
    icon: "📱",
    title: "Instant Confirmation",
    desc: "Get an SMS the moment your order is accepted by our team.",
  },
];

const drinks = [
  {
    emoji: "🍵",
    label: "Artisan Teas",
    desc: "Masala chai, green tea, herbal blends & more",
  },
  {
    emoji: "☕",
    label: "Craft Coffees",
    desc: "Espresso, cold brew, filter kaapi & specialty roasts",
  },
  {
    emoji: "🥤",
    label: "Fresh Juices",
    desc: "Cold-pressed, seasonal, all-natural fruit blends",
  },
];

interface Testimonial {
  _id: string;
  customerName: string;
  feedback: string;
  rating: number;
}

const LandingPage: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await api.get("/reviews/testimonials");
        if (res.data.success) {
          setTestimonials(res.data.testimonials);
        }
      } catch (err) {
        console.error("Failed to fetch testimonials:", err);
      }
    };
    fetchTestimonials();
  }, []);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.9,
    }),
  };

  const paginate = useCallback(
    (newDirection: number) => {
      if (testimonials.length === 0) return;
      setDirection(newDirection);
      setCurrentIndex((prevIndex) => {
        let nextIndex = prevIndex + newDirection;
        if (nextIndex >= testimonials.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = testimonials.length - 1;
        return nextIndex;
      });
    },
    [testimonials.length],
  );

  // Auto-play
  useEffect(() => {
    if (testimonials.length === 0) return;
    const timer = setInterval(() => paginate(1), 5000);
    return () => clearInterval(timer);
  }, [paginate, testimonials.length]);

  return (
    <div className="customer-theme overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f5efe6_0%,_#FDF5E6_100%)]" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6 animate-slide-up pt-16 pb-8">
          <div className="w-full max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-4 mb-3 flex-wrap">
              <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
                <circle
                  cx="32"
                  cy="32"
                  r="30"
                  fill="#2D5016"
                  fillOpacity="0.09"
                />
                <path
                  d="M18 38c0 4.4 3.6 8 8 8h12c4.4 0 8-3.6 8-8V28H18v10z"
                  fill="#2D5016"
                />
                <rect
                  x="16"
                  y="24"
                  width="32"
                  height="6"
                  rx="3"
                  fill="#3a6b1e"
                />
                <path
                  d="M46 30h2a4 4 0 0 1 0 8h-2"
                  stroke="#2D5016"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="26"
                  cy="20"
                  rx="3"
                  ry="5"
                  fill="#2D5016"
                  fillOpacity="0.5"
                  transform="rotate(-15 26 20)"
                />
                <ellipse
                  cx="34"
                  cy="19"
                  rx="2.5"
                  ry="4.5"
                  fill="#2D5016"
                  fillOpacity="0.4"
                  transform="rotate(10 34 19)"
                />
              </svg>
              <div className="text-center">
                <h1 className="font-display text-6xl sm:text-7xl font-bold leading-none tracking-tight">
                  <span className="text-warm-500">Ready</span>
                  <span className="text-brand-600">Sip</span>
                </h1>
                <div className="flex items-center gap-2 justify-center mt-1">
                  <span className="h-px w-7 bg-amber-500 block" />
                  <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-amber-600">
                    Skip the wait, just sip
                  </span>
                  <span className="h-px w-7 bg-amber-500 block" />
                </div>
              </div>
              <svg width="44" height="52" viewBox="0 0 56 64" fill="none">
                <circle
                  cx="28"
                  cy="32"
                  r="26"
                  fill="#C4922A"
                  fillOpacity="0.1"
                />
                <rect
                  x="18"
                  y="16"
                  width="20"
                  height="34"
                  rx="6"
                  fill="#C4922A"
                  fillOpacity="0.15"
                  stroke="#C4922A"
                  strokeWidth="1.5"
                />
                <line
                  x1="28"
                  y1="10"
                  x2="28"
                  y2="15"
                  stroke="#C4922A"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle
                  cx="28"
                  cy="30"
                  r="5"
                  fill="#C4922A"
                  fillOpacity="0.5"
                />
                <circle cx="28" cy="30" r="2.5" fill="#C4922A" />
              </svg>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-brand-500/5 border border-brand-500/10 rounded-full px-4 py-2 mb-8">
            <span className="text-brand-500 text-sm font-semibold tracking-wide uppercase">
              ☕ Bangalore's Favourite Café
            </span>
          </div>
          <h1 className="font-display text-5xl sm:text-7xl font-bold text-warm-500 mb-6 leading-tight">
            Sip Smarter,
            <br />
            <span className="text-brand-500 italic">Not Harder</span>
          </h1>
          <p className="text-warm-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-medium">
            Bangalore moves fast. So does your coffee. Order your favourite tea,
            coffee or juice online — walk in and it's ready. No waiting. Just
            vibes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/menu"
              className="btn-primary text-lg px-8 py-4 shadow-xl shadow-brand-500/20"
            >
              Order Now →
            </Link>
            <Link to="/signup" className="btn-outline text-lg px-8 py-4">
              Create Account
            </Link>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-brand-500/40 animate-bounce">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6 bg-white/50 border-y border-stone-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-warm-500 mb-4 uppercase tracking-tight">
              How ReadySip Works
            </h2>
            <p className="text-warm-400 text-lg">
              Three simple steps to your perfect brew
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="card p-8 text-center hover:border-brand-500 transition-all duration-300 group bg-white shadow-xl shadow-stone-200/50"
              >
                <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <div className="w-8 h-1 bg-brand-500 rounded mx-auto mb-4 group-hover:w-16 transition-all duration-300" />
                <h3 className="font-display text-xl font-semibold text-warm-500 mb-3">
                  {f.title}
                </h3>
                <p className="text-warm-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl font-bold text-warm-500 mb-4 uppercase tracking-tight">
              What We Brew
            </h2>
            <p className="text-warm-400 text-lg">
              Handcrafted with love, served fresh every time
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {drinks.map((d, i) => (
              <Link
                to="/menu"
                key={i}
                className="card p-10 text-center group hover:border-brand-500 hover:bg-brand-50 transition-all duration-300 cursor-pointer bg-white shadow-xl shadow-stone-200/50"
              >
                <div className="text-6xl mb-6 group-hover:rotate-12 transition-transform duration-300">
                  {d.emoji}
                </div>
                <h3 className="font-display text-2xl font-semibold text-warm-500 mb-2">
                  {d.label}
                </h3>
                <p className="text-warm-400">{d.desc}</p>
                <div className="mt-6 text-brand-500 font-bold text-sm uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  View Menu →
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/menu"
              className="btn-primary text-lg px-10 py-4 shadow-xl shadow-brand-500/20"
            >
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="py-32 px-6 bg-[radial-gradient(circle_at_bottom_left,_#fff_0%,_#FDF5E6_100%)] relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

          <div className="max-w-5xl mx-auto relative">
            <div className="text-center mb-20">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6"
              >
                <span className="text-amber-600 text-[10px] font-black uppercase tracking-[0.2em]">
                  Customer Stories
                </span>
              </motion.div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold text-warm-500 mb-4 tracking-tight uppercase">
                ReadySip <span className="text-brand-500 italic">Love</span>
              </h2>
              <p className="text-warm-400 text-lg max-w-xl mx-auto font-medium">
                Join thousands of happy sippers skiping the wait in Bangalore
                every day.
              </p>
            </div>

            <div className="relative h-[400px] sm:h-[350px] flex items-center justify-center">
              <AnimatePresence initial={false} custom={direction}>
                <motion.div
                  key={currentIndex}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.4 },
                    scale: { duration: 0.4 },
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(_, info) => {
                    if (info.offset.x > 100) paginate(-1);
                    else if (info.offset.x < -100) paginate(1);
                  }}
                  className="absolute w-full max-w-2xl"
                >
                  <div className="bg-white p-10 sm:p-12 rounded-[3rem] border border-stone-100 shadow-2xl shadow-stone-200/50 relative overflow-hidden group">
                    {/* Quote icon */}
                    <div className="absolute top-6 right-10 text-brand-500/10 text-8xl font-serif pointer-events-none">
                      “
                    </div>

                    <div className="flex items-center gap-1 mb-8">
                      {[...Array(5)].map((_, i) => (
                        <motion.span
                          key={i}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: i * 0.1 }}
                          className={`text-2xl ${i < testimonials[currentIndex].rating ? "text-amber-400" : "text-stone-200"}`}
                        >
                          ★
                        </motion.span>
                      ))}
                    </div>

                    <p className="text-warm-500 text-xl sm:text-2xl italic mb-10 leading-relaxed font-medium relative z-10">
                      "{testimonials[currentIndex].feedback}"
                    </p>

                    <div className="flex items-center justify-between pt-8 border-t border-stone-50">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[conic-gradient(at_top_left,_var(--tw-gradient-stops))] from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-brand-500/20">
                          {testimonials[currentIndex].customerName?.charAt(0) ||
                            "U"}
                        </div>
                        <div>
                          <h4 className="font-bold text-warm-500 text-lg">
                            {testimonials[currentIndex].customerName ||
                              "Anonymous"}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            <p className="text-warm-300 text-[10px] uppercase tracking-widest font-black">
                              Verified Customer
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Page indicator for mobile */}
                      <div className="text-warm-200 text-xs font-black font-mono">
                        {String(currentIndex + 1).padStart(2, "0")} /{" "}
                        {String(testimonials.length).padStart(2, "0")}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="absolute -bottom-16 sm:bottom-auto sm:inset-x-[-100px] flex justify-center sm:justify-between items-center gap-6 px-4 z-20">
                <button
                  onClick={() => paginate(-1)}
                  className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-warm-400 hover:text-brand-500 hover:scale-110 active:scale-95 transition-all border border-stone-100 group"
                >
                  <span className="text-2xl group-hover:-translate-x-1 transition-transform">
                    ←
                  </span>
                </button>

                {/* Dots indicator */}
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setDirection(i > currentIndex ? 1 : -1);
                        setCurrentIndex(i);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-500 ${i === currentIndex ? "w-8 bg-brand-500" : "w-2 bg-stone-200 hover:bg-stone-300"}`}
                    />
                  ))}
                </div>

                <button
                  onClick={() => paginate(1)}
                  className="w-14 h-14 rounded-2xl bg-white shadow-xl flex items-center justify-center text-warm-400 hover:text-brand-500 hover:scale-110 active:scale-95 transition-all border border-stone-100 group"
                >
                  <span className="text-2xl group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-stone-200 bg-white text-center">
        <div className="flex flex-col items-center gap-6">
          <img src="/titlebar.png" alt="ReadySip" className="h-16 w-auto" />
          <p className="text-stone-400 text-sm max-w-sm">
            Bangalore's premium quick-pick café experience. Order online, skip
            the wait.
          </p>
          <div className="w-12 h-px bg-stone-200" />
          <p className="text-stone-500 text-xs font-medium tracking-widest uppercase">
            © {new Date().getFullYear()} ReadySip, Bangalore. Brewed with ❤️
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
