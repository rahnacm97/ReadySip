import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { APP_ROUTES } from "../../constants/routes";

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const navigate = useNavigate();

  const [form, setForm] = useState({ password: "", confirm: "" });
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const validate = () => {
    const newErrors: { password?: string; confirm?: string } = {};
    if (!form.password) newErrors.password = "Required";
    else if (form.password.length < 6) newErrors.password = "Min 6 characters";
    if (form.password !== form.confirm) newErrors.confirm = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (!token) {
      toast.error("Invalid or missing reset token.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/auth/reset-password", { token, password: form.password });
      setDone(true);
      toast.success("Password reset successful!");
      setTimeout(() => navigate(APP_ROUTES.LOGIN), 2500);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data?.message ??
        "Reset failed. The link may have expired.";
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
            New Password
          </h1>
          <p className="text-stone-500 font-medium text-sm">
            Set a strong new password for your account.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-2xl shadow-stone-200/50">
          {done ? (
            <div className="text-center space-y-6">
              <div className="text-5xl">✅</div>
              <div>
                <p className="text-stone-700 font-black text-base mb-2">Password Updated!</p>
                <p className="text-stone-400 text-sm">Redirecting you to login…</p>
              </div>
              <Link
                to={APP_ROUTES.LOGIN}
                className="inline-block w-full bg-brand-500 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-600 transition-all text-center"
              >
                Go to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* New Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-0.5">
                  New Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handleChange}
                    className={`w-full bg-stone-50/50 border ${errors.password ? "border-red-300 ring-2 ring-red-50" : "border-stone-100 focus:border-brand-500"} rounded-xl px-4 py-3 text-stone-900 text-sm font-medium transition-all outline-none pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-brand-500 transition-colors"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-0.5">
                    ⚠ {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-0.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    name="confirm"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirm}
                    onChange={handleChange}
                    className={`w-full bg-stone-50/50 border ${errors.confirm ? "border-red-300 ring-2 ring-red-50" : "border-stone-100 focus:border-brand-500"} rounded-xl px-4 py-3 text-stone-900 text-sm font-medium transition-all outline-none pr-12`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-brand-500 transition-colors"
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirm && (
                  <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-0.5">
                    ⚠ {errors.confirm}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-600 transition-all shadow-lg disabled:opacity-60"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>

              <p className="text-center text-xs text-stone-400 font-medium pt-1">
                <Link to={APP_ROUTES.LOGIN} className="text-brand-600 font-black hover:underline">
                  ← Back to Login
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
