"use client";

import React from 'react';
import Link from 'next/link';
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@clerk/nextjs";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ArrowLeft } from "lucide-react";

export default function CartPage() {
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sokoline-accent"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 text-center px-6">
        <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase leading-none">Authentication <br /> Required</h1>
        <p className="text-muted-foreground max-w-md font-medium text-lg">Please sign in to view and manage your shopping bag.</p>
        <Link href="/sign-in" className="bg-foreground text-background px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-sokoline-accent transition-all">
          Sign In to Sokoline
        </Link>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-10 text-center px-6 animate-in fade-in duration-700">
        <div className="h-32 w-32 rounded-[40px] bg-muted flex items-center justify-center text-muted-foreground border border-border">
          <ShoppingBag size={56} />
        </div>
        <div>
          <h1 className="text-6xl font-black tracking-tighter text-foreground uppercase mb-4">Empty Bag</h1>
          <p className="text-muted-foreground font-medium text-lg">Looks like you haven't added any student ventures yet.</p>
        </div>
        <Link href="/products" className="text-sokoline-accent font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:opacity-70 transition-opacity">
          <ArrowLeft size={16} /> Start Exploring
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-background min-h-screen pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
        <h1 className="text-7xl font-black tracking-tighter text-foreground uppercase mb-20 leading-none">Your <br /> <span className="text-sokoline-accent">Selection</span></h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
          {/* Item List */}
          <div className="lg:col-span-2 space-y-12">
            {cart.items.map((item) => (
              <div key={item.id} className="flex gap-10 pb-12 border-b border-border items-start group">
                <div className="relative h-48 w-40 flex-shrink-0 overflow-hidden rounded-[32px] bg-muted border border-border transition-all duration-500 group-hover:shadow-xl group-hover:shadow-sokoline-accent/10">
                   <div className="flex items-center justify-center h-full text-muted-foreground">
                     <ShoppingBag size={48} />
                   </div>
                </div>
                
                <div className="flex flex-col flex-1 pt-2">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-black text-foreground uppercase tracking-tight">{item.product_name}</h3>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-auto">Unit: ${item.unit_price}</p>
                  
                  <div className="flex justify-between items-center mt-10">
                    <div className="flex items-center gap-6 bg-muted px-6 py-3 rounded-2xl border border-border">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-sokoline-accent hover:scale-125 transition-transform"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-black text-foreground text-lg min-w-[30px] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-sokoline-accent hover:scale-125 transition-transform"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <span className="text-3xl font-black text-foreground tracking-tighter">${item.total_price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 bg-muted/30 p-10 rounded-[48px] border border-border shadow-sm">
              <h2 className="text-2xl font-black tracking-tighter text-foreground uppercase mb-10">Total</h2>
              
              <div className="space-y-6 mb-10 pb-10 border-b border-border">
                <div className="flex justify-between font-bold text-muted-foreground uppercase text-xs tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-foreground">${cart.total_price}</span>
                </div>
                <div className="flex justify-between font-bold text-muted-foreground uppercase text-xs tracking-widest">
                  <span>Shipping</span>
                  <span className="text-sokoline-accent">Complimentary</span>
                </div>
              </div>
              
              <div className="flex justify-between items-end mb-12">
                <span className="font-black text-muted-foreground uppercase tracking-widest text-[10px]">Grand Total</span>
                <span className="text-5xl font-black text-foreground tracking-tighter leading-none">${cart.total_price}</span>
              </div>
              
              <Link 
                href="/checkout"
                className="w-full bg-foreground text-background py-6 rounded-[28px] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 hover:bg-sokoline-accent transition-all shadow-2xl active:scale-95"
              >
                Checkout <ArrowRight size={20} />
              </Link>
              
              <p className="mt-8 text-[9px] text-zinc-400 font-bold uppercase tracking-widest text-center leading-relaxed">
                Secure student-to-student transactions. <br /> Powered by Sokoline Infrastructure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
