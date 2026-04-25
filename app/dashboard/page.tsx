"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
  Plus,
  Loader2,
  ArrowUpRight,
  Package,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { fetchShopOrders } from "@/lib/api";
import { useShop } from "@/components/providers/ShopProvider";
import { Order } from "@/lib/types";
import { calculateSellerRevenue, get7DayChartData, getTopProducts } from "@/lib/analytics";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

type TimeRange = 'day' | 'month' | 'year' | 'custom';

export default function DashboardOverview() {
  const { user } = useUser();
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const { shop } = useShop();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>('month');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });

  const loadOrders = async (start?: string, end?: string) => {
    if (!isSignedIn) return;
    setLoading(true);
    try {
      const token = await getToken();
      if (token) {
        const orderData = await fetchShopOrders(token, start, end);
        setOrders(orderData);
      }
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoaded || !isSignedIn) return;

    const getDates = () => {
      const now = new Date();
      let start: Date | null = null;

      if (timeRange === 'day') {
        start = new Date(now.setHours(0, 0, 0, 0));
      } else if (timeRange === 'month') {
        start = new Date(now.getFullYear(), now.getMonth(), 1);
      } else if (timeRange === 'year') {
        start = new Date(now.getFullYear(), 0, 1);
      } else if (timeRange === 'custom') {
        return { 
          start: customDates.start ? new Date(customDates.start).toISOString() : undefined,
          end: customDates.end ? new Date(customDates.end).toISOString() : undefined
        };
      }

      return { 
        start: start?.toISOString(),
        end: undefined // Backend default to now
      };
    };

    const { start, end } = getDates();
    loadOrders(start, end);
  }, [authLoaded, isSignedIn, timeRange, customDates.start, customDates.end, getToken]);

  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, order) => acc + calculateSellerRevenue(order), 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => (o.seller_status || o.status) === "PENDING").length;
  }, [orders]);

  // Process data for the 7-day chart
  const chartData = useMemo(() => get7DayChartData(orders), [orders]);

  // Process data for Top Products
  const topProducts = useMemo(() => getTopProducts(orders), [orders]);

  const stats = [
    {
      name: "Revenue",
      value: `KES ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      name: "Pending orders",
      value: activeOrdersCount.toString(),
      icon: ShoppingBag,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      name: "Listed items",
      value: shop?.products?.length?.toString() || "0",
      icon: TrendingUp,
      color: "text-violet-500",
      bg: "bg-violet-50",
    },
    {
      name: "Visitors",
      value: "—",
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  ];

  const statusConfig: Record<string, { label: string; classes: string }> = {
    COMPLETED: { label: "Completed", classes: "bg-emerald-50 text-emerald-700 border-emerald-100" },
    PENDING: { label: "Pending", classes: "bg-amber-50 text-amber-700 border-amber-100" },
    CANCELLED: { label: "Cancelled", classes: "bg-red-50 text-red-700 border-red-100" },
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Quick Filters */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 tracking-tight font-logo">
              Dashboard
            </h1>
            <p className="mt-1 text-sm font-medium text-gray-400">
              Welcome back, {user?.firstName || "Seller"}. Here is what is happening with {shop?.name || "your shop"}.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/dashboard/products/new"
              className="flex items-center gap-2 rounded-xl bg-black px-5 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all shadow-lg shadow-black/5"
            >
              <Plus size={16} strokeWidth={3} />
              New Product
            </Link>
          </div>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-2 shadow-sm">
          <div className="flex items-center gap-1 p-1 bg-gray-50 rounded-xl w-full md:w-auto">
            {[
              { id: 'day', label: 'Today' },
              { id: 'month', label: 'Month' },
              { id: 'year', label: 'Year' },
              { id: 'custom', label: 'Custom' },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => setTimeRange(btn.id as TimeRange)}
                className={`flex-1 md:flex-none px-4 py-2 text-xs font-bold rounded-lg transition-all ${
                  timeRange === btn.id 
                    ? "bg-white text-black shadow-sm" 
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {timeRange === 'custom' && (
            <div className="flex items-center gap-3 px-2 w-full md:w-auto">
              <div className="flex items-center gap-2">
                <input 
                  type="date" 
                  value={customDates.start}
                  onChange={(e) => setCustomDates(prev => ({ ...prev, start: e.target.value }))}
                  className="text-xs font-bold border-none bg-transparent focus:ring-0 p-0"
                />
                <span className="text-gray-300">—</span>
                <input 
                  type="date" 
                  value={customDates.end}
                  onChange={(e) => setCustomDates(prev => ({ ...prev, end: e.target.value }))}
                  className="text-xs font-bold border-none bg-transparent focus:ring-0 p-0"
                />
              </div>
            </div>
          )}

          <div className="hidden md:flex items-center gap-2 px-4 text-gray-300">
            <Calendar size={14} />
            <span className="text-[10px] font-black uppercase tracking-widest">
              {timeRange === 'custom' ? 'Custom Range' : `Showing ${timeRange}ly data`}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="group rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-black/5"
          >
            <div className={`inline-flex rounded-2xl p-3 ${stat.bg} ${stat.color} mb-5`}>
              <stat.icon size={20} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400">{stat.name}</p>
            <p className="mt-1 text-2xl font-black text-gray-900 tracking-tight">
              {loading ? <span className="inline-block h-6 w-16 animate-pulse bg-gray-100 rounded" /> : stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="lg:col-span-2 rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Revenue Trends</h2>
              <p className="text-xs text-gray-400 font-medium mt-1">Daily performance overview</p>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-[#8484F6]" />
               <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Net Sales</span>
            </div>
          </div>
          <div className="h-[320px] w-full">
            {loading ? (
              <div className="flex items-center justify-center h-full bg-gray-50 rounded-2xl border border-dashed border-gray-100">
                <Loader2 className="animate-spin text-gray-200" size={24} />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700 }}
                    dy={12}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 700 }}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f9fafb' }}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', padding: '12px' }}
                    itemStyle={{ fontWeight: 'bold', fontSize: '14px' }}
                    labelStyle={{ fontWeight: '800', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px', color: '#9ca3af', letterSpacing: '0.1em' }}
                  />
                  <Bar dataKey="revenue" radius={[8, 8, 0, 0]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.revenue > 0 ? '#8484F6' : '#f3f4f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8">Bestsellers</h2>
          {loading ? (
            <div className="space-y-6">
              {[1,2,3,4].map(i => <div key={i} className="h-12 w-full animate-pulse bg-gray-50 rounded-xl" />)}
            </div>
          ) : topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[320px] text-center bg-gray-50 rounded-2xl border border-dashed border-gray-100">
              <Package size={32} className="text-gray-200 mb-3" />
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No data available</p>
            </div>
          ) : (
            <div className="space-y-6">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-xs font-black text-gray-400 border border-gray-100 group-hover:bg-black group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 truncate max-w-[130px]">{product.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">{product.quantity} sold</p>
                    </div>
                  </div>
                  <p className="text-sm font-black text-gray-900">KES {product.revenue.toLocaleString()}</p>
                </div>
              ))}
              <Link 
                href="/dashboard/products" 
                className="flex items-center justify-center gap-2 w-full mt-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest text-[#8484F6] border border-[#8484F6]/10 bg-[#8484F6]/5 hover:bg-[#8484F6] hover:text-white transition-all"
              >
                Inventory Details
                <ArrowUpRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders Table - Upgraded Style */}
      <div className="rounded-[2rem] border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
          <div>
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Order History</h2>
            <p className="text-xs text-gray-400 font-medium mt-1">Transaction details for this period</p>
          </div>
          {orders.length > 0 && (
            <Link
              href="/dashboard/orders"
              className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-50 hover:bg-black hover:text-white transition-all"
            >
              All Orders
            </Link>
          )}
        </div>

        {loading ? (
          <div className="p-12 space-y-4">
            {[1,2,3,4,5].map(i => <div key={i} className="h-10 w-full animate-pulse bg-gray-50 rounded-xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingBag size={40} className="text-gray-100 mb-4" />
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">No orders found</p>
            <p className="text-xs text-gray-300 mt-2">Adjust your filters or try a different date range.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50">
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Order Ref</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Placed On</th>
                  <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-gray-400">Net Sales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 10).map((order) => {
                  const displayStatus = order.seller_status || order.status;
                  const status = statusConfig[displayStatus] || { label: displayStatus, classes: "bg-gray-100 text-gray-600 border-gray-200" };
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/30 transition-colors group">
                      <td className="px-8 py-5 text-sm font-bold text-gray-900">
                        <span className="text-gray-300 mr-1">#</span>
                        SKL-{order.id.toString().padStart(4, "0")}
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-widest border ${status.classes}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-gray-400">
                        {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-8 py-5 text-right text-sm font-black text-gray-900">
                        KES {calculateSellerRevenue(order).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
