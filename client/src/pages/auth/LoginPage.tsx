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
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
            Welcome back
          </h1>
          <p className="text-stone-400 mt-2">Login to your account</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-stone-400 text-sm mb-1">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                className="input-field"
                placeholder="you@email.com"
                required
              />
            </div>
            <div>
              <label className="block text-stone-400 text-sm mb-1">
                Password
              </label>
              <input
                id="login-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                className="input-field"
                placeholder="••••••••"
                required
              />
            </div>
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? "Logging in…" : "Login"}
            </button>

            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 border-t border-stone-800"></div>
              <span className="text-xs uppercase tracking-widest text-stone-500 font-bold">
                Or continue with
              </span>
              <div className="flex-1 border-t border-stone-800"></div>
            </div>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error("Google Login Failed")}
                useOneTap
                theme="filled_black"
                shape="pill"
              />
            </div>
          </form>
          <p className="text-center text-stone-400 text-sm mt-6">
            Don't have an account?{" "}
            <Link
              to={APP_ROUTES.SIGNUP}
              className="text-brand-400 hover:text-brand-300 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
