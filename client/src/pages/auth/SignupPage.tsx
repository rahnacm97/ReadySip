import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { GoogleLogin } from "@react-oauth/google";
import { login as loginAction } from "../../store/slices/authSlice";
import { useAppDispatch } from "../../store/hooks";
import { APP_ROUTES } from "../../constants/routes";

const SignupPage: React.FC = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    
    if (!form.phone) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone.replace(/[^0-9]/g, ''))) newErrors.phone = "Invalid phone number";

    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Min 6 characters";

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await authService.signup({
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      });
      toast.success("OTP sent to your email!");
      navigate(APP_ROUTES.VERIFY_OTP, { state: { email: form.email } });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Signup failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: {
    credential?: string;
  }) => {
    if (!credentialResponse.credential) return;
    setLoading(true);
    try {
      const { token, user } = await authService.googleLogin(
        credentialResponse.credential,
      );
      dispatch(loginAction({ token, user }));
      toast.success(`Welcome to ReadySip, ${user.name.split(" ")[0]}! ☕`);
      navigate(APP_ROUTES.MENU);
    } catch {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex flex-row-reverse">
      {/* Left Side: Image Content (Right in flex-row-reverse) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-500">
        <div className="absolute inset-0 opacity-60">
          <img 
            src="/1.jpg" 
            alt="Cafe Interior" 
            className="w-full h-full object-cover scale-105"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/60 via-transparent to-brand-900/90" />
        <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-4xl">☕</span>
            <span className="text-3xl font-display font-black tracking-tight">ReadySip</span>
          </Link>
          <div>
            <h2 className="text-6xl font-display font-black leading-tight mb-6">
              Join the <br/>
              <span className="text-brand-200">Sip Revolution.</span>
            </h2>
            <p className="text-brand-100 text-xl font-medium max-w-md">
              Create an account to manage your favorites, track your orders, and enjoy faster sips.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-brand-300" />
            <p className="text-brand-300 font-bold uppercase tracking-[0.2em] text-xs">
              Brewed in Bangalore
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: Form Content (Left in flex-row-reverse) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-[#FDFCFB] relative overflow-y-auto">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <span className="text-xl font-display font-black text-brand-600">ReadySip</span>
          </Link>
        </div>

        <div className="w-full max-w-md animate-fade-in py-12">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-display font-black text-stone-900 mb-3 tracking-tight">
              Create account
            </h1>
            <p className="text-stone-500 font-medium">Join ReadySip and skip the queue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-1">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                className={`w-full bg-stone-50 border ${errors.name ? 'border-red-400 ring-2 ring-red-50' : 'border-stone-100 focus:border-brand-500'} rounded-xl px-5 py-3 text-stone-900 font-medium transition-all outline-none`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 animate-fade-in">⚠ {errors.name}</p>}
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full bg-stone-50 border ${errors.email ? 'border-red-400 ring-2 ring-red-50' : 'border-stone-100 focus:border-brand-500'} rounded-xl px-5 py-3 text-stone-900 font-medium transition-all outline-none`}
                placeholder="name@example.com"
              />
              {errors.email && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 animate-fade-in">⚠ {errors.email}</p>}
            </div>

            {/* Phone Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-1">Phone Number</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className={`w-full bg-stone-50 border ${errors.phone ? 'border-red-400 ring-2 ring-red-50' : 'border-stone-100 focus:border-brand-500'} rounded-xl px-5 py-3 text-stone-900 font-medium transition-all outline-none`}
                placeholder="9999988888"
              />
              {errors.phone && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 animate-fade-in">⚠ {errors.phone}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-1">Password</label>
              <div className="relative group">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full bg-stone-50 border ${errors.password ? 'border-red-400 ring-2 ring-red-50' : 'border-stone-100 focus:border-brand-500'} rounded-xl px-5 py-3 text-stone-900 font-medium transition-all outline-none pr-12`}
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
              {errors.password && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 animate-fade-in">⚠ {errors.password}</p>}
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-1">Confirm Password</label>
              <div className="relative group">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full bg-stone-50 border ${errors.confirmPassword ? 'border-red-400 ring-2 ring-red-50' : 'border-stone-100 focus:border-brand-500'} rounded-xl px-5 py-3 text-stone-900 font-medium transition-all outline-none pr-12`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-300 hover:text-brand-500 transition-colors"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-1 animate-fade-in">⚠ {errors.confirmPassword}</p>}
            </div>

            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-600 shadow-xl shadow-brand-100 transition-all duration-300 mt-4"
            >
              {loading ? "Preparing Account…" : "Create Account & Get OTP"}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-stone-100"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase tracking-widest"><span className="bg-[#FDFCFB] px-4 text-stone-300 font-bold">Or continue with</span></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Signup Failed")}
                useOneTap
                theme="outline"
                shape="pill"
                width="100%"
              />
            </div>
          </form>

          <p className="mt-8 text-center text-stone-400 font-medium text-sm">
            Already have an account?{" "}
            <Link
              to={APP_ROUTES.LOGIN}
              className="text-brand-600 hover:text-brand-700 font-black decoration-brand-600/30 decoration-2 underline-offset-4 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
