import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { login } from "../../store/slices/authSlice";
import type { User } from "../../types";
import { APP_ROUTES } from "../../constants/routes";

const Orb: React.FC<{ style: React.CSSProperties }> = ({ style }) => (
  <div style={style} className="admin-orb" />
);

const AdminLoginPage: React.FC = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Mount animation
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  // Already logged-in admins bounce straight to dashboard
  useEffect(() => {
    if (user && isAdmin)
      navigate(APP_ROUTES.ADMIN.DASHBOARD, { replace: true });
  }, [user, isAdmin, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      const { token, user: u } = res.data as { token: string; user: User };
      if (u.role !== "admin") {
        toast.error("Access denied. This portal is for admins only.");
        return;
      }
      dispatch(login({ token, user: u }));
      toast.success(`Welcome back, ${u.name.split(" ")[0]} 👑`);
      navigate(APP_ROUTES.ADMIN.DASHBOARD);
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } }).response?.data
          ?.message ?? "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Inline styles scoped to this page */}
      <style>{`
        .admin-login-root {
          min-height: 100vh;
          background: #0a0908;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1.5rem;
          position: relative;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }

        /* Animated orbs */
        .admin-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.18;
          animation: orb-float 8s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes orb-float {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-30px) scale(1.08); }
        }

        /* Grid overlay */
        .admin-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(251,191,36,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(251,191,36,0.04) 1px, transparent 1px);
          background-size: 48px 48px;
          pointer-events: none;
        }

        /* Card */
        .admin-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 430px;
          background: rgba(28, 25, 23, 0.85);
          border: 1px solid rgba(251,191,36,0.15);
          border-radius: 24px;
          padding: 2.5rem;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(251,191,36,0.08),
            0 32px 64px rgba(0,0,0,0.6),
            0 0 80px rgba(251,191,36,0.06);
          opacity: 0;
          transform: translateY(24px) scale(0.98);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .admin-card.mounted {
          opacity: 1;
          transform: translateY(0) scale(1);
        }

        /* Badge */
        .admin-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(251,191,36,0.1);
          border: 1px solid rgba(251,191,36,0.25);
          border-radius: 9999px;
          padding: 0.35rem 1rem;
          font-size: 0.75rem;
          font-weight: 600;
          color: #fbbf24;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .badge-dot {
          width: 6px; height: 6px;
          background: #fbbf24;
          border-radius: 50%;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(0.7); }
        }

        /* Logo */
        .admin-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }
        .admin-logo-icon {
          width: 48px; height: 48px;
          background: linear-gradient(135deg, #92400e, #b45309);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          box-shadow: 0 8px 24px rgba(180,83,9,0.4);
        }
        .admin-logo-text {
          font-size: 1.5rem;
          font-weight: 800;
          color: #fafaf9;
          letter-spacing: -0.03em;
        }
        .admin-logo-sub {
          font-size: 0.7rem;
          font-weight: 600;
          color: #fbbf24;
          letter-spacing: 0.15em;
          text-transform: uppercase;
        }

        /* Heading */
        .admin-heading {
          font-size: 1.875rem;
          font-weight: 800;
          color: #fafaf9;
          letter-spacing: -0.03em;
          margin: 1.25rem 0 0.375rem;
        }
        .admin-subheading {
          font-size: 0.875rem;
          color: #78716c;
          margin-bottom: 2rem;
        }

        /* Divider */
        .admin-divider {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.75rem;
        }
        .admin-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.06);
        }
        .admin-divider-text {
          font-size: 0.7rem;
          color: #57534e;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        /* Labels */
        .admin-label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: #a8a29e;
          margin-bottom: 0.4rem;
          letter-spacing: 0.02em;
        }

        /* Inputs */
        .admin-input-wrap {
          position: relative;
          margin-bottom: 1.1rem;
        }
        .admin-input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 1rem;
          pointer-events: none;
          opacity: 0.5;
        }
        .admin-input {
          width: 100%;
          background: rgba(12,10,9,0.6);
          border: 1px solid rgba(255,255,255,0.08);
          color: #fafaf9;
          border-radius: 14px;
          padding: 0.85rem 1rem 0.85rem 2.75rem;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
        }
        .admin-input::placeholder { color: #57534e; }
        .admin-input:focus {
          border-color: rgba(251,191,36,0.45);
          box-shadow: 0 0 0 3px rgba(251,191,36,0.1);
          background: rgba(20,16,14,0.8);
        }
        .admin-eye-btn {
          position: absolute;
          right: 0.9rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          opacity: 0.45;
          padding: 0.25rem;
          color: #fafaf9;
          transition: opacity 0.2s;
        }
        .admin-eye-btn:hover { opacity: 0.8; }

        /* Submit button */
        .admin-btn {
          width: 100%;
          background: linear-gradient(135deg, #b45309 0%, #d97706 100%);
          color: #fff;
          font-size: 0.9rem;
          font-weight: 700;
          border: none;
          border-radius: 14px;
          padding: 0.95rem 1rem;
          cursor: pointer;
          margin-top: 0.5rem;
          position: relative;
          overflow: hidden;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 8px 24px rgba(180,83,9,0.4);
          letter-spacing: 0.02em;
        }
        .admin-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 12px 32px rgba(180,83,9,0.5);
        }
        .admin-btn:active:not(:disabled) {
          transform: translateY(0);
        }
        .admin-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .admin-btn-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            105deg,
            transparent 40%,
            rgba(255,255,255,0.18) 50%,
            transparent 60%
          );
          background-size: 200% 100%;
          animation: shimmer 2.5s infinite;
        }
        @keyframes shimmer {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }

        /* Spinner */
        .admin-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          vertical-align: middle;
          margin-right: 0.5rem;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Footer link */
        .admin-footer {
          text-align: center;
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: #57534e;
        }
        .admin-footer a {
          color: #a8a29e;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        .admin-footer a:hover { color: #fbbf24; }

        /* Security note */
        .admin-security {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(251,191,36,0.05);
          border: 1px solid rgba(251,191,36,0.12);
          border-radius: 10px;
          padding: 0.65rem 0.9rem;
          margin-top: 1.25rem;
          font-size: 0.75rem;
          color: #78716c;
        }
        .admin-security-icon { font-size: 0.85rem; opacity: 0.7; }
      `}</style>

      <div className="admin-login-root">
        {/* Animated background orbs */}
        <Orb
          style={{
            width: 480,
            height: 480,
            background: "#92400e",
            top: "-120px",
            left: "-140px",
            animationDuration: "9s",
          }}
        />
        <Orb
          style={{
            width: 360,
            height: 360,
            background: "#7c3aed",
            bottom: "-80px",
            right: "-100px",
            animationDuration: "11s",
            animationDelay: "-4s",
          }}
        />
        <Orb
          style={{
            width: 240,
            height: 240,
            background: "#b45309",
            top: "55%",
            left: "60%",
            animationDuration: "7s",
            animationDelay: "-2s",
          }}
        />

        {/* Grid overlay */}
        <div className="admin-grid" />

        {/* Card */}
        <div className={`admin-card${mounted ? " mounted" : ""}`}>
          {/* Admin badge */}
          <div style={{ textAlign: "center" }}>
            <span className="admin-badge">
              <span className="badge-dot" />
              Secure Admin Access
            </span>
          </div>

          {/* Logo */}
          <div className="admin-logo" style={{ justifyContent: "center" }}>
            <div className="admin-logo-icon">☕</div>
            <div>
              <div className="admin-logo-text">ReadySip</div>
              <div className="admin-logo-sub">Admin Portal</div>
            </div>
          </div>

          <h1 className="admin-heading" style={{ textAlign: "center" }}>
            Welcome back
          </h1>
          <p className="admin-subheading" style={{ textAlign: "center" }}>
            Sign in to manage your café dashboard
          </p>

          {/* Divider */}
          <div className="admin-divider">
            <div className="admin-divider-line" />
            <span className="admin-divider-text">Admin credentials</span>
            <div className="admin-divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <label className="admin-label" htmlFor="admin-email">
              Email address
            </label>
            <div className="admin-input-wrap">
              <span className="admin-input-icon">✉️</span>
              <input
                id="admin-email"
                name="email"
                type="email"
                autoComplete="username"
                value={form.email}
                onChange={handleChange}
                className="admin-input"
                placeholder="admin@readysip.com"
                required
              />
            </div>

            {/* Password */}
            <label className="admin-label" htmlFor="admin-password">
              Password
            </label>
            <div className="admin-input-wrap">
              <span className="admin-input-icon">🔒</span>
              <input
                id="admin-password"
                name="password"
                type={showPass ? "text" : "password"}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className="admin-input"
                style={{ paddingRight: "2.75rem" }}
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="admin-eye-btn"
                onClick={() => setShowPass((v) => !v)}
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Submit */}
            <button
              id="admin-login-btn"
              type="submit"
              disabled={loading}
              className="admin-btn"
            >
              {!loading && <span className="admin-btn-shimmer" />}
              {loading ? (
                <>
                  <span className="admin-spinner" />
                  Authenticating…
                </>
              ) : (
                "🔐  Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Security note */}
          <div className="admin-security">
            <span className="admin-security-icon">🛡️</span>
            <span>Authorised personnel only. All access is logged.</span>
          </div>

          {/* Footer */}
          <div className="admin-footer">
            Not an admin?&ensp;
            <a href={APP_ROUTES.LOGIN}>Customer login →</a>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
