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
    if (!form.email) newErrors.email = "Email required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid format";
    
    if (!form.password) newErrors.password = "Password required";
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
    <div className="min-h-screen flex items-stretch overflow-hidden">
      {/* Left Side: Brand Visual */}
      <div className="hidden lg:flex lg:w-5/12 relative overflow-hidden bg-brand-500">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#f5efe6_0%,_#FDF5E6_100%)]" />
        <div className="absolute inset-0 opacity-20">
          <img 
            src="/ReadySip_logo.png" 
            alt="ReadySip Logo" 
            className="w-full h-full object-contain p-12"
          />
        </div>
        <div className="relative z-10 w-full flex flex-col justify-between p-12">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="text-3xl">☕</span>
            <span className="text-2xl font-display font-black tracking-tight text-brand-700">ReadySip</span>
          </Link>
          <div className="space-y-4">
            <h2 className="text-4xl font-display font-black leading-tight text-warm-500">
              Skip the wait, <br/>
              <span className="text-brand-600">Just Sip.</span>
            </h2>
            <p className="text-warm-400 text-base font-medium max-w-xs leading-relaxed">
              Bangalore's premium quick-pick café experience. Order ahead, sips ready when you arrive.
            </p>
          </div>
          <p className="text-brand-500/40 font-black uppercase tracking-[0.2em] text-[10px]">
            © {new Date().getFullYear()} ReadySip Bangalore
          </p>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top,_#f5efe6_0%,_#FDF5E6_100%)] lg:bg-none lg:bg-white relative">
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="flex items-center gap-1.5">
            <span className="text-xl">☕</span>
            <span className="text-lg font-display font-black text-brand-600">ReadySip</span>
          </Link>
        </div>

        <div className="w-full max-w-[340px] animate-fade-in">
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-2xl font-display font-black text-stone-900 mb-2 tracking-tight uppercase">
              Welcome back
            </h1>
            <p className="text-stone-400 text-sm font-medium">Log in to your sips account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-0.5">
                Email Address
              </label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full bg-stone-50/50 border ${errors.email ? 'border-red-300 ring-2 ring-red-50' : 'border-stone-100 focus:border-brand-500'} rounded-xl px-4 py-3 text-stone-900 text-sm font-medium transition-all outline-none shadow-sm`}
                placeholder="name@example.com"
              />
              {errors.email && (
                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-0.5 animate-fade-in">
                  ⚠ {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 block ml-0.5">
                Password
              </label>
              <div className="relative group">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full bg-stone-50/50 border ${errors.password ? 'border-red-300 ring-2 ring-red-50' : 'border-stone-100 focus:border-brand-500'} rounded-xl px-4 py-3 text-stone-900 text-sm font-medium transition-all outline-none shadow-sm pr-12`}
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
                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest ml-0.5 animate-fade-in">
                  ⚠ {errors.password}
                </p>
              )}
            </div>

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-brand-500 text-white py-3.5 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-brand-600 hover:shadow-lg transition-all duration-300 shadow-brand-100"
            >
              {loading ? "Authenticating…" : "Sign In to Sips"}
            </button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-100"></div>
              </div>
              <div className="relative flex justify-center text-[9px] uppercase tracking-widest font-bold text-stone-300">
                <span className="bg-white lg:bg-white px-3 bg-opacity-100">Or use google</span>
              </div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Failed")}
                useOneTap
                theme="outline"
                shape="pill"
                width="340px"
              />
            </div>
          </form>

          <p className="mt-8 text-center text-stone-400 font-medium text-xs">
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
