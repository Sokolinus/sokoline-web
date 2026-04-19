"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { fetchMyShop } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Store, ArrowRight, Loader2, PartyPopper } from "lucide-react";
import { Shop } from "@/lib/types";

// Confetti particle component
function ConfettiPiece({ delay }: { delay: number }) {
  const randomX = Math.random() * 400 - 200;
  const randomRotate = Math.random() * 360;
  const randomDuration = 2 + Math.random() * 0.5;

  return (
    <motion.div
      className="fixed pointer-events-none"
      initial={{ opacity: 1, y: -20, x: 0, rotate: 0 }}
      animate={{
        opacity: 0,
        y: window.innerHeight + 100,
        x: randomX,
        rotate: randomRotate,
      }}
      transition={{
        duration: randomDuration,
        delay,
        ease: "easeIn",
      }}
      style={{
        left: "50%",
        top: "10%",
        marginLeft: "-5px",
      }}
    >
      <div className="w-2 h-2 rounded-full bg-violet-500" />
    </motion.div>
  );
}

export default function ShopSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);

  const shopSlug = searchParams.get("shop");

  useEffect(() => {
    const loadShop = async () => {
      if (!isSignedIn || !isLoaded) return;

      try {
        const token = await getToken();
        if (token) {
          const shopData = await fetchMyShop(token);
          if (shopData) {
            setShop(shopData);
          }
        }
      } catch (error) {
        console.error("Failed to load shop:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      loadShop();
    }
  }, [isLoaded, isSignedIn, getToken]);

  if (!isLoaded || !isSignedIn) return null;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
        <Loader2 className="animate-spin text-violet-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-blue-50 flex items-center justify-center overflow-hidden px-6">
      {/* Confetti animation */}
      {Array.from({ length: 40 }).map((_, i) => (
        <ConfettiPiece key={i} delay={i * 0.05} />
      ))}

      <div className="w-full max-w-md text-center">
        {/* Celebration icon */}
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-violet-100 text-violet-600 mb-8">
          <PartyPopper size={40} />
        </div>

        {/* Success message */}
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-3">
          Shop Created!
        </h1>

        <p className="text-lg text-gray-600 mb-8">
          Your storefront is live and ready to go.
        </p>

        {/* Shop card */}
        {shop && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              {shop.logo ? (
                <img
                  src={shop.logo}
                  alt={shop.name}
                  className="w-16 h-16 rounded-xl object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400">
                  <Store size={32} />
                </div>
              )}
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-900">{shop.name}</h2>
                <p className="text-sm text-gray-500">@{shop.slug}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">
              {shop.description}
            </p>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/dashboard"
            className="w-full rounded-xl bg-violet-600 px-6 py-3 text-center font-semibold text-white hover:bg-violet-700 transition-all inline-flex items-center justify-center gap-2 group"
          >
            Go to Dashboard
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
          <Link
            href={`/shops/${shop?.slug}`}
            className="w-full rounded-xl border border-gray-200 bg-white px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-50 transition-all"
          >
            View Shop Page
          </Link>
        </div>

        {/* Tip */}
        <p className="text-xs text-gray-500 mt-6 leading-relaxed">
          💡 Pro tip: Add your first product from the dashboard to start accepting orders.
        </p>
      </div>
    </div>
  );
}
