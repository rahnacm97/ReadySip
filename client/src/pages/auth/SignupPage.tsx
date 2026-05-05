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
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
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

  const dispatch = useAppDispatch();

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
      toast.success(`Welcome back, ${user.name.split(" ")[0]}! ☕`);
      navigate(APP_ROUTES.MENU);
    } catch {
      toast.error("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-theme flex items-center justify-center px-4 py-12">
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
            Create account
          </h1>
          <p className="text-stone-400 mt-2">
            Join ReadySip and skip the queue
          </p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {(
              ["name", "email", "phone", "password", "confirmPassword"] as const
            ).map((field) => (
              <div key={field}>
                <label className="block text-stone-400 text-sm mb-1 capitalize">
                  {field === "confirmPassword"
                    ? "Confirm Password"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  id={`signup-${field}`}
                  name={field}
                  type={
                    field.includes("password") || field === "confirmPassword"
                      ? "password"
                      : field === "email"
                        ? "email"
                        : "text"
                  }
                  value={form[field]}
                  onChange={handleChange}
                  className="input-field"
                  placeholder={
                    field === "phone"
                      ? "+91 XXXXXXXXXX"
                      : field === "password" || field === "confirmPassword"
                        ? "••••••••"
                        : ""
                  }
                  required
                />
              </div>
            ))}
            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2"
            >
              {loading ? "Creating account…" : "Create Account & Get OTP"}
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
            Already have an account?{" "}
            <Link
              to={APP_ROUTES.LOGIN}
              className="text-brand-400 hover:text-brand-300 font-medium"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
