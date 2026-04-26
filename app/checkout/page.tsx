"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/providers/ToastProvider";
import { checkoutCart, getOrderPaymentStatus } from "@/lib/api";
import { getCookie } from "@/lib/utils";
import { CheckCircle2, ArrowLeft, Loader2, Phone, XCircle, ShieldCheck, Check, ShoppingBag, MapPin } from "lucide-react";
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

function CheckoutSuccess() {
  const prefersReduced = useReducedMotion();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6 bg-white">
      <div className="relative mb-8 sm:mb-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="relative h-24 w-24 rounded-[2rem] bg-black flex items-center justify-center text-white shadow-2xl"
        >
          <Check size={48} strokeWidth={3} />
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center"
      >
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter font-logo uppercase">Payment Received</h1>
        <p className="text-gray-500 max-w-sm text-lg font-medium leading-relaxed mb-10">
          Your order is confirmed. The student vendor has been notified and is preparing your items.
        </p>

        <div className="w-full max-w-xs space-y-4">
           <div className="py-4 px-6 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Verified</span>
           </div>
           <p className="text-black/20 font-bold text-[10px] uppercase tracking-[0.3em] pt-4 animate-pulse">
            Redirecting to orders...
          </p>
        </div>
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
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pollingStatus, setPollingStatus] = useState<string>("waiting");
  const pollingStatusRef = React.useRef(pollingStatus);

  useEffect(() => {
    pollingStatusRef.current = pollingStatus;
  }, [pollingStatus]);

  const validateAndFormatPhone = (number: string): string | null => {
    let cleaned = number.replace(/\D/g, "");
    if (cleaned.startsWith("254") && cleaned.length === 12) return cleaned;
    if ((cleaned.startsWith("07") || cleaned.startsWith("01")) && cleaned.length === 10) return "254" + cleaned.substring(1);
    if ((cleaned.startsWith("7") || cleaned.startsWith("1")) && cleaned.length === 9) return "254" + cleaned;
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
          setError("Transaction timed out. Please check your M-Pesa statements.");
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
                toast("Payment Confirmed", "success");
                setTimeout(() => router.push("/orders"), 3500);
              } else if (statusData.payment_status === "FAILED") {
                setPollingStatus("failed");
                setIsProcessing(false);
                setError("M-Pesa transaction was declined.");
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-6">
        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase font-logo">Identity Required</h1>
        <Link href="/sign-in" className="w-full max-w-xs bg-black text-white py-5 rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-zinc-800 transition-all shadow-2xl">Log In to Continue</Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedPhone = validateAndFormatPhone(phoneNumber);
    if (!formattedPhone) {
      setError("Provide a valid M-Pesa number");
      return;
    }

    const referralCode = getCookie("sokoline_ref");

    setIsProcessing(true);
    setError(null);
    try {
      const token = await getToken();
      if (token) {
        const order = await checkoutCart(token, formattedPhone, referralCode, deliveryInstructions);
        if (order) {
          setOrderId(order.id);
          setPollingStatus("pending");
        }
      }
    } catch (err: any) {
      setError(err.message || "Checkout failed.");
      setIsProcessing(false);
    }
  };

  if (isSuccess) return <CheckoutSuccess />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
        <h1 className="text-2xl font-black text-gray-900 font-logo uppercase tracking-tighter">Your bag is empty</h1>
        <Link href="/products" className="text-black font-black uppercase text-[10px] tracking-[0.2em] border-b-2 border-black pb-1">Start Exploring</Link>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-20">
      {/* Navigation */}
      <div className="mt-4 sm:mt-6 py-6 border-b border-gray-100 flex items-center justify-between">
        <Link href="/cart" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to bag
        </Link>
        <div className="md:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-black text-white">
           <span className="text-[10px] font-black uppercase tracking-widest">KES {cart.total_price}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mt-10">
        
        {/* Main Payment Column */}
        <div className="lg:col-span-3 order-1 lg:order-none">
          <div className="rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl shadow-black/5 overflow-hidden">
            <div className="px-8 py-10 border-b border-gray-50">
              <h2 className="text-3xl font-black text-gray-900 font-logo uppercase tracking-tighter">Checkout</h2>
              <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-2">Authenticated M-Pesa Settlement</p>
            </div>

            <div className="p-8 sm:p-10">
              <AnimatePresence mode="wait">
                {pollingStatus === "pending" ? (
                  <motion.div key="pending" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center gap-8 py-12">
                    <div className="relative">
                       <div className="h-24 w-24 rounded-[2rem] bg-gray-50 flex items-center justify-center border border-gray-100">
                         <Loader2 size={40} className="animate-spin text-black" />
                       </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-gray-900 font-logo uppercase tracking-tighter">Action Required</h3>
                      <p className="text-gray-400 text-sm font-medium max-w-[280px]">We've sent a prompt to your phone. Enter your M-Pesa PIN to complete the venture support.</p>
                    </div>
                  </motion.div>
                ) : pollingStatus === "failed" ? (
                  <motion.div key="failed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center text-center gap-8 py-12">
                    <div className="h-24 w-24 rounded-[2rem] bg-black text-white flex items-center justify-center shadow-2xl">
                      <XCircle size={40} />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-2xl font-black text-gray-900 font-logo uppercase tracking-tighter">Payment Declined</h3>
                      <p className="text-gray-400 text-sm font-medium max-w-[280px]">{error || "The transaction could not be completed."}</p>
                    </div>
                    <button onClick={() => { setPollingStatus("waiting"); setError(null); setOrderId(null); }} className="w-full max-w-[240px] bg-black text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] hover:bg-zinc-800 transition-all shadow-xl">
                      Try Again
                    </button>
                  </motion.div>
                ) : (
                  <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleCheckout} className="space-y-10">
                    <div className="space-y-4">
                      <label htmlFor="phone" className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-logo">
                        M-Pesa Number
                      </label>
                      <div className="relative">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-300">
                          <Phone size={20} />
                        </div>
                        <input
                          id="phone"
                          type="tel"
                          placeholder="0712 345 678"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value)}
                          disabled={isProcessing}
                          className="w-full rounded-[1.5rem] border-2 border-gray-50 bg-gray-50 py-6 pl-16 pr-8 text-xl font-black text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-0 disabled:opacity-50"
                        />
                      </div>
                      <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-[0.15em]">Personal or business numbers supported.</p>
                    </div>

                    <div className="space-y-4">
                        <label htmlFor="instructions" className="block text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400 font-logo">
                            Delivery Details
                        </label>
                        <div className="relative">
                            <div className="absolute left-6 top-6 text-zinc-300">
                                <MapPin size={20} />
                            </div>
                            <textarea
                                id="instructions"
                                placeholder="Where should we find you? (e.g. Student Centre, Gate A, or Hostel Room)"
                                value={deliveryInstructions}
                                onChange={(e) => setDeliveryInstructions(e.target.value)}
                                disabled={isProcessing}
                                className="w-full rounded-[1.5rem] border-2 border-gray-50 bg-gray-50 py-6 pl-16 pr-8 text-sm font-bold text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-0 disabled:opacity-50 min-h-[140px] resize-none"
                            />
                        </div>
                    </div>

                    <AnimatePresence>
                      {error && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-zinc-900 text-white rounded-2xl px-6 py-5 flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                          <XCircle size={18} className="text-red-500" />
                          {error}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button type="submit" disabled={isProcessing} className="w-full rounded-[1.5rem] bg-black py-7 text-xs font-black uppercase tracking-[0.3em] text-white hover:bg-zinc-800 transition-all disabled:opacity-50 flex items-center justify-center gap-4 shadow-2xl active:scale-95">
                      {isProcessing ? <><Loader2 size={20} className="animate-spin" /> Verifying...</> : "Authorize Payment"}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            <div className="px-8 py-8 border-t border-gray-50 flex items-center justify-center gap-3 text-zinc-300">
              <ShieldCheck size={18} />
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secured by Safaricom Daraja</span>
            </div>
          </div>
        </div>

        {/* Desktop Summary */}
        <div className="hidden lg:block lg:col-span-2">
          <div className="rounded-[2.5rem] border border-gray-100 bg-gray-50/50 p-10 sticky top-24">
            <h2 className="text-xs font-black text-gray-900 uppercase tracking-[0.3em] mb-10 font-logo pb-4 border-b border-gray-100">Order Summary</h2>

            <div className="space-y-6 mb-10">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-6">
                  <div className="min-w-0">
                    <p className="text-sm font-black text-gray-900 truncate leading-tight uppercase tracking-tight">{item.product_name}</p>
                    <p className="text-[9px] text-zinc-400 font-black uppercase tracking-widest mt-2">Quantity: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-black text-gray-900 shrink-0">KES {item.total_price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-8">
              <div className="flex justify-between items-baseline">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Total Amount</span>
                <span className="text-4xl font-black text-gray-900 tracking-tighter">KES {cart.total_price}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
