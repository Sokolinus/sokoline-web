"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { fetchOrders } from "@/lib/api";
import { useShop } from "@/components/providers/ShopProvider";
import { Order } from "@/lib/types";

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
          const orderData = await fetchOrders(token);
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

  if (!authLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-gray-300" size={28} />
      </div>
    );
  }

  const totalRevenue = orders.reduce(
    (acc, order) => acc + (order.payment_status === "SUCCESS" ? Number(order.total_price) : 0),
    0
  );
  const activeOrdersCount = orders.filter((o) => o.status === "PENDING").length;

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
    <div className="space-y-8">
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
            className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
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
            className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
          >
            <div className={`inline-flex rounded-xl p-2.5 ${stat.bg} ${stat.color} mb-4`}>
              <stat.icon size={18} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">{stat.name}</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Recent orders</h2>
          {orders.length > 0 && (
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-800 transition-colors"
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
                  const status = statusConfig[order.status] || { label: order.status, classes: "bg-gray-100 text-gray-600 border-gray-200" };
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
                        KES {order.total_price}
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
