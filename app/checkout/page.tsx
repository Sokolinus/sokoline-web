"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@clerk/nextjs";
import { checkoutCart } from "@/lib/api";
import { CheckCircle2, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import Link from 'next/link';

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const router = useRouter();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tighter">Authentication Required</h1>
        <Link href="/sign-in" className="bg-sokoline-accent text-white px-8 py-3 rounded-full font-bold">Sign In</Link>
      </div>
    );
  }

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      const token = await getToken();
      if (token) {
        const order = await checkoutCart(token);
        if (order) {
          setIsSuccess(true);
          await refreshCart(); // Clear local cart
          setTimeout(() => {
            router.push("/orders");
          }, 3000);
        }
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
        <div className="h-24 w-24 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mb-8 animate-bounce">
          <CheckCircle2 size={64} />
        </div>
        <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase mb-4">Order Placed!</h1>
        <p className="text-muted-foreground max-w-md font-medium text-lg">
          Your student venture order is being processed. You will be redirected to your orders in a moment.
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h1 className="text-3xl font-black uppercase">Nothing to checkout</h1>
        <Link href="/products" className="text-sokoline-accent font-bold underline">Go find something cool</Link>
      </div>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <div className="max-w-3xl mx-auto px-6 py-12 md:py-20">
        <Link href="/cart" className="text-sm font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2 mb-12 hover:text-sokoline-accent transition-colors">
          <ArrowLeft size={14} /> Back to bag
        </Link>

        <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase mb-12">Checkout</h1>
        
        <div className="bg-card rounded-[32px] border border-border p-10">
          <h2 className="text-xl font-bold text-foreground uppercase mb-8 pb-4 border-b border-border">Order Summary</h2>
          
          <div className="space-y-6 mb-10">
            {cart.items.map(item => (
              <div key={item.id} className="flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground uppercase">{item.product_name}</span>
                  <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                </div>
                <span className="font-black text-foreground">${item.total_price}</span>
              </div>
            ))}
          </div>

          <div className="space-y-4 mb-10 pt-6 border-t border-border">
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Subtotal</span>
              <span className="text-foreground">${cart.total_price}</span>
            </div>
            <div className="flex justify-between text-muted-foreground font-medium">
              <span>Shipping</span>
              <span className="text-sokoline-accent font-bold text-xs uppercase tracking-widest">Calculated at Vendor</span>
            </div>
            <div className="flex justify-between items-end pt-4">
              <span className="font-bold text-muted-foreground uppercase tracking-widest text-xs">Total to pay</span>
              <span className="text-4xl font-black text-foreground leading-none">${cart.total_price}</span>
            </div>
          </div>

          <button 
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full bg-sokoline-accent text-white py-6 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-sokoline-accent-hover transition-all shadow-2xl shadow-sokoline-accent/20 dark:shadow-none disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 size={24} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Confirm Purchase <ArrowRight size={20} />
              </>
            )}
          </button>
          
          <p className="mt-8 text-[9px] text-muted-foreground uppercase tracking-[0.2em] text-center font-bold">
            Secure student-to-student transaction via Sokoline
          </p>
        </div>
      </div>
    </main>
  );
}
