"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { useCart } from "@/components/providers/CartProvider";
import { useAuth } from "@clerk/nextjs";
import { useToast } from "@/components/providers/ToastProvider";
import { checkoutCart, getOrderPaymentStatus } from "@/lib/api";
import { CheckCircle2, ArrowLeft, Loader2, Phone, XCircle, ShieldCheck } from "lucide-react";
import Link from 'next/link';

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

  // Handle M-Pesa Polling
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (orderId && pollingStatus === "pending") {
      interval = setInterval(async () => {
        const token = await getToken();
        if (token) {
          const statusData = await getOrderPaymentStatus(token, orderId);
          if (statusData) {
            if (statusData.payment_status === "SUCCESS") {
              setPollingStatus("success");
              setIsSuccess(true);
              await refreshCart();
              clearInterval(interval);
              toast("Payment successful! Your order is confirmed. 🎉", "success");
              setTimeout(() => {
                router.push("/orders");
              }, 3000);
            } else if (statusData.payment_status === "FAILED") {
              setPollingStatus("failed");
              setIsProcessing(false);
              setError("Payment failed. Please try again or check your M-Pesa balance.");
              toast("Payment failed. Please try again.", "error");
              clearInterval(interval);
            }
          }
        }
      }, 3000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [orderId, pollingStatus, getToken, refreshCart, router, toast]);

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">Sign in to checkout</h1>
        <Link href="/sign-in" className="bg-violet-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-violet-700 transition-colors">Log In</Link>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) {
      setError("Please enter your M-Pesa phone number");
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const token = await getToken();
      if (token) {
        const order = await checkoutCart(token, phoneNumber);
        if (order) {
          setOrderId(order.id);
          setPollingStatus("pending");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Checkout failed. Please verify your phone number.";
      setError(msg);
      setIsProcessing(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-6">
        <div className="h-20 w-20 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-8 border border-emerald-100 shadow-sm">
          <CheckCircle2 size={44} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Payment confirmed</h1>
        <p className="text-gray-500 max-w-sm text-base">
          Your order has been placed. Redirecting to your orders...
        </p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-xl font-bold text-gray-900">Your bag is empty</h1>
        <Link href="/products" className="text-violet-600 font-bold hover:underline">Go shopping</Link>
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
        {/* Payment Column */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Secure payment</h2>
              <p className="text-sm text-gray-400 mt-0.5">Pay via M-Pesa STK push</p>
            </div>

            <div className="p-8">
              {pollingStatus === "pending" ? (
                <div className="flex flex-col items-center text-center gap-5 py-8">
                  <div className="h-16 w-16 rounded-2xl bg-violet-50 flex items-center justify-center">
                    <Loader2 size={32} className="animate-spin text-violet-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Check your phone</h3>
                    <p className="text-gray-500 text-sm mt-1">Enter your M-Pesa PIN to complete the transaction.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCheckout} className="space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                      M-Pesa phone number
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Phone size={18} />
                      </div>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="2547XXXXXXXX"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        disabled={isProcessing}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50 py-3 pl-12 pr-4 text-sm font-medium text-gray-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 disabled:opacity-50"
                      />
                    </div>
                    <p className="text-[11px] text-gray-400">Format: 254700000000</p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                      <XCircle size={16} className="shrink-0" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full rounded-xl bg-violet-600 py-4 text-sm font-semibold text-white hover:bg-violet-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={18} className="animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Pay now"
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="px-8 py-4 border-t border-gray-100 flex items-center justify-center gap-2 text-gray-400">
              <ShieldCheck size={14} />
              <span className="text-[11px] font-medium tracking-wide">Secured by Safaricom Daraja</span>
            </div>
          </div>
        </div>

        {/* Summary Column */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-6 sticky top-24">
            <h2 className="text-base font-semibold text-gray-900 mb-5 border-b border-gray-100 pb-4">Order summary</h2>

            <div className="space-y-3 mb-5">
              {cart.items.map(item => (
                <div key={item.id} className="flex justify-between items-start gap-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 shrink-0">KES {item.total_price}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>Subtotal</span>
                <span className="font-medium text-gray-900">KES {cart.total_price}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-base font-bold text-gray-900">Total</span>
                <span className="text-2xl font-bold text-gray-900">KES {cart.total_price}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
