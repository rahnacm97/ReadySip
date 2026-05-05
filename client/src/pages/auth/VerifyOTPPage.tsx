import React, { useState, useRef, useEffect } from "react";
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
  const [timer, setTimer] = useState(60);
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

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
      toast.success("Email verified! Welcome back ☕");
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
    if (timer > 0) return;
    setResending(true);
    try {
      await api.post("/auth/resend-otp", { email });
      toast.success("New OTP sent to your email!");
      setTimer(60);
      setOtp(["", "", "", "", "", ""]);
      refs.current[0]?.focus();
    } catch {
      toast.error("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_#f5efe6_0%,_#FDF5E6_100%)]">
      <div className="w-full max-w-[400px] animate-fade-in">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <span className="text-3xl">☕</span>
            <span className="font-display text-2xl font-black text-brand-600">ReadySip</span>
          </Link>
          <h1 className="text-3xl font-display font-black text-stone-900 mb-3 tracking-tight">
            Verify Email
          </h1>
          <p className="text-stone-500 font-medium">
            We sent a code to <br/>
            <span className="text-brand-600 font-black">{email}</span>
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-md p-8 rounded-[2rem] border border-white shadow-2xl shadow-stone-200/50">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex gap-2 sm:gap-3 justify-center">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => { refs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-11 h-14 text-center text-2xl font-black bg-stone-50 border border-stone-100 rounded-xl text-stone-900 focus:outline-none focus:ring-4 focus:ring-brand-50 transition-all focus:border-brand-500 shadow-sm"
                />
              ))}
            </div>
            
            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-600 shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? "Verifying..." : "Verify & Continue"}
              </button>

              <div className="text-center">
                {timer > 0 ? (
                  <p className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                    Resend code in <span className="text-brand-600">{timer}s</span>
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="text-brand-600 hover:text-brand-700 text-[10px] font-black uppercase tracking-widest transition-colors disabled:opacity-50"
                  >
                    {resending ? "Resending..." : "Didn't get the code? Resend OTP"}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        <p className="mt-8 text-center">
          <Link to="/signup" className="text-stone-400 text-xs font-bold uppercase tracking-widest hover:text-stone-600 transition-colors">
            ← Back to Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
