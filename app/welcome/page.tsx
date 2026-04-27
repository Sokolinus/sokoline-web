"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useShop } from "@/components/providers/ShopProvider";
import { 
  ShoppingBag, 
  Store, 
  ShieldCheck, 
  Zap, 
  Smartphone,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  const { user, isLoaded: userLoaded } = useUser();
  const { hasShop, loading: shopLoading } = useShop();
  const router = useRouter();

  // Smart redirect: If they already have a shop, skip onboarding and go to dashboard
  useEffect(() => {
    if (userLoaded && !shopLoading && hasShop) {
      router.replace("/dashboard");
    }
  }, [userLoaded, shopLoading, hasShop, router]);

  if (!userLoaded || shopLoading || hasShop) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-black border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl animate-in fade-in duration-700">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="font-logo text-4xl font-black tracking-tight text-gray-900 sm:text-6xl mb-6">
            Welcome to Sokoline, <span className="text-[#8484F6]">{user?.firstName || "Scholar"}</span>
          </h1>
          <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
            The infrastructure for campus commerce. Connect with verified peers, trade securely, and launch your own venture.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Security Card */}
          <div className="group relative overflow-hidden bg-gray-50 p-8 rounded-3xl border border-gray-100 transition-colors hover:bg-white hover:border-gray-200">
            <div className="absolute inset-0 z-0 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
               <img src="/about-section-image.jpg" alt="" className="w-full h-full object-cover grayscale" />
            </div>
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                <ShieldCheck className="text-black" size={24} />
              </div>
              <h3 className="font-logo text-lg font-bold mb-2">Secure Trading</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Verified student network with peer-to-peer accountability built-in.
              </p>
            </div>
          </div>

          {/* M-Pesa Card */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 transition-colors hover:bg-white hover:border-gray-200">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
              <Smartphone className="text-black" size={24} />
            </div>
            <h3 className="font-logo text-lg font-bold mb-2">M-Pesa Settlements</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Instant payments and automated checkouts for every transaction.
            </p>
          </div>

          {/* Analytics Card */}
          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 transition-colors hover:bg-white hover:border-gray-200">
            <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
              <Zap className="text-black" size={24} />
            </div>
            <h3 className="font-logo text-lg font-bold mb-2">Growth Engine</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              Native tools to market your products and track your shop's performance.
            </p>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Buyer Path */}
          <Link href="/products" className="group block relative overflow-hidden rounded-[2rem] bg-gray-50 p-8 text-black transition-all border border-gray-100 hover:border-black/10 hover:bg-white shadow-sm hover:shadow-xl">
            <div className="relative z-10">
              <div className="h-12 w-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-6">
                 <ShoppingBag className="text-black" size={24} />
              </div>
              <h2 className="font-logo text-xl font-bold mb-3">Browse Items</h2>
              <p className="text-gray-500 mb-8 font-medium text-sm">
                Find exactly what you need from fellow students.
              </p>
              <div className="inline-flex items-center gap-2 text-black font-bold group-hover:gap-4 transition-all text-sm">
                Explore Items <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* Seller Path */}
          <Link href="/dashboard/my-shop/new" className="group block relative overflow-hidden rounded-[2rem] bg-[#8484F6] p-8 text-white transition-all shadow-lg hover:shadow-2xl hover:scale-[1.02]">
            <div className="relative z-10">
              <div className="h-12 w-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center mb-6">
                 <Store className="text-white" size={24} />
              </div>
              <h2 className="font-logo text-xl font-bold mb-3">Launch Shop</h2>
              <p className="text-white/80 mb-8 font-medium text-sm">
                Professional tools to sell to the entire campus network.
              </p>
              <div className="inline-flex items-center gap-2 bg-white text-[#8484F6] px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm group-hover:bg-gray-50">
                Get Started <ArrowRight size={16} />
              </div>
            </div>
          </Link>

          {/* Partner Path */}
          <Link href="/dashboard/influencer" className="group block relative overflow-hidden rounded-[2rem] bg-[#BEFDB1] p-8 text-black transition-all shadow-md hover:shadow-xl hover:scale-[1.02]">
            <div className="relative z-10">
              <div className="h-12 w-12 bg-black/5 rounded-xl flex items-center justify-center mb-6">
                 <Sparkles className="text-black" size={24} />
              </div>
              <h2 className="font-logo text-xl font-bold mb-3">Become Partner</h2>
              <p className="text-black/60 mb-8 font-medium text-sm">
                Promote friends' shops and earn a cut of every sale.
              </p>
              <div className="inline-flex items-center gap-2 bg-black text-[#BEFDB1] px-5 py-2.5 rounded-xl font-bold transition-all shadow-sm text-sm group-hover:opacity-90">
                Start Earning <ArrowRight size={16} />
              </div>
            </div>
          </Link>
        </div>

        <p className="text-center mt-12 text-gray-400 text-sm font-medium">
          Choose a path to continue. You can access both features at any time.
        </p>
      </div>
    </div>
  );
}
