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
        <Loader2 className="animate-spin text-sokoline-accent" size={32} />
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
        <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] border border-sokoline-accent/5 bg-white text-sokoline-accent shadow-xl shadow-sokoline-accent/10">
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
          className="group flex items-center gap-3 rounded-[1.5rem] bg-sokoline-accent px-10 py-5 text-lg font-bold text-white shadow-xl shadow-sokoline-accent/20 transition-all hover:opacity-90"
        >
          <Plus size={20} />
          Create your shop
          <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
        </Link>
        <Link href="/" className="flex items-center gap-2 text-base font-bold text-gray-400 transition-colors hover:text-sokoline-accent">
          <ArrowLeft size={18} />
          Back to store
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB] text-gray-900 font-sans">
      <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-gray-800 bg-gray-950 text-gray-100 lg:sticky lg:top-0 lg:flex">
        <div className="px-8 pb-8 pt-12">
          <div className="inline-flex items-center rounded-full border border-sokoline-accent/30 bg-sokoline-accent/15 px-4 py-1.5">
            <span className="text-[11px] font-black uppercase tracking-widest text-white">
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
                    ? "bg-sokoline-accent text-white shadow-lg shadow-sokoline-accent/25"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={22} strokeWidth={ isActive ? 2.5 : 2 } />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-gray-800 p-6">
          <Link
            href="/"
            className="group flex items-center gap-3 rounded-[1.25rem] px-5 py-4 text-base font-bold text-gray-300 transition-all hover:bg-red-500/10 hover:text-red-300"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/95 px-4 py-3 backdrop-blur-md lg:hidden">
          <span className="text-[11px] font-black uppercase tracking-widest text-sokoline-accent">Seller Studio</span>
          <nav
            aria-label="Dashboard navigation"
            className="mt-3 flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory scroll-smooth focus-within:rounded-xl focus-within:ring-2 focus-within:ring-sokoline-accent/30"
          >
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`inline-flex snap-start items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sokoline-accent focus-visible:ring-offset-2 ${
                    isActive
                      ? "border-sokoline-accent bg-sokoline-accent text-white"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900"
                  }`}
                >
                  <item.icon size={14} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </header>

        <main id="dashboard-main-content" tabIndex={-1} className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16">
          <div className="mx-auto max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
