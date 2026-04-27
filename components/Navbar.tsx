"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";
import { useCart } from "@/components/providers/CartProvider";
import { useShop } from "@/components/providers/ShopProvider";
import { Menu, X, Store, Sparkles, Search } from "lucide-react";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { cart } = useCart();
  const { hasShop, loading: shopLoading } = useShop();
  const cartItemCount = cart?.items.reduce((acc, item) => acc + item.quantity, 0) || 0;

  // Determine navbar styles based on page and scroll position
  const navClasses = isHome
    ? scrolled
      ? "sticky top-0 z-50 w-full bg-white/85 backdrop-blur-md border-b border-gray-100/90 transition-all duration-300"
      : "absolute top-0 z-50 w-full bg-transparent border-none transition-all duration-300"
    : "sticky top-0 z-50 w-full bg-white/95 backdrop-blur border-b border-gray-100";

  const linkClasses = isHome && !scrolled
    ? "text-base font-bold text-white hover:text-white/70 transition-colors"
    : "text-base font-bold text-black hover:text-[#8484F6] transition-colors";

  return (
    <nav className={navClasses}>
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-24">

        {/* LEFT: Logo + Nav Links */}
        <div className="flex items-center gap-4 md:gap-10">
          <Link href="/" className="relative h-10 w-36 transition-opacity hover:opacity-90 sm:h-11 sm:w-40 md:h-12 md:w-48">
            <Image
              src="/logo.svg"
              alt="Sokoline"
              fill
              className={`object-contain transition-all ${isHome && !scrolled ? 'brightness-0 invert' : ''}`}
              priority
              sizes="192px"
            />
          </Link>
          <div className="hidden lg:flex items-center gap-6 font-logo">
            <Link href="/" className={linkClasses}>
              Home
            </Link>
            <Link href="/shops" className={linkClasses}>
              Shops
            </Link>
            <Link href="/products" className={linkClasses}>
              Explore
            </Link>
          </div>
        </div>

        {/* MIDDLE: Search Bar (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
           <form onSubmit={handleSearch} className="w-full relative group">
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full h-11 pl-12 pr-4 rounded-2xl text-sm font-medium transition-all border outline-none ${
                  isHome && !scrolled 
                    ? "bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/20 focus:border-white/40" 
                    : "bg-gray-50 border-gray-100 text-black placeholder:text-gray-400 focus:bg-white focus:border-[#8484F6]/30 focus:ring-4 focus:ring-[#8484F6]/5"
                }`}
              />
              <Search 
                size={18} 
                className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
                  isHome && !scrolled ? "text-white/40 group-focus-within:text-white" : "text-gray-300 group-focus-within:text-[#8484F6]"
                }`} 
              />
           </form>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {/* Cart */}
          <Link
            href="/cart"
            className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-transform hover:scale-105 sm:h-10 sm:w-10 ${isHome && !scrolled ? "hover:bg-white/10" : "hover:bg-gray-50"}`}
          >
            <Image 
              src="/CartIcon.svg" 
              alt="Cart" 
              fill
              className={`object-contain ${isHome && !scrolled ? 'brightness-0 invert' : ''}`}
              unoptimized
            />
            {cartItemCount > 0 && (
              <span className={`absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold z-10 ring-2 ring-white ${isHome && !scrolled ? 'bg-white text-[#8484F6]' : 'bg-black text-white'}`}>
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
                  className={`hidden md:flex items-center h-11 px-6 rounded-xl text-sm font-bold transition-all ${isHome && !scrolled ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}`}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard/my-shop/new"
                  className={`hidden md:flex items-center h-11 px-6 rounded-xl text-sm font-bold transition-all shadow-sm ${isHome && !scrolled ? 'bg-white text-[#8484F6] hover:bg-gray-100' : 'bg-[#8484F6] text-white hover:opacity-90'}`}
                >
                  <Store size={16} className="mr-2" />
                  Open a Shop
                </Link>
              )
            )}
            <div className="flex items-center justify-center ml-1 md:ml-2">
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10 border-2 border-transparent hover:border-white/50 transition-all",
                  },
                }}
              />
            </div>
          </Show>

          {/* Guest */}
          <Show when="signed-out">
            <div className="hidden md:flex items-center gap-3">
              <SignInButton mode="modal">
                <button className={`h-11 px-6 rounded-xl text-sm font-bold transition-colors ${isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-black hover:bg-gray-100'}`}>
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className={`h-11 px-6 rounded-xl text-sm font-bold transition-all ${isHome && !scrolled ? 'bg-white text-black hover:bg-gray-100' : 'bg-black text-white hover:bg-gray-800'}`}>
                  Sign up
                </button>
              </SignUpButton>
            </div>
          </Show>

          {/* Mobile toggle */}
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors md:hidden ${isHome && !scrolled ? 'text-white hover:bg-white/10' : 'text-black hover:bg-gray-50'}`}
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white/95 backdrop-blur px-4 pb-6 pt-4 md:hidden shadow-xl animate-in slide-in-from-top duration-300">
          {/* Mobile Search */}
          <form onSubmit={handleSearch} className="mb-6 relative">
              <input 
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl text-sm font-medium bg-gray-50 border border-gray-100 outline-none focus:bg-white focus:border-[#8484F6]/30"
              />
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>

          <div className="flex flex-col gap-1.5">
            <Link
              href="/"
              className="rounded-xl px-4 py-3 text-base font-bold text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/products"
              className="rounded-xl px-4 py-3 text-base font-bold text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Explore
            </Link>
            <Link
              href="/shops"
              className="rounded-xl px-4 py-3 text-base font-bold text-gray-800 hover:bg-gray-50 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Shops
            </Link>
            <Link
              href="/dashboard/influencer"
              className="rounded-xl px-4 py-3 text-base font-bold text-[#8484F6] bg-[#8484F6]/5 flex items-center gap-2 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Sparkles size={16} />
              Partners
            </Link>

            <Show when="signed-in">
              {hasShop ? (
                <Link
                  href="/dashboard"
                  className="rounded-xl px-4 py-3 text-base font-bold text-gray-900 hover:bg-gray-50 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/dashboard/my-shop/new"
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-[#8484F6] px-4 py-3 text-base font-bold text-white shadow-lg hover:opacity-90 transition-opacity"
                  onClick={() => setMobileOpen(false)}
                >
                  <Store size={18} />
                  Open a Shop
                </Link>
              )}
            </Show>

            <Show when="signed-out">
              <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 px-1">
                <SignInButton mode="modal">
                  <button className="w-full rounded-xl border-2 border-gray-100 py-3 text-base font-bold text-gray-800 hover:bg-gray-50 transition-colors">
                    Log in
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="w-full rounded-xl bg-black py-3 text-base font-bold text-white hover:bg-gray-800 transition-colors shadow-md">
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
