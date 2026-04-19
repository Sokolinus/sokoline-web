"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Package, ArrowLeft, ShoppingCart, Plus } from "lucide-react";
import { useShop } from "@/components/providers/ShopProvider";
import { Loader2 } from "lucide-react";

const CREATE_SHOP_PATH = "/dashboard/my-shop/new";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hasShop, loading } = useShop();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Shop", href: "/dashboard/my-shop", icon: Store },
    { name: "Inventory", href: "/dashboard/products", icon: Package },
    { name: "Orders", href: "/dashboard/orders", icon: ShoppingCart },
  ];

  // Show spinner while we determine shop status
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  // If user is on the create-shop page, render content without the full dashboard frame
  if (pathname === CREATE_SHOP_PATH) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  // Gate: if no shop exists, show a friendly wall
  if (!hasShop) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-50 px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
          <Store size={32} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">You don&apos;t have a shop yet</h1>
          <p className="mt-2 max-w-sm text-sm text-gray-500">
            Create your shop to access the seller dashboard, list products, and receive M-Pesa payments.
          </p>
        </div>
        <Link
          href={CREATE_SHOP_PATH}
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          <Plus size={16} />
          Create your shop
        </Link>
        <Link href="/" className="text-sm text-gray-400 hover:text-gray-700 transition-colors">
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="hidden h-screen w-60 shrink-0 flex-col bg-gray-950 lg:sticky lg:top-0 lg:flex">
        <div className="px-6 pb-6 pt-8">
          <Link href="/" className="text-xl font-black tracking-tight text-white">
            sokoline
          </Link>
          <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.18em] text-violet-400">
            Seller Dashboard
          </p>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 mt-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={16} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-white/10 hover:text-white"
          >
            <ArrowLeft size={16} />
            Back to store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 lg:hidden">
          <span className="text-base font-black tracking-tight">sokoline</span>
          <Link href="/dashboard" className="text-gray-400 hover:text-gray-900">
            <LayoutDashboard size={20} />
          </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
