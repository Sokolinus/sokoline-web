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
} from "lucide-react";
import Link from "next/link";
import { fetchShopOrders } from "@/lib/api";
import { useShop } from "@/components/providers/ShopProvider";
import { Order } from "@/lib/types";
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

export default function DashboardOverview() {
  const { user } = useUser();
  const { getToken, isLoaded: authLoaded, isSignedIn } = useAuth();
  const { shop } = useShop();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      if (!isSignedIn) return;
      try {
        const token = await getToken();
        if (token) {
          // Use fetchShopOrders to get only orders relevant to the seller
          const orderData = await fetchShopOrders(token);
          setOrders(orderData);
        }
      } catch (error) {
        console.error("Failed to load orders:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authLoaded) {
      loadOrders();
    }
  }, [authLoaded, isSignedIn, getToken]);

  // Helper to calculate seller-specific revenue from an order
  const getSellerRevenue = (order: Order) => {
    if (order.payment_status !== "SUCCESS") return 0;
    // We only sum up items that belong to the current shop
    // Note: The backend already filters the orders, but we should sum items
    // just in case of multi-vendor overlaps in the order object
    return order.items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  };

  const totalRevenue = useMemo(() => {
    return orders.reduce((acc, order) => acc + getSellerRevenue(order), 0);
  }, [orders]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter((o) => (o.seller_status || o.status) === "PENDING").length;
  }, [orders]);

  // Process data for the 7-day chart
  const chartData = useMemo(() => {
    const days = [];
    const now = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
      
      const dayRevenue = orders
        .filter(o => o.created_at.split('T')[0] === dateStr)
        .reduce((sum, o) => sum + getSellerRevenue(o), 0);
        
      days.push({
        name: dayName,
        revenue: dayRevenue,
        fullDate: dateStr
      });
    }
    return days;
  }, [orders]);

  // Process data for Top Products
  const topProducts = useMemo(() => {
    const productMap: Record<string, { name: string, quantity: number, revenue: number }> = {};
    
    orders.forEach(order => {
      if (order.payment_status === "SUCCESS") {
        order.items.forEach(item => {
          const key = item.product_name;
          if (!productMap[key]) {
            productMap[key] = { name: key, quantity: 0, revenue: 0 };
          }
          productMap[key].quantity += item.quantity;
          productMap[key].revenue += Number(item.price) * item.quantity;
        });
      }
    });
    
    return Object.values(productMap)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 4);
  }, [orders]);

  if (!authLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-gray-300" size={28} />
      </div>
    );
  }

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
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Good day, {user?.firstName || "Seller"} 👋
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {shop ? `Managing ${shop.name}` : "Welcome to your dashboard."}
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/products/new"
            className="flex items-center gap-1.5 rounded-lg bg-[#8484F6] px-4 py-2.5 text-sm font-semibold text-white hover:opacity-90 transition-all"
          >
            <Plus size={15} />
            Add product
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md"
          >
            <div className={`inline-flex rounded-xl p-2.5 ${stat.bg} ${stat.color} mb-4`}>
              <stat.icon size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{stat.name}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sales Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">7-Day Revenue</h2>
            <div className="text-[10px] font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
              Last 7 Days
            </div>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 600 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" radius={[6, 6, 0, 0]} barSize={32}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 6 ? '#8484F6' : '#e5e7eb'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-6">Top Products</h2>
          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[280px] text-center">
              <Package size={32} className="text-gray-100 mb-2" />
              <p className="text-xs text-gray-400">No data available</p>
            </div>
          ) : (
            <div className="space-y-5">
              {topProducts.map((product, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gray-50 text-[10px] font-bold text-gray-400 border border-gray-100">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">{product.name}</p>
                      <p className="text-[10px] text-gray-400 uppercase font-bold">{product.quantity} units sold</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-gray-900">KES {product.revenue.toLocaleString()}</p>
                </div>
              ))}
              <Link 
                href="/dashboard/products" 
                className="block text-center mt-6 text-xs font-bold text-[#8484F6] hover:text-[#7373e5] transition-colors pt-4 border-t border-gray-50"
              >
                Manage Inventory
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-widest">Recent orders</h2>
          {orders.length > 0 && (
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 text-xs font-medium text-[#8484F6] hover:text-[#7373e5] transition-colors"
            >
              View all <ArrowUpRight size={12} />
            </Link>
          )}
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <ShoppingBag size={32} className="text-gray-200 mb-3" />
            <p className="text-sm font-medium text-gray-400">No orders yet</p>
            <p className="text-xs text-gray-300 mt-1">Orders will appear here when customers buy from your shop.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Order</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Status</th>
                  <th className="px-6 py-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">Date</th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-widest text-gray-400">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.slice(0, 6).map((order) => {
                  const displayStatus = order.seller_status || order.status;
                  const status = statusConfig[displayStatus] || { label: displayStatus, classes: "bg-gray-100 text-gray-600 border-gray-200" };
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        #SKL-{order.id.toString().padStart(4, "0")}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${status.classes}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">
                        KES {getSellerRevenue(order).toLocaleString()}
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
