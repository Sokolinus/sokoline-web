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
    <div className="flex min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50">
      {/* Sidebar */}
      <aside className="hidden h-screen w-72 shrink-0 flex-col border-r border-zinc-200 bg-white/90 backdrop-blur lg:sticky lg:top-0 lg:flex dark:border-zinc-800 dark:bg-zinc-950/90">
        <div className="px-8 pb-6 pt-8">
          <Link href="/" className="text-2xl font-black tracking-tight">
            Sokoline
          </Link>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500 dark:text-zinc-400">
            Seller Dashboard
          </p>
        </div>

        <nav className="flex-1 space-y-1 px-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-200"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-900 dark:hover:text-zinc-50"
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-4">
          <Link 
            href="/" 
            className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-200"
          >
            <ArrowLeft size={16} />
            Exit Dashboard
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <header className="flex h-16 items-center justify-between border-b border-zinc-200 bg-white/90 px-5 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/90">
           <span className="text-base font-bold tracking-tight">Sokoline</span>
           <Link href="/dashboard/products" aria-label="Add product" className="rounded-lg bg-violet-600 p-2 text-white">
             <PlusCircle size={18} />
           </Link>
        </header>

        <main className="flex-1 overflow-y-auto p-5 md:p-8 lg:p-10">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
