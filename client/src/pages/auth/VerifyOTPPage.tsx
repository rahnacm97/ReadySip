import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/slices/authSlice";
import type { User } from "../../types";
import { APP_ROUTES } from "../../constants/routes";

const VerifyOTPPage: React.FC = () => {
  const location = useLocation();
  const email = (location.state as { email: string } | null)?.email ?? "";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) refs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) refs.current[i - 1]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Enter the 6-digit OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email, otp: code });
      const { token, user } = res.data as { token: string; user: User };
      dispatch(login({ token, user }));
      toast.success("Email verified! Welcome to ReadySip ☕");
      navigate(APP_ROUTES.MENU);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Invalid OTP";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("OTP resent to your email!");
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="customer-theme flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link
            to={APP_ROUTES.HOME}
            className="inline-flex items-center gap-2 mb-6"
          >
            <span className="text-3xl">☕</span>
            <span className="font-display text-2xl font-bold text-brand-400">
              ReadySip
            </span>
          </Link>
          <h1 className="font-display text-3xl font-bold text-stone-100">
            Verify Email
          </h1>
          <p className="text-stone-400 mt-2">
            We sent a 6-digit code to{" "}
            <span className="text-brand-400">{email}</span>
          </p>
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-3 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-2xl font-bold bg-stone-800 border border-stone-700 rounded-xl text-stone-100 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
              ))}
            </div>
            <button
              id="verify-otp-btn"
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading ? "Verifying…" : "Verify & Continue"}
            </button>
          </form>
          <div className="text-center mt-4">
            <button
              id="resend-otp-btn"
              onClick={handleResend}
              disabled={resending}
              className="text-stone-400 hover:text-brand-400 text-sm transition-colors disabled:opacity-50"
            >
              {resending ? "Resending…" : "Didn't get it? Resend OTP"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
