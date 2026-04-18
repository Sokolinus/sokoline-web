"use client";

import React from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";
import { useCart } from "@/components/providers/CartProvider";
import { ShoppingBag, Search, Menu } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { cart } = useCart();
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="w-full border-b border-zinc-200/70 bg-white/90 font-sans sticky top-0 z-50 transition-colors duration-300 backdrop-blur-md dark:bg-[#0A0A0A]/90 dark:border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 md:h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB]">
          SOKOLINE
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/products" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-[#7C3AED] transition-colors">
            Shop
          </Link>
          <Link href="/shops" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-[#7C3AED] transition-colors">
            Shops
          </Link>
          
          <Show when="signed-in">
            <Link href="/orders" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-[#7C3AED] transition-colors">
              Orders
            </Link>
            <Link href="/dashboard" className="text-xs font-bold uppercase tracking-widest text-[#7C3AED] dark:text-[#A855F7] hover:text-[#6D28D9] dark:hover:text-[#9333EA] transition-colors">
              Dashboard
            </Link>
          </Show>
          
          <Show when="signed-out">
            <SignInButton mode="modal">
              <button className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-[#7C3AED] transition-colors">
                Sign in
              </button>
            </SignInButton>
          </Show>
        </div>

        {/* ICONS & ACTIONS */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Search Icon */}
          <button className="p-2 text-zinc-400 hover:text-[#7C3AED] transition-colors">
            <Search size={20} />
          </button>

          {/* Cart with Notification */}
          <Link href="/cart" className="relative p-2 text-zinc-400 hover:text-[#7C3AED] transition-colors">
            <ShoppingBag size={22} />
            {cartItemCount > 0 && (
              <span className="absolute top-0 right-0 h-5 w-5 bg-[#7C3AED] dark:bg-[#A855F7] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0A0A0A]">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* PROFILE / AUTH */}
          <Show when="signed-in">
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-9 h-9 rounded-2xl border border-gray-200 dark:border-zinc-700 overflow-hidden"
                }
              }}
            />
          </Show>
          
          <Show when="signed-out">
            <div className="hidden md:block">
              <SignUpButton mode="modal">
                <button className="rounded-full bg-[#7C3AED] dark:bg-[#A855F7] px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#6D28D9] dark:hover:bg-[#9333EA] transition-all active:scale-95 shadow-lg shadow-purple-100/60 dark:shadow-none">
                  Sign up
                </button>
              </SignUpButton>
            </div>
            {/* Mobile Menu Icon */}
            <button
              className="md:hidden p-2 text-zinc-500 hover:text-[#7C3AED] transition-colors"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileOpen}
            >
              <Menu size={24} />
            </button>
          </Show>
        </div>
      </div>
      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200/70 dark:border-zinc-800" role="navigation" aria-label="Mobile navigation">
          <div className="px-4 py-4 flex flex-col gap-3 text-xs font-bold uppercase tracking-widest">
            <Link href="/products" className="text-zinc-600 hover:text-[#7C3AED] transition-colors" onClick={() => setMobileOpen(false)}>
              Shop
            </Link>
            <Link href="/shops" className="text-zinc-600 hover:text-[#7C3AED] transition-colors" onClick={() => setMobileOpen(false)}>
              Shops
            </Link>
            <Show when="signed-in">
              <Link href="/orders" className="text-zinc-600 hover:text-[#7C3AED] transition-colors" onClick={() => setMobileOpen(false)}>
                Orders
              </Link>
              <Link href="/dashboard" className="text-[#7C3AED] dark:text-[#A855F7]" onClick={() => setMobileOpen(false)}>
                Dashboard
              </Link>
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button className="w-fit text-zinc-600 hover:text-[#7C3AED] transition-colors">
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-fit rounded-full bg-[#7C3AED] dark:bg-[#A855F7] px-5 py-2 text-white hover:bg-[#6D28D9] dark:hover:bg-[#9333EA] transition-colors">
                  Sign up
                </button>
              </SignUpButton>
            </Show>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
