import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { logout } from "../store/slices/authSlice";
import toast from "react-hot-toast";

const navItems = [
  { label: "Dashboard", to: "/admin", icon: "📊", end: true },
  { label: "Orders", to: "/admin/orders", icon: "📦", end: false },
  { label: "Products", to: "/admin/products", icon: "🧃", end: false },
];

const AdminLayout: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-stone-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-stone-900 border-r border-stone-800 flex flex-col">
        <div className="p-6 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="text-2xl">☕</span>
            <div>
              <div className="font-display text-lg font-bold text-brand-400">
                ReadySip
              </div>
              <div className="text-xs text-stone-500">Admin Panel</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              id={`nav-${item.label.toLowerCase()}`}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-brand-600/20 text-brand-400 border border-brand-600/30"
                    : "text-stone-400 hover:bg-stone-800 hover:text-stone-100"
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-sm font-bold">
              {user?.name[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-stone-200 text-sm font-medium truncate">
                {user?.name}
              </div>
              <div className="text-stone-500 text-xs">Admin</div>
            </div>
          </div>
          <button
            id="admin-logout-btn"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-stone-400 hover:bg-red-600/10 hover:text-red-400 transition-all text-sm font-medium"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
