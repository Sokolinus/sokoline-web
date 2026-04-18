"use client";

import React from "react";
import { useUser } from "@clerk/nextjs";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Users,
} from "lucide-react";
import Link from "next/link";

const stats = [
  { name: "Revenue (30d)", value: "$18,420", icon: DollarSign, change: "+8.7% vs last month", tone: "positive" },
  { name: "Orders awaiting shipment", value: "14", icon: ShoppingBag, change: "3 are overdue", tone: "warning" },
  { name: "Store visitors (7d)", value: "5,284", icon: Users, change: "+12.2% vs last week", tone: "positive" },
  { name: "Conversion rate", value: "3.6%", icon: TrendingUp, change: "+0.4 pts", tone: "positive" },
];

const salesBars = [
  { value: 64, label: "Mon" },
  { value: 42, label: "Tue" },
  { value: 58, label: "Wed" },
  { value: 74, label: "Thu" },
  { value: 68, label: "Fri" },
  { value: 82, label: "Sat" },
  { value: 61, label: "Sun" },
];

const recentOrders = [
  { id: "SKL-2198", customer: "Amelia Hart", items: 3, total: "$126.00", status: "Packed", receivedAt: "12m ago" },
  { id: "SKL-2194", customer: "Noah Bell", items: 1, total: "$42.00", status: "Awaiting pickup", receivedAt: "38m ago" },
  { id: "SKL-2189", customer: "Rina Alvarez", items: 2, total: "$84.00", status: "Payment confirmed", receivedAt: "1h ago" },
];

const priorities = [
  { label: "Ship overdue orders", note: "3 orders are past SLA", icon: AlertTriangle, level: "high" },
  { label: "Restock low inventory", note: "7 products below threshold", icon: Clock3, level: "medium" },
  { label: "Complete trust verification", note: "Estimated impact: +15% conversion", icon: CheckCircle2, level: "low" },
];

export default function DashboardOverview() {
  const { user } = useUser();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">Welcome back</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">Hi {user?.firstName || "Seller"}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-600 dark:text-zinc-300">
            Your store health is improving. Focus on shipping overdue orders and finishing verification to keep momentum.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/products"
            className="inline-flex items-center rounded-xl border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            Manage inventory
          </Link>
          <Link
            href="/dashboard/products"
            className="inline-flex items-center rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2"
          >
            Add product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article
            key={stat.name}
            className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-xl bg-zinc-100 p-2 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
                <stat.icon size={18} />
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  stat.tone === "warning"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                    : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                }`}
              >
                {stat.change}
              </span>
            </div>
            <p className="mt-4 text-sm font-medium text-zinc-500 dark:text-zinc-400">{stat.name}</p>
            <p className="mt-1 text-2xl font-bold tracking-tight">{stat.value}</p>
          </article>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[2fr_1fr]">
        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Sales trend (last 7 days)</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">Gross sales by day</p>
            </div>
            <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
              View orders <ChevronRight size={16} />
            </Link>
          </div>
          <div className="mt-5 grid h-44 grid-cols-7 items-end gap-2">
            {salesBars.map((day) => (
              <div key={day.label} className="space-y-2">
                <div
                  aria-label={`${day.label}: ${day.value}% of max sales`}
                  style={{ height: `${day.value}%` }}
                  className="w-full rounded-md bg-violet-500/85 transition hover:bg-violet-500"
                />
                <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">{day.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h2 className="text-lg font-semibold">Priority actions</h2>
          <ul className="mt-4 space-y-3">
            {priorities.map((task) => (
              <li key={task.label} className="rounded-xl border border-zinc-200 p-3 dark:border-zinc-800">
                <div className="flex items-start gap-3">
                  <div
                    className={`mt-0.5 rounded-lg p-1.5 ${
                      task.level === "high"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                        : task.level === "medium"
                          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                          : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
                    }`}
                  >
                    <task.icon size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{task.label}</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{task.note}</p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Track status and resolve bottlenecks fast</p>
          </div>
          <Link href="/dashboard/orders" className="inline-flex items-center gap-1 text-sm font-medium text-violet-600 hover:text-violet-700">
            Open order manager <ChevronRight size={16} />
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table role="table" aria-label="Recent orders" className="min-w-full divide-y divide-zinc-200 text-sm dark:divide-zinc-800">
            <thead className="text-left text-xs uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              <tr>
                <th className="py-3 pr-4 font-medium">Order</th>
                <th className="py-3 pr-4 font-medium">Customer</th>
                <th className="py-3 pr-4 font-medium">Items</th>
                <th className="py-3 pr-4 font-medium">Status</th>
                <th className="py-3 pr-4 font-medium">Total</th>
                <th className="py-3 font-medium">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td className="py-3 pr-4 font-semibold text-zinc-900 dark:text-zinc-100">#{order.id}</td>
                  <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">{order.customer}</td>
                  <td className="py-3 pr-4 text-zinc-700 dark:text-zinc-300">{order.items}</td>
                  <td className="py-3 pr-4">
                    <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 pr-4 font-semibold text-zinc-900 dark:text-zinc-100">{order.total}</td>
                  <td className="py-3 text-zinc-600 dark:text-zinc-400">{order.receivedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
