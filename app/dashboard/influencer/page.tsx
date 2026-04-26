"use client";

import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { apiRequest } from "@/lib/api";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Copy, 
  Check, 
  Sparkles, 
  Loader2, 
  Rocket, 
  ChevronRight, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Gift
} from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function InfluencerDashboard() {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [registering, setIsRegistering] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchProfile = async () => {
    try {
      const token = await getToken();
      if (token) {
        const res = await apiRequest("influencer/my_profile/", {}, token);
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        } else if (res.status === 404) {
          setProfile(null);
        }
      }
    } catch (error) {
      console.error("Failed to fetch influencer profile:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchProfile();
    }
  }, [isLoaded, isSignedIn, getToken]);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const token = await getToken();
      if (token) {
        const res = await apiRequest("influencer/register/", {
          method: "POST",
          body: JSON.stringify({ referral_code: user?.username || `user_${user?.id}` })
        }, token);
        
        if (res.ok) {
          toast("Welcome to the squad! You're now an influencer.", "success");
          fetchProfile();
        } else {
          toast("Registration failed. Please try again.", "error");
        }
      }
    } catch (error) {
      toast("An error occurred during registration.", "error");
    } finally {
      setIsRegistering(false);
    }
  };

  const copyRefLink = () => {
    if (!profile) return;
    const url = `${window.location.origin}/?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast("Referral link copied!", "success");
    setTimeout(() => setCopied(null as any), 2000);
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#8484F6]" size={32} />
      </div>
    );
  }

  // REGISTRATION SCREEN
  if (!profile && !loading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-[#8484F6]/10 text-[#8484F6] mb-4">
            <Gift size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight font-logo leading-tight">Become a Campus<br/>Social Influencer</h1>
          <p className="text-lg text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
            Get paid to promote the best student ventures. Share links, drive sales, and earn 5% commission on every order.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { 
              title: "1. Join the Squad", 
              desc: "Register your influencer profile in one click.", 
              icon: Sparkles,
              color: "bg-blue-50 text-blue-600"
            },
            { 
              title: "2. Share Your Link", 
              desc: "Paste your link in your TikTok bio or WhatsApp status.", 
              icon: Copy,
              color: "bg-violet-50 text-violet-600"
            },
            { 
              title: "3. Earn Real Cash", 
              desc: "Get KES commission for every verified student purchase.", 
              icon: DollarSign,
              color: "bg-emerald-50 text-emerald-600"
            }
          ].map((step, i) => (
            <div key={i} className="p-8 rounded-[2rem] border border-gray-100 bg-white shadow-sm transition-all group">
              <div className={`h-12 w-12 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <step.icon size={24} />
              </div>
              <h3 className="font-logo font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <button
            onClick={handleRegister}
            disabled={registering}
            className="group inline-flex items-center gap-3 rounded-[1.5rem] bg-black px-12 py-5 text-lg font-bold text-white shadow-2xl hover:bg-gray-800 transition-all active:scale-95 disabled:opacity-50"
          >
            {registering ? <Loader2 size={24} className="animate-spin" /> : (
              <>
                Join the Program
                <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Total Earned", value: `KES ${profile.total_earnings}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Pending", value: `KES ${profile.pending_earnings}`, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Direct Clicks", value: "—", icon: TrendingUp, color: "text-[#8484F6]", bg: "bg-[#8484F6]/5" },
    { label: "Sales Made", value: profile.recent_sales?.length || "0", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <h1 className="text-3xl font-black tracking-tight text-gray-900 font-logo">Influencer Dashboard</h1>
             <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Active Partner</span>
           </div>
           <p className="text-sm text-gray-400 font-medium">Hello {user?.firstName}, you're helping <span className="text-black">3 student ventures</span> grow today.</p>
        </div>
        <button 
           onClick={copyRefLink}
           className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-sm font-bold text-white hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
           {copied ? <Check size={18} /> : <Copy size={18} />}
           {copied ? "Link Copied" : "Copy Global Referral Link"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all">
             <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={24} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
             <p className="text-2xl font-black text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* Earnings & Recent Sales */}
         <div className="lg:col-span-2 space-y-6">
            <div className="rounded-[2rem] bg-white border border-gray-100 p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-lg font-black text-gray-900 font-logo uppercase tracking-tighter">Your Conversion History</h2>
                  <div className="flex items-center gap-2 text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                     <TrendingUp size={12} />
                     Real-time Data
                  </div>
               </div>

               {!profile.recent_sales || profile.recent_sales.length === 0 ? (
                 <div className="py-20 text-center border-2 border-dashed border-gray-50 rounded-3xl">
                    <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mx-auto mb-4">
                      <Clock size={28} />
                    </div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">No sales attributed yet</p>
                    <p className="text-xs text-gray-300">Share your link to start earning commissions.</p>
                 </div>
               ) : (
                 <div className="space-y-4">
                    {profile.recent_sales.map((sale: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-gray-50/50 border border-gray-100 group hover:border-[#8484F6]/20 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-[#8484F6] shadow-sm">
                               <Sparkles size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-bold text-gray-900">Sale from {sale.shop_name}</p>
                               <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Ref: #SKL-{sale.order}</p>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-sm font-black text-emerald-600">+ KES {sale.commission_amount}</p>
                            <div className="flex items-center gap-1 justify-end mt-1">
                               <span className={`text-[9px] font-black uppercase tracking-tighter ${sale.status === 'COMPLETED' ? 'text-emerald-500' : 'text-amber-500'}`}>
                                  {sale.status}
                               </span>
                               {sale.status === 'COMPLETED' ? <CheckCircle2 size={10} className="text-emerald-500" /> : <Clock size={10} className="text-amber-500" />}
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               )}
            </div>
         </div>

         {/* Payout Information */}
         <div className="space-y-6">
            <div className="rounded-[2rem] bg-gray-900 text-white p-8 shadow-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-8 opacity-10">
                  <Rocket size={120} />
               </div>
               <h2 className="text-xl font-black font-logo mb-6 relative z-10">Payout Hub</h2>
               <div className="space-y-6 relative z-10">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Available Balance</p>
                     <p className="text-3xl font-black tracking-tighter">KES {profile.total_earnings}</p>
                  </div>
                  
                  <button className="w-full py-4 rounded-xl bg-sokoline-accent text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl">
                     Request M-Pesa Payout
                  </button>
                  
                  <div className="pt-4 space-y-3">
                     <div className="flex items-center gap-3 text-xs font-medium opacity-60">
                        <Check size={14} className="text-sokoline-accent" />
                        Min. payout: KES 500
                     </div>
                     <div className="flex items-center gap-3 text-xs font-medium opacity-60">
                        <Check size={14} className="text-sokoline-accent" />
                        Direct M-Pesa settlement
                     </div>
                  </div>
               </div>
            </div>

            <div className="rounded-[2rem] border border-gray-100 bg-white p-8 shadow-sm">
               <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6">Growth Tips</h2>
               <div className="space-y-6">
                  <div className="flex gap-4">
                     <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                        <TrendingUp size={16} />
                     </div>
                     <p className="text-xs font-medium text-gray-500 leading-relaxed">WhatsApp statuses drive the most conversions for student shoppers.</p>
                  </div>
                  <div className="flex gap-4">
                     <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                        <Sparkles size={16} />
                     </div>
                     <p className="text-xs font-medium text-gray-500 leading-relaxed">Promoting items under KES 1,000 has a 3x higher click-through rate.</p>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
