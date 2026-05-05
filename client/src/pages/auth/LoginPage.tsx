import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAppDispatch } from "../../store/hooks";
import { login } from "../../store/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { APP_ROUTES } from "../../constants/routes";

const LoginPage: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!form.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";
    
    if (!form.password) newErrors.password = "Password is required";
    else if (form.password.length < 6) newErrors.password = "Min 6 characters";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { token, user } = await authService.login(
        form.email,
        form.password,
      );
      dispatch(login({ token, user }));
      toast.success(`Welcome back, ${user.name.split(" ")[0]}! ☕`);
      navigate(
        user.role === "admin" ? APP_ROUTES.ADMIN.DASHBOARD : APP_ROUTES.MENU,
      );
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Login failed";
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
      dispatch(login({ token, user }));
      toast.success(`Welcome back, ${user.name.split(" ")[0]}! ☕`);
      navigate(APP_ROUTES.MENU);
    } catch {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-50 flex">
      {/* Left Side: Image Content */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-brand-500">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="/ReadySip_logo.png" 
            alt="ReadySip Logo Background" 
            className="w-full h-full object-cover grayscale scale-110"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent" />
        <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-4xl">☕</span>
            <span className="text-3xl font-display font-black tracking-tight">ReadySip</span>
          </Link>
          <div>
            <h2 className="text-6xl font-display font-black leading-tight mb-6">
              Skip the wait, <br/>
              <span className="text-brand-200">Just Sip.</span>
            </h2>
            <p className="text-brand-100 text-xl font-medium max-w-md">
              Bangalore's premium quick-pick café experience. Order ahead, sips ready when you arrive.
            </p>
          </div>
          <p className="text-brand-300/60 font-black uppercase tracking-[0.2em] text-xs">
            © {new Date().getFullYear()} ReadySip Bangalore
          </p>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16 bg-[#FDFCFB] relative">
        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <span className="text-xl font-display font-black text-brand-600">ReadySip</span>
          </Link>
        </div>

        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-display font-black text-stone-900 mb-3 tracking-tight">
              Welcome back
            </h1>
            <p className="text-stone-500 font-medium">Log in to your sips account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-stone-400 block ml-1">
                Email Address
              </label>
              <div className="relative group">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full bg-stone-50 border ${errors.email ? 'border-red-400 ring-4 ring-red-50' : 'border-stone-100 group-hover:border-brand-200 focus:border-brand-500'} rounded-2xl px-6 py-4 text-stone-900 font-medium transition-all outline-none shadow-sm`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 animate-fade-in">
                  ⚠ {errors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-stone-400 block ml-1">
                Password
              </label>
              <div className="relative group">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full bg-stone-50 border ${errors.password ? 'border-red-400 ring-4 ring-red-50' : 'border-stone-100 group-hover:border-brand-200 focus:border-brand-500'} rounded-2xl px-6 py-4 text-stone-900 font-medium transition-all outline-none shadow-sm pr-14`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-300 hover:text-brand-500 transition-colors p-1"
                >
                  {showPassword ? (
                    <span className="text-xl">🙈</span>
                  ) : (
                    <span className="text-xl">👁️</span>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1 animate-fade-in">
                  ⚠ {errors.password}
                </p>
              )}
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-stone-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-100 transition-all duration-300 shadow-lg"
            >
              {loading ? "Brewing Access…" : "Sign In to Sips"}
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-100"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#FDFCFB] px-4 text-stone-300 font-bold tracking-widest">
                  Or use google
                </span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Failed")}
                useOneTap
                theme="outline"
                shape="pill"
                width="100%"
              />
            </div>
          </form>

          <p className="mt-10 text-center text-stone-400 font-medium">
            New to ReadySip?{" "}
            <Link
              to={APP_ROUTES.SIGNUP}
              className="text-brand-600 hover:text-brand-700 font-black decoration-brand-600/30 decoration-2 underline-offset-4 hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
