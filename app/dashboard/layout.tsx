"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Package, ArrowLeft, ShoppingCart, Plus, ChevronRight } from "lucide-react";
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
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <Loader2 className="animate-spin text-[#8484F6]" size={32} />
      </div>
    );
  }

  // If user is on the create-shop page, render content without the full dashboard frame
  if (pathname === CREATE_SHOP_PATH) {
    return (
      <div className="min-h-screen bg-[#F9FAFB]">
        {children}
      </div>
    );
  }

  // Gate: if no shop exists, show a friendly wall
  if (!hasShop) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#F9FAFB] px-6 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-white shadow-xl shadow-[#8484F6]/10 text-[#8484F6] border border-[#8484F6]/5">
          <Store size={40} strokeWidth={1.5} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 font-logo tracking-tight">You don&apos;t have a shop yet</h1>
          <p className="max-w-sm text-lg text-gray-500 font-medium leading-relaxed">
            Ready to start your campus venture? Create your shop to start listing items.
          </p>
        </div>
        <Link
          href={CREATE_SHOP_PATH}
          className="flex items-center gap-3 rounded-[1.5rem] bg-[#8484F6] px-10 py-5 text-lg font-bold text-white hover:opacity-90 transition-all shadow-xl shadow-[#8484F6]/20 group"
        >
          <Plus size={20} />
          Create your shop
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
        <Link href="/" className="text-base font-bold text-gray-400 hover:text-[#8484F6] transition-colors flex items-center gap-2">
          <ArrowLeft size={18} />
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-gray-900 font-sans">
      {/* MODERN LIGHT SIDEBAR */}
      <aside className="hidden h-screen w-72 shrink-0 flex-col bg-white border-r border-gray-100 lg:sticky lg:top-0 lg:flex">
        <div className="px-8 pb-8 pt-12">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#8484F6]/5 border border-[#8484F6]/10">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#8484F6]">
              Seller Studio
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-2 px-4 mt-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 rounded-[1.25rem] px-5 py-4 text-base font-bold transition-all duration-200 ${
                  isActive
                    ? "bg-[#8484F6] text-white shadow-lg shadow-[#8484F6]/25"
                    : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon size={22} strokeWidth={ isActive ? 2.5 : 2 } />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-gray-50">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-[1.25rem] px-5 py-4 text-base font-bold text-gray-400 transition-all hover:bg-red-50 hover:text-red-500 group"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header (Updated) */}
        <header className="flex h-18 items-center justify-between border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 lg:hidden sticky top-0 z-40">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#8484F6]">Seller Studio</span>
          <div className="flex items-center gap-4">
            <button 
              className="p-2 rounded-xl bg-gray-50 text-gray-900 md:hidden"
              onClick={() => {/* Toggle Mobile Nav Logic */}}
            >
              <Menu size={24} />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 md:p-12 lg:p-16">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
