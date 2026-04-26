"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, updateShop } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { Shop } from "@/lib/types";
import { 
  Save, 
  Loader2, 
  Store, 
  ExternalLink, 
  Phone, 
  Hash, 
  Plus, 
  Package, 
  TrendingUp, 
  Rocket, 
  ChevronRight,
  Info,
  MapPin,
  Check
} from "lucide-react";
import Link from "next/link";

export default function MyShopPage() {
  const [shop, setShop] = useState<Shop | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    payment_phone_number: "",
    paybill_number: "",
    pickup_point: "",
  });

  const [paymentType, setPaymentType] = useState<"phone" | "paybill">("phone");

  useEffect(() => {
    const loadShop = async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await fetchMyShop(token);
          if (data) {
            setShop(data);
            setFormData({
              name: data.name,
              description: data.description,
              slug: data.slug,
              payment_phone_number: data.payment_phone_number || "",
              paybill_number: data.paybill_number || "",
              pickup_point: (data as any).pickup_point || "",
            });
            if (data.paybill_number) setPaymentType("paybill");
          }
        }
      } catch (error) {
        console.error("Failed to load shop:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      loadShop();
    }
  }, [isLoaded, isSignedIn, getToken]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shop) return;

    setSaving(true);
    try {
      const token = await getToken();
      if (token) {
        // Clear the other field based on current selection
        const submissionData = {
          ...formData,
          paybill_number: paymentType === "paybill" ? formData.paybill_number : null,
          payment_phone_number: paymentType === "phone" ? formData.payment_phone_number : null,
        };

        const updated = await updateShop(token, shop.slug, submissionData);
        if (updated) {
          setShop(updated);
          toast("Shop settings saved.", "success");
        } else {
          toast("Failed to save settings.", "error");
        }
      }
    } catch (error) {
      console.error("Failed to update shop:", error);
      toast("Error saving settings.", "error");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="animate-spin text-[#8484F6]" size={28} />
      </div>
    );
  }

  // ONBOARDING SCREEN
  if (!shop) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-6">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-[#8484F6]/10 text-[#8484F6] mb-4">
            <Rocket size={40} strokeWidth={1.5} />
          </div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight font-logo">Ready to launch?</h1>
          <p className="text-lg text-gray-500 font-medium max-w-lg mx-auto leading-relaxed">
            Your shop is the gateway to student shoppers. Set it up in 3 minutes and start selling today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { 
              title: "1. Brand Identity", 
              desc: "Give your shop a name and a catchy bio.", 
              icon: Store,
              color: "bg-blue-50 text-blue-600"
            },
            { 
              title: "2. Payments", 
              desc: "Tell us where to send your student sales.", 
              icon: Hash,
              color: "bg-emerald-50 text-emerald-600"
            },
            { 
              title: "3. Inventory", 
              desc: "Add your first items and go live instantly.", 
              icon: Package,
              color: "bg-violet-50 text-violet-600"
            }
          ].map((step, i) => (
            <div key={i} className="p-8 rounded-[2rem] border border-gray-100 bg-white shadow-sm hover:shadow-xl hover:shadow-black/5 transition-all group">
              <div className={`h-12 w-12 rounded-2xl ${step.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <step.icon size={24} />
              </div>
              <h3 className="font-logo font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-6">
          <Link
            href="/dashboard/my-shop/new"
            className="group inline-flex items-center gap-3 rounded-[1.5rem] bg-sokoline-accent px-12 py-5 text-lg font-bold text-white shadow-2xl shadow-sokoline-accent/25 hover:bg-[#7373e5] transition-all active:scale-95"
          >
            Create My Shop
            <ChevronRight size={20} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/" className="text-sm font-bold text-gray-400 hover:text-sokoline-accent transition-colors">
            Maybe later
          </Link>
        </div>
      </div>
    );
  }

  // SHOP DASHBOARD (IF EXISTS)
  return (
    <div className="space-y-10 pb-20">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-black tracking-tight text-gray-900 font-logo">{shop.name}</h1>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100">Live</span>
          </div>
          <p className="text-sm text-gray-400 font-medium">Storefront URL: <span className="text-sokoline-accent">sokoline.app/shops/{shop.slug}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm"
          >
            <TrendingUp size={18} />
            View Analytics
          </Link>
          <Link
            href={`/shops/${shop.slug}`}
            target="_blank"
            className="flex items-center gap-2 rounded-xl bg-sokoline-accent px-5 py-3 text-sm font-bold text-white hover:bg-[#7373e5] transition-all shadow-lg shadow-sokoline-accent/20"
          >
            <ExternalLink size={18} />
            Visit Shop
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Main Products Control */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-[2rem] bg-white border border-gray-100 p-8 shadow-sm">
             <div className="flex items-center justify-between mb-8">
               <h2 className="text-lg font-black text-gray-900 font-logo uppercase tracking-tighter">Your Inventory</h2>
               <Link 
                href="/dashboard/products/new"
                className="flex items-center gap-2 rounded-xl bg-[#8484F6] px-4 py-2 text-xs font-black text-white hover:bg-[#7373e5] transition-all uppercase tracking-widest"
               >
                 <Plus size={14} strokeWidth={3} />
                 Add Product
               </Link>
             </div>
             
             {(!shop.products || shop.products.length === 0) ? (
               <div className="py-20 text-center border-2 border-dashed border-gray-50 rounded-3xl">
                  <div className="h-14 w-14 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 mx-auto mb-4">
                    <Package size={28} />
                  </div>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">No products listed</p>
                  <p className="text-xs text-gray-300">Add your first item to start receiving orders.</p>
               </div>
             ) : (
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {shop.products.slice(0, 4).map((product: any) => (
                    <div key={product.id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-50 bg-gray-50/30 group hover:border-[#8484F6]/20 transition-all">
                       <div className="h-16 w-16 rounded-xl bg-white border border-gray-100 overflow-hidden relative shrink-0">
                          {product.images?.[0] ? (
                            <img src={product.images[0].image} alt="" className="object-cover h-full w-full" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-200">
                               <Package size={24} />
                            </div>
                          )}
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                          <p className="text-xs font-black text-[#8484F6] mt-0.5 uppercase">KES {product.price}</p>
                       </div>
                    </div>
                 ))}
                 {(shop.products?.length ?? 0) > 4 && (
                   <Link href="/dashboard/products" className="sm:col-span-2 py-3 text-center text-xs font-black uppercase tracking-widest text-gray-300 hover:text-[#8484F6] transition-colors">
                     View all {shop.products?.length} products
                   </Link>
                 )}
               </div>
             )}
          </div>

          {/* User Journey / Steps Summary */}
          <div className="p-8 rounded-[2rem] bg-gradient-to-br from-gray-800 to-gray-900 text-white shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
                <Rocket size={120} />
             </div>
             <h2 className="text-xl font-black font-logo mb-6 relative z-10">Launch Checklist</h2>
             <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4">
                   <div className="h-6 w-6 rounded-full bg-sokoline-accent flex items-center justify-center text-black">
                      <Check size={14} strokeWidth={3} />
                   </div>
                   <span className="text-sm font-bold opacity-90">Shop Created</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className={`h-6 w-6 rounded-full flex items-center justify-center text-black ${(shop.products?.length ?? 0) > 0 ? "bg-sokoline-accent" : "bg-white/10 text-white/40"}`}>
                      {(shop.products?.length ?? 0) > 0 ? <Check size={14} strokeWidth={3} /> : <span className="text-[10px] font-black">2</span>}
                   </div>
                   <span className={`text-sm font-bold ${(shop.products?.length ?? 0) > 0 ? "opacity-90" : "opacity-40"}`}>List first product</span>
                </div>
                <div className="flex items-center gap-4">
                   <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center text-white/40">
                      <span className="text-[10px] font-black">3</span>
                   </div>
                   <span className="text-sm font-bold opacity-40">Accept your first order</span>
                </div>
             </div>
          </div>
        </div>

        {/* Sidebar: Settings */}
        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="rounded-[2rem] bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 font-logo">Shop Identity</h2>
              
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Shop Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-[#8484F6] transition-all"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Pickup Point</label>
                  </div>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300">
                      <MapPin size={14} />
                    </div>
                    <input
                      type="text"
                      value={formData.pickup_point}
                      onChange={(e) => setFormData({ ...formData, pickup_point: e.target.value })}
                      className="w-full rounded-xl border border-gray-100 bg-gray-50 pl-10 pr-4 py-3 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-[#8484F6] transition-all"
                      placeholder="e.g. Student Centre"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Shop URL</label>
                    <div className="group relative">
                      <Info size={12} className="text-gray-300" />
                      <div className="absolute bottom-full right-0 mb-2 w-48 p-3 rounded-xl bg-gray-900 text-[10px] text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        This is your unique web address. Only use lowercase letters, numbers, and hyphens.
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-[#8484F6] transition-all"
                      placeholder="my-shop-url"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400">Bio</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-[#8484F6] transition-all min-h-[100px] resize-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[2rem] bg-white border border-gray-100 p-8 shadow-sm">
              <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-6 font-logo">Payout Method</h2>
              
              <div className="flex gap-2 p-1 bg-gray-50 rounded-xl mb-6">
                <button
                  type="button"
                  onClick={() => setPaymentType("phone")}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${paymentType === "phone" ? "bg-white text-black shadow-sm" : "text-gray-400"}`}
                >
                  Phone
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentType("paybill")}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${paymentType === "paybill" ? "bg-white text-black shadow-sm" : "text-gray-400"}`}
                >
                  Paybill
                </button>
              </div>

              {paymentType === "phone" ? (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                  <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Phone size={10} />
                    M-Pesa Number
                  </label>
                  <input
                    type="tel"
                    value={formData.payment_phone_number}
                    onChange={(e) => setFormData({ ...formData, payment_phone_number: e.target.value })}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-[#8484F6] transition-all"
                    placeholder="2547XXXXXXXX"
                  />
                </div>
              ) : (
                <div className="space-y-1.5 animate-in fade-in slide-in-from-top-1">
                  <label className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400">
                    <Hash size={10} />
                    Paybill Number
                  </label>
                  <input
                    type="text"
                    value={formData.paybill_number}
                    onChange={(e) => setFormData({ ...formData, paybill_number: e.target.value })}
                    className="w-full rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:bg-white focus:border-[#8484F6] transition-all"
                    placeholder="e.g. 522533"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-sokoline-accent py-4 text-xs font-black uppercase tracking-[0.2em] text-white hover:bg-[#7373e5] transition-all disabled:opacity-60 active:scale-95 shadow-xl shadow-sokoline-accent/20"
            >
              {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
