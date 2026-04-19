"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";
import { useCart } from "@/components/providers/CartProvider";
import { useShop } from "@/components/providers/ShopProvider";
import { ShoppingBag, Menu, X, Store } from "lucide-react";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const { cart } = useCart();
  const { hasShop, loading: shopLoading } = useShop();
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

        {/* LEFT: Logo + Nav Links */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-lg font-black tracking-tight text-gray-950">
            sokoline
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/products"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Browse
            </Link>
            <Link
              href="/shops"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              Shops
            </Link>
          </div>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
          >
            <ShoppingBag size={20} />
            {cartItemCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-violet-600 text-[9px] font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>

          {/* Authenticated */}
          <Show when="signed-in">
            {!shopLoading && (
              hasShop ? (
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-1.5 h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-700 transition-colors"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard/my-shop/new"
                  className="hidden md:flex items-center gap-1.5 h-9 px-4 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
                >
                  <Store size={14} />
                  Open a Shop
                </Link>
              )
            )}
            <div className="flex items-center justify-center">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonTrigger: "focus:shadow-none focus:ring-0",
                  },
                }}
              />
            </div>
          </Show>

          {/* Guest */}
          <Show when="signed-out">
            <div className="hidden md:flex items-center gap-2">
              <SignInButton mode="modal">
                <button className="h-9 px-4 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="h-9 px-4 rounded-lg bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 transition-colors">
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>

          {/* Mobile toggle */}
          <button
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-50 transition-colors md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            <Link
              href="/products"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Browse
            </Link>
            <Link
              href="/shops"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Shops
            </Link>

            <Show when="signed-in">
              {hasShop ? (
                <Link
                  href="/dashboard"
                  className="rounded-lg px-3 py-2.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard/my-shop/new"
                  className="mt-1 flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-semibold text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  <Store size={14} />
                  Open a Shop
                </Link>
              )}
            </Show>

            <Show when="signed-out">
              <div className="mt-2 flex flex-col gap-2 border-t border-gray-100 pt-3">
                <SignInButton mode="modal">
                  <button className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full rounded-lg bg-gray-900 py-2.5 text-sm font-semibold text-white hover:bg-gray-800 transition-colors">
                    Sign up
                  </button>
                </SignUpButton>
              </div>
            </Show>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
