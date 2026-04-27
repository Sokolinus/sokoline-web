"use client";

import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { apiRequest, getShops, formatImageUrl } from "@/lib/api";
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
  Gift,
  FileText,
  ShieldCheck,
  Store
} from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Shop } from "@/lib/types";

export default function InfluencerDashboard() {
  const { user } = useUser();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<any>(null);
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setIsRegistering] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showContract, setShowContract] = useState(false);

  const fetchProfileAndShops = async () => {
    try {
      const token = await getToken();
      if (token) {
        // Fetch profile
        const profRes = await apiRequest("influencer/my_profile/", {}, token);
        if (profRes.ok) {
          const profData = await profRes.json();
          setProfile(profData);
        }

        // Fetch available shops for the marketplace
        const allShops = await getShops();
        setShops(allShops);
      }
    } catch (error) {
      console.error("Failed to load influencer data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      fetchProfileAndShops();
    }
  }, [isLoaded, isSignedIn, getToken]);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      const token = await getToken();
      if (token) {
        const res = await apiRequest("influencer/register/", {
          method: "POST",
          body: JSON.stringify({ 
            referral_code: user?.username || `user_${user?.id}`,
            terms_accepted: true 
          })
        }, token);
        
        if (res.ok) {
          toast("Contract Signed! Welcome to the squad.", "success");
          fetchProfileAndShops();
        } else {
          toast("Registration failed.", "error");
        }
      }
    } catch (error) {
      toast("An error occurred.", "error");
    } finally {
      setIsRegistering(false);
    }
  };

  const copyRefLink = (shopSlug?: string) => {
    if (!profile) return;
    const baseUrl = window.location.origin;
    const url = shopSlug 
      ? `${baseUrl}/shops/${shopSlug}?ref=${profile.referral_code}`
      : `${baseUrl}/?ref=${profile.referral_code}`;
    
    navigator.clipboard.writeText(url);
    toast("Link copied to clipboard!", "success");
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-[#8484F6]" size={32} />
      </div>
    );
  }

  // STEP 1: HIGH-IMPACT ONBOARDING
  if (!profile && !showContract) {
    return (
      <div className="max-w-6xl mx-auto py-6 md:py-12">
        <div className="bg-white rounded-[3rem] border border-black/5 overflow-hidden shadow-2xl shadow-black/5 grid grid-cols-1 lg:grid-cols-2">
          
          {/* Left: Content */}
          <div className="p-10 md:p-20 flex flex-col justify-center">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-sokoline-accent/10 text-sokoline-accent mb-8">
              <Sparkles size={24} />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter font-logo leading-[0.9] uppercase mb-8">
              Turn your<br />Influence<br />into Income.
            </h1>
            
            <div className="space-y-6 mb-12">
              <div className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-[#BEFDB1] flex items-center justify-center shrink-0 mt-1">
                  <Check size={12} strokeWidth={4} />
                </div>
                <div>
                  <h4 className="font-logo font-bold text-gray-900 uppercase text-xs tracking-widest">Affiliate for Students</h4>
                  <p className="text-sm text-gray-400 font-medium">Promote your friends' shops and earn a cut of every sale. No products needed.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-[#BEFDB1] flex items-center justify-center shrink-0 mt-1">
                  <Check size={12} strokeWidth={4} />
                </div>
                <div>
                  <h4 className="font-logo font-bold text-gray-900 uppercase text-xs tracking-widest">Global Tracking</h4>
                  <p className="text-sm text-gray-400 font-medium">Share one link. If they buy from ANY shop during that session, you get the credit.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-6 w-6 rounded-full bg-[#BEFDB1] flex items-center justify-center shrink-0 mt-1">
                  <Check size={12} strokeWidth={4} />
                </div>
                <div>
                  <h4 className="font-logo font-bold text-gray-900 uppercase text-xs tracking-widest">Smart Commissions</h4>
                  <p className="text-sm text-gray-400 font-medium">Our system automatically splits commissions across multiple shops in a single cart.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowContract(true)}
              className="group w-full md:w-fit inline-flex items-center justify-center gap-3 rounded-[1.5rem] bg-black px-12 py-5 text-lg font-bold text-white shadow-2xl hover:bg-gray-800 transition-all active:scale-95"
            >
              Start Partnership
              <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right: Visual */}
          <div className="relative hidden lg:block bg-gray-50 min-h-[600px]">
             <Image 
                src="/social-media.jpg" 
                alt="Social Media Growth" 
                fill 
                className="object-cover"
                priority
             />
             <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent opacity-40" />
          </div>
        </div>

        <div className="mt-12 text-center text-[10px] font-black uppercase tracking-[0.3em] text-black/20">
          Sokoline Social Partner Program &copy; 2026
        </div>
      </div>
    );
  }

  // STEP 2: THE CONTRACT
  if (!profile && showContract) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6">
         <button onClick={() => setShowContract(false)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 hover:text-black mb-8 transition-colors">
            <ArrowLeft size={14} /> Back
         </button>
         
         <div className="rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl overflow-hidden">
            <div className="px-10 py-10 bg-zinc-900 text-white flex items-center justify-between">
               <div>
                  <h1 className="text-2xl font-black font-logo uppercase tracking-tighter">Affiliate Contract</h1>
                  <p className="text-xs font-bold text-white/40 uppercase tracking-widest mt-1">Sokoline Partner Program v1.0</p>
               </div>
               <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center">
                  <ShieldCheck size={32} className="text-sokoline-accent" />
               </div>
            </div>

            <div className="p-10 space-y-8 max-h-[400px] overflow-y-auto font-sans text-sm leading-relaxed text-gray-600 border-b border-gray-50">
               <div className="space-y-4">
                  <h3 className="text-black font-bold uppercase text-xs tracking-widest">1. Engagement</h3>
                  <p>By clicking "Accept," you agree to represent student ventures on the Sokoline platform as an independent social partner. You are not an employee of Sokoline or the individual vendors.</p>
               </div>
               <div className="space-y-4">
                  <h3 className="text-black font-bold uppercase text-xs tracking-widest">2. Commissions</h3>
                  <p>Partners are entitled to a percentage-based commission (default 5%) on successful sales attributed to their unique referral code. Commissions are only finalized after a 48-hour "Grace Period" following order fulfillment.</p>
               </div>
               <div className="space-y-4">
                  <h3 className="text-black font-bold uppercase text-xs tracking-widest">3. Promotion Rules</h3>
                  <p>Partners must not engage in spam, deceptive advertising, or represent products in a way that violates university policy. Payouts may be withheld for fraudulent traffic.</p>
               </div>
               <div className="space-y-4">
                  <h3 className="text-black font-bold uppercase text-xs tracking-widest">4. Session Tracking</h3>
                  <p>When a student clicks your link, a 24-hour tracking cookie is placed. You receive commission for the entire cart, even if it contains products from multiple different shops.</p>
               </div>
               <div className="space-y-4">
                  <h3 className="text-black font-bold uppercase text-xs tracking-widest">5. Payment</h3>
                  <p>Earnings will be settled directly to your registered M-Pesa number upon request, provided the balance exceeds KES 500.</p>
               </div>
            </div>

            <div className="p-10 bg-gray-50 flex flex-col items-center gap-6">
               <div className="flex items-center gap-3">
                  <div className="h-4 w-4 rounded bg-[#BEFDB1] flex items-center justify-center">
                     <Check size={10} className="text-black" strokeWidth={4} />
                  </div>
                  <span className="text-xs font-bold text-gray-900">I have read and agree to the Sokoline Partnership Terms.</span>
               </div>
               <button
                  onClick={handleRegister}
                  disabled={registering}
                  className="w-full py-5 rounded-[1.5rem] bg-black text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-zinc-800 transition-all active:scale-95 disabled:opacity-50"
               >
                  {registering ? <Loader2 size={20} className="animate-spin" /> : "Sign & Accept Contract"}
               </button>
            </div>
         </div>
      </div>
    );
  }

  // STEP 3: THE LIVE DASHBOARD
  const stats = [
    { label: "Total Earned", value: `KES ${profile.total_earnings}`, icon: DollarSign, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Grace Period", value: `KES ${profile.pending_earnings}`, icon: Clock, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Active Links", value: shops.length.toString(), icon: Store, color: "text-[#8484F6]", bg: "bg-[#8484F6]/5" },
    { label: "Conversions", value: profile.recent_sales?.length || "0", icon: TrendingUp, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="space-y-10 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
             <h1 className="text-3xl font-black tracking-tight text-gray-900 font-logo uppercase">Partner Dashboard</h1>
             <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Verified Ambassador</span>
           </div>
           <p className="text-sm text-gray-400 font-medium tracking-tight">Your referral handle: <span className="text-black font-black">@{profile.referral_code}</span></p>
        </div>
        <button 
           onClick={() => copyRefLink()}
           className="flex items-center gap-2 rounded-xl bg-black px-6 py-3 text-xs font-black uppercase tracking-[0.1em] text-white hover:bg-zinc-800 transition-all shadow-lg active:scale-95"
        >
           <Copy size={16} />
           Global Invite Link
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-all">
             <div className={`h-12 w-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                <stat.icon size={20} />
             </div>
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1">{stat.label}</p>
             <p className="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         {/* CAMPAIGN MARKETPLACE */}
         <div className="lg:col-span-2 space-y-8">
            <div className="rounded-[2.5rem] bg-white border border-gray-100 p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-gray-900 font-logo uppercase tracking-tighter">Available Campaigns</h2>
                  <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-100">Live Payouts</span>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {shops.map((shop) => (
                    <div key={shop.id} className="p-6 rounded-2xl bg-gray-50 border border-gray-100 group hover:border-black/10 transition-all flex flex-col justify-between">
                       <div className="space-y-4">
                          <div className="flex justify-between items-start">
                             <div className="h-12 w-12 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-zinc-300 overflow-hidden">
                                {shop.logo ? (
                                  <img src={formatImageUrl(shop.logo)} className="h-full w-full object-cover object-top" />
                                ) : (
                                  <Store size={20} strokeWidth={1.5} />
                                )}
                             </div>
                             <div className="text-right">
                                <span className="text-[10px] font-black text-[#8484F6] uppercase tracking-widest">Rate</span>
                                <p className="text-lg font-black text-gray-900">{(shop as any).affiliate_commission_rate}%</p>
                             </div>
                          </div>
                          <div>
                             <h4 className="text-base font-black text-gray-900 tracking-tight">{shop.name}</h4>
                             <p className="text-xs text-gray-400 font-medium line-clamp-1">{shop.description}</p>
                          </div>
                       </div>
                       
                       <div className="mt-6 flex items-center gap-2">
                          <button 
                             onClick={() => copyRefLink(shop.slug)}
                             className="flex-1 py-3 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest hover:bg-zinc-800 transition-all flex items-center justify-center gap-2"
                          >
                             <Copy size={12} /> Get Link
                          </button>
                          <Link href={`/shops/${shop.slug}`} target="_blank" className="p-3 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-black transition-all">
                             <ExternalLink size={14} />
                          </Link>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* RECENT SALES */}
            <div className="rounded-[2.5rem] bg-white border border-gray-100 p-8 shadow-sm">
               <h2 className="text-xl font-black text-gray-900 font-logo uppercase tracking-tighter mb-8">Performance History</h2>
               {!profile.recent_sales || profile.recent_sales.length === 0 ? (
                  <div className="py-12 text-center text-gray-300">
                     <p className="text-xs font-black uppercase tracking-widest">No attributed sales yet</p>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {profile.recent_sales.map((sale: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center text-[#8484F6]">
                                 <Sparkles size={18} />
                              </div>
                              <span className="text-sm font-bold text-gray-900">{sale.shop_name} Sale</span>
                           </div>
                           <span className="text-sm font-black text-emerald-600">+ KES {sale.commission_amount}</span>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </div>

         {/* Sidebar: Payouts */}
         <div className="space-y-6">
            <div className="rounded-[2.5rem] bg-gray-900 text-white p-10 shadow-2xl relative overflow-hidden">
               <h2 className="text-xl font-black font-logo uppercase mb-6 relative z-10">Payout Hub</h2>               <div className="space-y-6 relative z-10">
                  <div className="p-6 rounded-3xl bg-white/5 border border-white/10">
                     <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-3">Available for M-Pesa</p>
                     <p className="text-4xl font-black tracking-tighter">KES {profile.total_earnings}</p>
                  </div>
                  
                  <button className="w-full py-5 rounded-2xl bg-sokoline-accent text-black font-black text-xs uppercase tracking-widest hover:opacity-90 transition-all active:scale-95 shadow-xl">
                     Withdraw Funds
                  </button>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

function ArrowLeft(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
}

function ExternalLink(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    </svg>
  );
}
