"use client";

import React from "react";
import Link from "next/link";
import {
  SignInButton,
  SignUpButton,
  UserButton,
  Show,
} from "@clerk/nextjs";

const Navbar = () => {
  return (
    <nav className="w-full bg-white border-b border-gray-100 font-sans sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-10 h-16 md:h-20 flex items-center justify-between">
        {/* LOGO */}
        <Link href="/" className="text-xl md:text-2xl font-black tracking-tighter text-[#1A1A1A]">
          SOKOLINE
        </Link>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex items-center gap-10">
          <Link href="/products" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
            Shop
          </Link>
          <Link href="/shops" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">
            Shops
          </Link>
          
          <Show when="signed-in">
            <Link href="/dashboard" className="text-sm font-bold text-[#7C3AED] hover:text-[#6D28D9] transition-colors">
              Dashboard
            </Link>
          </Show>
          
          <Show when="signed-out">
            <div className="text-sm font-medium text-gray-500 hover:text-black transition-colors cursor-pointer">
              <SignInButton mode="modal" />
            </div>
          </Show>
        </div>

        {/* ICONS & ACTIONS */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Search Icon */}
          <button className="p-2 text-gray-400 hover:text-black transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Cart with Notification */}
          <Link href="/cart" className="relative p-2 text-gray-400 hover:text-black transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#7C3AED] rounded-full border-2 border-white"></span>
          </Link>

          {/* PROFILE / AUTH */}
          <Show when="signed-in">
            <UserButton 
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8 rounded-full border border-gray-200"
                }
              }}
            />
          </Show>
          
          <Show when="signed-out">
            <div className="hidden md:block">
              <div className="rounded-full bg-[#7C3AED] px-6 py-2 text-sm font-bold text-white hover:bg-[#6D28D9] transition-all active:scale-95 cursor-pointer">
                <SignUpButton mode="modal" />
              </div>
            </div>
            {/* Mobile Menu Icon */}
            <button className="md:hidden p-2 text-gray-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          </Show>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
