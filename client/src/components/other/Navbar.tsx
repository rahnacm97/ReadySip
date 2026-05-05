import React from "react";
import { Link } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";

const Navbar: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDF5E6]/90 backdrop-blur-md border-b border-stone-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Logo */}
        <div className="flex-1 flex items-center justify-start">
          <Link to="/" className="flex items-center group">
            <img
              src="/ReadySip_logo.png"
              alt="ReadySip Logo"
              className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Center: Navigation Links */}
        <div className="flex items-center justify-center gap-8">
          <Link
            to="/"
            className="text-warm-500 hover:text-brand-500 transition-colors text-sm font-semibold uppercase tracking-wider"
          >
            Home
          </Link>
          <Link
            to="/menu"
            className="text-warm-500 hover:text-brand-500 transition-colors text-sm font-semibold uppercase tracking-wider"
          >
            Our Menu
          </Link>
          {user && (
            <Link
              to="/my-orders"
              className="text-warm-500 hover:text-brand-500 transition-colors text-sm font-semibold uppercase tracking-wider"
            >
              My Orders
            </Link>
          )}
        </div>

        {/* Right: Auth / Actions */}
        <div className="flex-1 flex items-center justify-end gap-4">
          {user ? (
            <>
              <span className="text-warm-400 text-sm hidden lg:block font-medium">
                Hi, {user.name.split(" ")[0]}
              </span>
              <button
                onClick={handleLogout}
                className="btn-outline text-sm px-4 py-2"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-warm-500 hover:text-brand-500 transition-colors text-sm font-semibold uppercase tracking-wider hidden sm:block"
              >
                Login
              </Link>
              <Link to="/signup" className="btn-primary text-sm px-4 py-2">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
