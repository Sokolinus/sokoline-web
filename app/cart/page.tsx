"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@clerk/nextjs";
import { Trash2, Plus, Minus, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import { formatImageUrl } from "@/lib/api";

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-black" size={32} />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-6">
        <h1 className="text-5xl font-black tracking-tighter font-logo">Your Cart</h1>
        <p className="text-black/50 font-medium max-w-sm">Please sign in to manage your student venture items and complete your purchase.</p>
        <Link href="/sign-in" className="mt-4 bg-black text-white px-10 py-4 rounded-[20px] font-bold font-logo uppercase tracking-widest transition-all hover:bg-black/80 shadow-2xl">
          Log In
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-6">
        <div className="relative h-32 w-32 opacity-20">
          <Image src="/CartIcon.svg" alt="Empty Cart" fill className="object-contain grayscale" sizes="128px" unoptimized />
        </div>
        <div>
          <h1 className="text-5xl font-black tracking-tighter font-logo">Cart is Empty</h1>
          <p className="text-black/50 font-medium mt-3">Ready to support some campus innovators?</p>
        </div>
        <Link href="/products" className="px-10 py-5 bg-sokoline-accent text-black rounded-[24px] font-black font-logo uppercase tracking-widest hover:opacity-90 transition-all flex items-center gap-3 shadow-xl">
          <ArrowLeft size={20} strokeWidth={3} /> Browse Items
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-20 font-sans">
      <div className="mb-12">
         <h1 className="text-6xl font-black tracking-tighter font-logo">Your Cart</h1>
         <p className="text-black/40 font-bold uppercase tracking-[0.2em] mt-2">{cart.items.length} items from student shops</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
        {/* Item List */}
        <div className="lg:col-span-3 space-y-6">
           {cart.items.map((item) => (
             <div key={item.id} className="group flex gap-8 items-center p-8 bg-gray-50 rounded-[32px] border border-black/5 transition-all hover:bg-white hover:shadow-2xl hover:shadow-black/5 hover:border-black/10">
               <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-[24px] bg-white border border-black/5 shadow-sm">
                  <div className="flex items-center justify-center h-full text-black/10">
                    <Image src="/CartIcon.svg" alt="Product" width={48} height={48} className="opacity-20 grayscale" unoptimized />
                  </div>
               </div>
               
               <div className="flex-1 flex flex-col min-w-0">
                 <div className="flex justify-between items-start">
                   <div>
                     <h3 className="text-xl font-black font-logo text-black tracking-tight line-clamp-1">{item.product_name}</h3>
                     <p className="text-[10px] text-black/40 mt-1 font-black uppercase tracking-[0.15em]">KES {item.unit_price} / unit</p>
                   </div>
                   <button 
                     onClick={() => removeItem(item.id)}
                     className="text-black/20 hover:text-red-500 transition-colors p-2"
                     title="Remove"
                   >
                     <Trash2 size={20} />
                   </button>
                 </div>
                 
                 <div className="flex justify-between items-center mt-6">
                   <div className="flex items-center bg-black/5 rounded-full p-1">
                     <button 
                       onClick={() => updateQuantity(item.id, item.quantity - 1)}
                       className="w-10 h-10 flex items-center justify-center text-black/40 hover:text-black transition-colors rounded-full hover:bg-white shadow-sm"
                     >
                       <Minus size={16} strokeWidth={3} />
                     </button>
                     <span className="text-sm font-black font-logo text-black px-4 min-w-[40px] text-center">{item.quantity}</span>
                     <button 
                       onClick={() => updateQuantity(item.id, item.quantity + 1)}
                       className="w-10 h-10 flex items-center justify-center text-black/40 hover:text-black transition-colors rounded-full hover:bg-white shadow-sm"
                     >
                       <Plus size={16} strokeWidth={3} />
                     </button>
                   </div>
                   <span className="text-2xl font-black font-logo text-black">KES {item.total_price}</span>
                 </div>
               </div>
             </div>
           ))}
          
          <Link href="/products" className="mt-12 inline-flex items-center gap-3 text-[10px] font-black text-black/30 hover:text-black transition-all uppercase tracking-[0.2em]">
             <ArrowLeft size={16} strokeWidth={3} /> Back to discovery
          </Link>
        </div>

        {/* Summary Card */}
        <div className="lg:col-span-2">
          <div className="bg-black text-white rounded-[40px] p-10 sticky top-32 shadow-2xl shadow-black/20">
            <h2 className="text-3xl font-black font-logo mb-10 border-b border-white/10 pb-6">Summary</h2>
            
            <div className="space-y-6 mb-12">
              <div className="flex justify-between text-lg font-bold font-logo text-white/60">
                <span>Subtotal</span>
                <span>KES {cart.total_price}</span>
              </div>
              <div className="flex justify-between text-lg font-bold font-logo text-white/60">
                <span>Campus Delivery</span>
                <span className="text-sokoline-accent uppercase text-xs tracking-widest pt-1 font-black">Free</span>
              </div>
              <div className="h-px bg-white/10 my-4" />
              <div className="flex justify-between items-end">
                <span className="text-xl font-black font-logo">Total</span>
                <div className="text-right">
                  <span className="text-5xl font-black font-logo leading-none">KES {cart.total_price}</span>
                </div>
              </div>
            </div>
            
            <Link 
              href="/checkout"
              className="w-full bg-sokoline-accent text-black py-6 rounded-[24px] font-black font-logo text-lg flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl active:scale-[0.98] uppercase tracking-widest"
            >
              Checkout <ArrowRight size={24} strokeWidth={3} />
            </Link>
            
            <div className="mt-10 pt-8 border-t border-white/5 space-y-4">
              <p className="text-[9px] font-bold text-white/30 text-center uppercase tracking-[0.2em] leading-relaxed">
                Direct Student-to-Student Support <br /> Secure Transaction
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
