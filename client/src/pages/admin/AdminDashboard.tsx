import React, { useState, useEffect, useCallback } from "react";
import { useOrders } from "../../hooks/useOrders";
import { useAdminSocket } from "../../hooks/useSocket";
import type { Order } from "../../types";
import toast from "react-hot-toast";
import api from "../../api/axios";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#d97706", "#3E2723", "#a855f7", "#3b82f6", "#ef4444"];

const AdminDashboard: React.FC = () => {
  const { addOrder, syncOrder } = useOrders();
  const [animateNew, setAnimateNew] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeframe, setTimeframe] = useState("month");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      let url = `/admin/stats?timeframe=${timeframe}`;
      if (timeframe === "custom") {
        if (!customRange.start || !customRange.end) return;
        if (new Date(customRange.start) > new Date(customRange.end)) {
          toast.error("Start date cannot be after end date");
          return;
        }
        url = `/admin/stats?startDate=${customRange.start}&endDate=${customRange.end}`;
      }
      const res = await api.get(url);
      setStats(res.data);
    } catch {
      toast.error("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  }, [timeframe, customRange.start, customRange.end]);

  useEffect(() => {
    void fetchStats();
  }, [fetchStats]);

  useAdminSocket({
    onNewOrder: (order: Order) => {
      addOrder(order);
      setAnimateNew(true);
      fetchStats();
      setTimeout(() => setAnimateNew(false), 3000);
      toast.success(`New order from ${order.customerName}!`);
    },
    onOrderUpdated: (order: Order) => {
      syncOrder(order);
      fetchStats();
    },
  });

  const cardStats = [
    {
      label: "Revenue",
      value: `₹${(stats?.summary?.revenue || 0).toLocaleString("en-IN")}`,
      color: "text-brand-400",
      bg: "bg-brand-600/10",
      icon: "💰",
    },
    {
      label: "Completed",
      value: stats?.summary?.completedOrders || 0,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      icon: "🎯",
    },
    {
      label: "Total Orders",
      value: stats?.summary?.totalOrders || 0,
      color: "text-amber-400",
      bg: "bg-amber-500/10",
      icon: "📦",
    },
    {
      label: "Customers",
      value: stats?.totalCustomers || 0,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      icon: "👥",
    },
  ];

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="font-display text-3xl font-bold text-stone-100">
            Analytics Dashboard
          </h1>
          <p className="text-stone-400 mt-1">
            Deep dive into your business performance
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-stone-900/50 p-2 rounded-2xl border border-stone-800">
          <div className="flex gap-1">
            {["day", "week", "month", "year", "custom"].map((t) => (
              <button
                key={t}
                onClick={() => setTimeframe(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                  timeframe === t
                    ? "bg-brand-600 text-white"
                    : "text-stone-500 hover:text-stone-300"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {timeframe === "custom" && (
            <div className="flex items-center gap-2 px-2 animate-slide-in-right">
              <input
                type="date"
                value={customRange.start}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, start: e.target.value }))
                }
                className="bg-stone-800 border-none rounded-lg text-xs text-stone-200 focus:ring-brand-500"
              />
              <span className="text-stone-600">to</span>
              <input
                type="date"
                value={customRange.end}
                onChange={(e) =>
                  setCustomRange((prev) => ({ ...prev, end: e.target.value }))
                }
                className="bg-stone-800 border-none rounded-lg text-xs text-stone-200 focus:ring-brand-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cardStats.map((s) => (
          <div
            key={s.label}
            className={`card p-6 ${s.bg} border-stone-800 transition-all duration-500 ${animateNew && s.label === "Total Orders" ? "ring-2 ring-amber-500" : ""}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-stone-400 text-sm font-medium">
                {s.label}
              </span>
              <span className="text-2xl">{s.icon}</span>
            </div>
            <div className={`text-3xl font-bold ${s.color}`}>
              {loading ? "—" : s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Revenue Trend Graph */}
        <div className="card p-6 bg-stone-900/50">
          <h2 className="font-display text-lg font-semibold text-stone-100 mb-6">
            Revenue Trend
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.trends?.revenue || []}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d97706" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d97706" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#262626"
                  vertical={false}
                />
                <XAxis
                  dataKey="_id"
                  stroke="#525252"
                  fontSize={10}
                  tickFormatter={(val) => val.split("-").slice(1).join("/")}
                />
                <YAxis stroke="#525252" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                  itemStyle={{ color: "#d97706" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#d97706"
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Distribution */}
        <div className="card p-6 bg-stone-900/50">
          <h2 className="font-display text-lg font-semibold text-stone-100 mb-6">
            Order Status Distribution
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.statusStats || []}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#262626"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  stroke="#525252"
                  fontSize={10}
                  className="capitalize"
                />
                <YAxis stroke="#525252" fontSize={10} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                  cursor={{ fill: "#262626" }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {(stats?.statusStats || []).map(
                    (_: unknown, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ),
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue by Category (Pie Chart) */}
        <div className="card p-6 bg-stone-900/50 flex flex-col">
          <h2 className="font-display text-lg font-semibold text-stone-100 mb-6">
            Revenue by Category
          </h2>
          <div className="h-[300px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats?.categoryStats || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(stats?.categoryStats || []).map(
                    (_: unknown, index: number) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ),
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#171717",
                    border: "1px solid #262626",
                    borderRadius: "12px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Sellers */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-stone-100 mb-6">
            Top Performing Products
          </h2>
          <div className="space-y-4">
            {stats?.topProducts?.map(
              (
                p: {
                  _id: string;
                  title: string;
                  totalSold: number;
                  totalRevenue: number;
                },
                i: number,
              ) => (
                <div key={p._id} className="flex items-center gap-4 group">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs transition-all group-hover:scale-110 ${
                      i === 0
                        ? "bg-brand-500 text-brand-950 shadow-lg shadow-brand-500/20"
                        : "bg-stone-800 text-stone-400"
                    }`}
                  >
                    #{i + 1}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-stone-200">
                      {p.title}
                    </div>
                    <div className="text-[10px] text-stone-500 uppercase font-black tracking-widest">
                      {p.totalSold} Units
                    </div>
                  </div>
                  <div className="text-sm font-black text-brand-500">
                    ₹{p.totalRevenue}
                  </div>
                </div>
              ),
            )}
            {(!stats?.topProducts || stats.topProducts.length === 0) && (
              <p className="text-stone-500 text-center py-10">
                No data available for this range
              </p>
            )}
          </div>
        </div>

        {/* Quick Summary Table */}
        <div className="card p-6">
          <h2 className="font-display text-lg font-semibold text-stone-100 mb-6">
            Performance Matrix
          </h2>
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-stone-800">
              <span className="text-stone-400 text-sm">Conversion Rate</span>
              <span className="text-stone-100 font-bold">
                {stats && stats.summary?.totalOrders > 0
                  ? (
                      (stats.summary.completedOrders /
                        stats.summary.totalOrders) *
                      100
                    ).toFixed(1)
                  : 0}
                %
              </span>
            </div>
            <div className="flex justify-between items-center pb-4 border-b border-stone-800">
              <span className="text-stone-400 text-sm">Avg. Order Value</span>
              <span className="text-brand-400 font-bold">
                ₹
                {stats && stats.summary?.totalOrders > 0
                  ? (stats.summary.revenue / stats.summary.totalOrders).toFixed(
                      0,
                    )
                  : 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-stone-400 text-sm">Customer Retention</span>
              <span className="text-purple-400 font-bold">High 🔥</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
