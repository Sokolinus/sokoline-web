"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/providers/ToastProvider";
import { checkoutCart, getOrderPaymentStatus } from "@/lib/api";
import { CheckCircle2, ArrowLeft, Loader2, Phone, XCircle, ShieldCheck, Check, ShoppingBag } from "lucide-react";
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

function CheckoutSuccess() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
      <div className="relative mb-10">
        {!prefersReduced && (
          <>
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 rounded-full bg-emerald-400/20"
            />
          </>
        )}
        
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 15,
            delay: 0.1 
          }}
          className="relative h-28 w-28 rounded-[32px] bg-emerald-500 flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20"
        >
          <CheckCircle2 size={56} strokeWidth={2.5} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter font-logo">Order Confirmed!</h1>
        <p className="text-gray-500 max-w-sm text-lg font-medium leading-relaxed mb-10">
          Your payment was successful and the student vendor has been notified.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-xs"
        >
          <div className="w-full py-[20px] rounded-[12px] font-logo text-[20px] bg-emerald-500 text-white flex items-center justify-center gap-4 shadow-xl">
            <Check size={24} strokeWidth={3} />
            Paid!
          </div>
          <p className="text-black/30 font-bold text-[10px] uppercase tracking-[0.2em] mt-6">
            Redirecting to your orders...
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingStatus, setPollingStatus] = useState<string>("waiting");
  const pollingStatusRef = React.useRef(pollingStatus);

  useEffect(() => {
    pollingStatusRef.current = pollingStatus;
  }, [pollingStatus]);

  const validateAndFormatPhone = (number: string): string | null => {
    // Remove all non-digit characters including +
    let cleaned = number.replace(/\D/g, "");

    // Case 1: Already 254... (12 digits)
    if (cleaned.startsWith("254") && cleaned.length === 12) {
      return cleaned;
    }

    // Case 2: Starts with 07 or 01 (10 digits)
    if ((cleaned.startsWith("07") || cleaned.startsWith("01")) && cleaned.length === 10) {
      return "254" + cleaned.substring(1);
    }

    // Case 3: Starts with 7 or 1 (9 digits)
    if ((cleaned.startsWith("7") || cleaned.startsWith("1")) && cleaned.length === 9) {
      return "254" + cleaned;
    }

    return null;
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    const POLL_LIMIT = 60000;

    if (orderId && pollingStatus === "pending") {
      timeout = setTimeout(() => {
        if (pollingStatusRef.current === "pending") {
          setPollingStatus("failed");
          setIsProcessing(false);
          setError("Payment timed out. If you already paid, check your orders in a few minutes.");
          clearInterval(interval);
        }
      }, POLL_LIMIT);

      interval = setInterval(async () => {
        try {
          const token = await getToken();
          if (token) {
            const statusData = await getOrderPaymentStatus(token, orderId);
            if (statusData) {
              if (statusData.payment_status === "SUCCESS") {
                setPollingStatus("success");
                setIsSuccess(true);
                await refreshCart();
                clearInterval(interval);
                clearTimeout(timeout);
                toast("Payment successful!", "success");
                setTimeout(() => router.push("/orders"), 3000);
              } else if (statusData.payment_status === "FAILED") {
                setPollingStatus("failed");
                setIsProcessing(false);
                setError("Payment failed. Please try again.");
                clearInterval(interval);
                clearTimeout(timeout);
              }
            }
          }
        } catch (err) {
          console.error("[Checkout] Polling error:", err);
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (timeout) clearTimeout(timeout);
    };
  }, [orderId, pollingStatus, getToken, refreshCart, router, toast]);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Sign in to checkout</h1>
        <Link href="/sign-in" className="bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">Log In</Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedPhone = validateAndFormatPhone(phoneNumber);
    
    if (!formattedPhone) {
      setError("Enter a valid M-Pesa number (e.g. 0712... or 0112...)");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const token = await getToken();
      if (token) {
        const order = await checkoutCart(token, formattedPhone);
        if (order) {
          setOrderId(order.id);
          setPollingStatus("pending");
        }
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed. Verify your number.");
      setIsProcessing(false);
    }
  };

  if (isSuccess) return <CheckoutSuccess />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-xl font-bold text-gray-900 font-logo">Your bag is empty</h1>
        <Link href="/products" className="text-black font-bold border-b-2 border-black">Go shopping</Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
      <div className="mt-6 py-4 border-b border-gray-100">
        <Link href="/cart" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to bag
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mt-10">
        <div className="lg:col-span-3">
          <div className="rounded-[2rem] border border-gray-100 bg-white shadow-sm overflow-hidden">
            <div className="px-8 py-8 border-b border-gray-50">
              <h2 className="text-2xl font-black text-gray-900 font-logo uppercase tracking-tighter">Secure payment</h2>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Direct M-Pesa Settlement</p>
            </div>

            <div className="p-8">
              <AnimatePresence mode="wait">
                {pollingStatus === "pending" ? (
                  <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center gap-6 py-12">
                    <div className="h-20 w-20 rounded-[2rem] bg-gray-50 flex items-center justify-center border border-gray-100">
                      <Loader2 size={32} className="animate-spin text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 font-logo">Check your phone</h3>
                      <p className="text-gray-400 text-sm font-medium mt-2 max-w-[240px]">We've sent an STK push. Enter your PIN to pay.</p>
                    </div>
                  </motion.div>
                ) : pollingStatus === "failed" ? (
                  <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center gap-6 py-12">
                    <div className="h-20 w-20 rounded-[2rem] bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                      <XCircle size={32} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-gray-900 font-logo">Payment Failed</h3>
                      <p className="text-gray-400 text-sm font-medium mt-2 max-w-[280px]">The transaction was declined or timed out.</p>
                    </div>
                    <button onClick={() => { setPollingStatus("waiting"); setError(null); setOrderId(null); }} className="mt-4 bg-black text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-800 transition-all shadow-xl">
                      Try Again
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleCheckout} className="space-y-8">
                    <div className="space-y-3">
                      <label htmlFor="phone" className="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 font-logo">
                        M-Pesa number
                      </label>
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300">
                          <Phone size={18} />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="e.g. 0712 345 678"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isProcessing}
                          className="w-full rounded-2xl border border-gray-100 bg-gray-50 py-5 pl-14 pr-6 text-lg font-bold text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-8 focus:ring-black/5 disabled:opacity-50"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Supports 07..., 01..., and 254...</p>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="bg-red-50 border border-red-100 rounded-2xl px-6 py-4 flex items-center gap-3 text-red-600 text-xs font-bold uppercase tracking-tight">
                          <XCircle size={16} />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={isProcessing} className="w-full rounded-2xl bg-black py-6 text-xs font-black uppercase tracking-[0.25em] text-white hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-2xl shadow-black/10 active:scale-95">
                      {isProcessing ? <><Loader2 size={18} className="animate-spin" /> Processing...</> : "Pay now"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="px-8 py-6 border-t border-gray-50 flex items-center justify-center gap-3 text-gray-300">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Secured by Safaricom Daraja</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-[2rem] border border-gray-100 bg-white shadow-sm p-8 sticky top-24">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-8 font-logo pb-4 border-b border-gray-50">Summary</h2>

            <div className="space-y-4 mb-8">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{item.product_name}</p>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-black text-gray-900 shrink-0">KES {item.total_price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-50 pt-6 space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em]">Grand Total</span>
                <span className="text-3xl font-black text-gray-900 tracking-tighter">KES {cart.total_price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
