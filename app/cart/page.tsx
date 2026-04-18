"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@clerk/nextjs";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <h1 className="text-4xl font-black tracking-tighter text-[#1A1A1A] uppercase">Authentication Required</h1>
        <p className="text-zinc-500 max-w-md font-medium">Please sign in to view and manage your shopping bag.</p>
        <Link href="/sign-in" className="bg-[#7C3AED] text-white px-8 py-3 rounded-full font-bold hover:bg-[#6D28D9] transition-colors">
          Sign In to Sokoline
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-6">
        <div className="h-24 w-24 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-300">
          <ShoppingBag size={48} />
        </div>
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-[#1A1A1A] uppercase mb-2">Your bag is empty</h1>
          <p className="text-zinc-500 font-medium">Looks like you haven't added any student ventures yet.</p>
        </div>
        <Link href="/products" className="text-[#7C3AED] font-bold uppercase tracking-widest flex items-center gap-2 hover:opacity-70 transition-opacity">
          <ArrowLeft size={16} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-white dark:bg-[#0A0A0A] min-h-screen pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-12">
        <h1 className="text-5xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] uppercase mb-12">Shopping Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-8">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-6 pb-8 border-b border-zinc-100 dark:border-zinc-800">
                <div className="relative h-40 w-32 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                   {/* In a real app we'd fetch the product image here, using placeholder for now */}
                   <div className="flex items-center justify-center h-full text-zinc-300">
                     <ShoppingBag size={32} />
                   </div>
                </div>
                
                <div className="flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-[#FBFBFB] uppercase">{item.product_name}</h3>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-zinc-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-auto">Unit: ${item.unit_price}</p>
                  
                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center gap-4 bg-zinc-50 dark:bg-zinc-900 px-4 py-2 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-[#7C3AED] hover:scale-110 transition-transform"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-[#1A1A1A] dark:text-[#FBFBFB] min-w-[20px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-[#7C3AED] hover:scale-110 transition-transform"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <span className="text-xl font-black text-[#1A1A1A] dark:text-[#FBFBFB]">${item.total_price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-zinc-50 dark:bg-zinc-900/50 p-8 rounded-[32px] border border-zinc-100 dark:border-zinc-800">
              <h2 className="text-2xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] uppercase mb-8">Summary</h2>
              
              <div className="space-y-4 mb-8 pb-8 border-b border-zinc-200 dark:border-zinc-800">
                <div className="flex justify-between font-medium text-zinc-500">
                  <span>Subtotal</span>
                  <span>${cart.total_price}</span>
                </div>
                <div className="flex justify-between font-medium text-zinc-500">
                  <span>Shipping</span>
                  <span className="text-[#7C3AED] uppercase text-xs font-bold tracking-widest">Free</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-10">
                <span className="font-bold text-zinc-400 uppercase tracking-widest text-xs">Total</span>
                <span className="text-4xl font-black text-[#1A1A1A] dark:text-[#FBFBFB] leading-none">${cart.total_price}</span>
              </div>
              
              <Link 
                href="/checkout"
                className="w-full bg-[#7C3AED] text-white py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-[#6D28D9] transition-all shadow-xl shadow-purple-200 dark:shadow-none"
              >
                Checkout <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
