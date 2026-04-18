"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, Package, ArrowLeft, PlusCircle } from "lucide-react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Shop", href: "/dashboard/my-shop", icon: Store },
    { name: "Inventory", href: "/dashboard/products", icon: Package },
  ];

  return (
    <div className="flex min-h-screen bg-[#FBFBFB] dark:bg-[#0A0A0A]">
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-[#0A0A0A] border-r border-zinc-100 dark:border-zinc-800 hidden lg:flex flex-col sticky top-0 h-screen transition-colors duration-300">
        <div className="p-10">
          <Link href="/" className="text-2xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] uppercase">
            Sokoline
          </Link>
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#7C3AED] mt-1">Vendor Portal</p>
        </div>

        <nav className="flex-1 px-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-[#7C3AED] text-white shadow-xl shadow-purple-100 dark:shadow-none translate-x-2"
                    : "text-zinc-400 hover:text-[#1A1A1A] dark:hover:text-[#FBFBFB] hover:bg-zinc-50 dark:hover:bg-zinc-900"
                }`}
              >
                <item.icon size={20} strokeWidth={isActive ? 3 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 mt-auto">
          <Link 
            href="/" 
            className="flex items-center gap-3 px-6 py-4 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-[#7C3AED] transition-colors"
          >
            <ArrowLeft size={16} />
            Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header (Simplified) */}
        <header className="lg:hidden h-16 bg-white dark:bg-[#0A0A0A] border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between px-6">
           <span className="font-black tracking-tighter uppercase text-[#1A1A1A] dark:text-[#FBFBFB]">Sokoline</span>
           <PlusCircle size={24} className="text-[#7C3AED]" />
        </header>

        <main className="flex-1 p-6 md:p-12 lg:p-20 overflow-y-auto">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
