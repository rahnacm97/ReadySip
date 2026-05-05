import React, { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { APP_ROUTES } from "../../constants/routes";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const validate = () => {
    if (!email) { setError("Email is required"); return false; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError("Invalid email format"); return false; }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!validate()) return;

    setLoading(true);
    try {
      await api.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("Reset link sent! Check your inbox.");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        "Failed to send reset email";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_#f5efe6_0%,_#FDF5E6_100%)]">
      <div className="w-full max-w-[380px] animate-fade-in">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">☕</span>
            <span className="font-display text-2xl font-black text-brand-600">ReadySip</span>
          </Link>
          <h1 className="text-3xl font-display font-black text-stone-900 mb-3 tracking-tight">
            Reset Password
          </h1>
          <p className="text-stone-500 font-medium text-sm">
            Enter your registered email and we'll send you a reset link.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-2xl shadow-stone-200/50">
          {sent ? (
            <div className="text-center space-y-6">
              <div className="text-5xl">📬</div>
              <div>
                <p className="text-stone-700 font-black text-base mb-2">Check your inbox</p>
                <p className="text-stone-400 text-sm leading-relaxed">
                  We sent a password reset link to{" "}
                  <span className="text-brand-600 font-black">{email}</span>.
                  It expires in 15 minutes.
                </p>
              </div>
              <Link
                to={APP_ROUTES.LOGIN}
                className="inline-block w-full bg-stone-900 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-600 transition-all text-center"
              >
                Back to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-0.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  className={`w-full bg-stone-50/50 border ${error ? "border-red-300 ring-2 ring-red-50" : "border-stone-100 focus:border-brand-500"} rounded-xl px-4 py-3 text-stone-900 text-sm font-medium transition-all outline-none shadow-sm`}
                  placeholder="name@example.com"
                />
                {error && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-0.5">
                    ⚠ {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-600 transition-all shadow-lg disabled:opacity-60"
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>

              <p className="text-center text-xs text-stone-400 font-medium pt-1">
                Remember your password?{" "}
                <Link to={APP_ROUTES.LOGIN} className="text-brand-600 font-black hover:underline">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
