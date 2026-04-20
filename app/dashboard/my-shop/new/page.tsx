"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { createShop, getCategories } from "@/lib/api";
import { useShop } from "@/components/providers/ShopProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Category } from "@/lib/types";
import { Store, Loader2, ArrowRight, ArrowLeft, Phone, Hash, Check, Upload, X, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function CreateShopPage() {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { refetchShop } = useShop();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    category: "",
    phone_number: "",
    paybill_number: "",
    logo: null as File | null,
  });

  const [paymentType, setPaymentType] = useState<"phone" | "paybill">("phone");

  useEffect(() => {
    const loadCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };
    loadCategories();
  }, []);

  const requirements = [
    { 
      step: 1, 
      title: "Shop Identity", 
      desc: "Basic info about your brand.",
      items: ["Shop Name", "Category", "Brief Pitch/Bio"]
    },
    { 
      step: 2, 
      title: "Operations & Setup", 
      desc: "How you'll run your venture.",
      items: ["Shop Logo (Optional)", "Phone OR Paybill Number"]
    }
  ];

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugEdited ? prev.slug : slugify(value),
    }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData({ ...formData, logo: null });
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validateStep1 = () => {
    if (!formData.name.trim() || !formData.description.trim() || !formData.category) {
      setError("Name, description, and category are required.");
      return false;
    }
    setError(null);
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      if (token) {
        const data = new FormData();
        data.append("name", formData.name);
        data.append("description", formData.description);
        data.append("category", formData.category);
        data.append("slug", formData.slug);
        
        if (paymentType === "phone" && formData.phone_number) {
          data.append("phone_number", formData.phone_number);
        } else if (paymentType === "paybill" && formData.paybill_number) {
          data.append("paybill_number", formData.paybill_number);
        }

        if (formData.logo) {
          data.append("logo", formData.logo);
        }

        const shop = await createShop(token, data);
        if (shop) {
          await refetchShop();
          toast("Shop created successfully!", "success");
          router.push(`/dashboard/my-shop/success?shop=${shop.slug}`);
        } else {
          setError("Failed to create shop. Please check your details and try again.");
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "An error occurred.";
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded || !isSignedIn) return null;

  return (
    <div className="min-h-screen flex items-center justify-center py-20 px-6 bg-white font-sans text-black">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
        
        {/* Left Column: Information & Progress */}
        <div className="lg:col-span-2 space-y-12">
          <div>
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-sokoline-accent text-black mb-8">
              <Store size={32} />
            </div>
            <h1 className="text-5xl font-black tracking-tighter font-logo leading-tight mb-4 text-black">
              Launch Your<br />Campus Shop
            </h1>
            <p className="text-xl text-black/50 font-medium">
              Join the student-led economy. Follow these simple steps to go live.
            </p>
          </div>

          <div className="space-y-8">
            {requirements.map((req) => (
              <div key={req.step} className="flex gap-6">
                <div className={`flex-shrink-0 w-10 h-10 rounded-full border-2 flex items-center justify-center font-logo font-bold transition-all ${
                  step === req.step 
                    ? "border-black bg-black text-white shadow-xl" 
                    : step > req.step 
                      ? "border-sokoline-accent bg-sokoline-accent text-black"
                      : "border-black/5 bg-gray-50 text-black/20"
                }`}>
                  {step > req.step ? <Check size={18} strokeWidth={3} /> : req.step}
                </div>
                <div>
                  <h3 className={`font-logo font-bold text-lg ${step === req.step ? "text-black" : "text-black/40"}`}>
                    {req.title}
                  </h3>
                  <p className="text-sm text-black/40 mb-3">{req.desc}</p>
                  <ul className="flex flex-wrap gap-2">
                    {req.items.map((item, i) => (
                      <li key={i} className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border transition-all ${
                        step === req.step ? "border-black/10 text-black/60" : "border-black/5 text-black/20"
                      }`}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 rounded-3xl bg-gray-50 border border-black/5 space-y-4">
            <h4 className="font-logo font-bold text-sm uppercase tracking-widest text-black/60">Preparation</h4>
            <p className="text-sm text-black/40 leading-relaxed">
              Make sure you have your **M-Pesa details** ready and a **high-quality logo** (square format works best) to make your storefront stand out.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="lg:col-span-3 bg-white p-2 md:p-10 border border-black/5 rounded-[40px] shadow-2xl shadow-black/5">
          <form onSubmit={handleSubmit} className="space-y-10">
            <AnimatePresence mode="wait">
              {step === 1 ? (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 font-logo">
                        What's your shop called?
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleNameChange(e.target.value)}
                        className="w-full rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 text-lg font-bold text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-8 focus:ring-black/5"
                        placeholder="e.g. Campus Threads"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 font-logo">
                        Which category fits best?
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 text-lg font-bold text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-8 focus:ring-black/5 appearance-none cursor-pointer"
                        required
                      >
                        <option value="" disabled>Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.name}>{cat.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 font-logo">
                        Short Bio / Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 text-lg font-bold text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-8 focus:ring-black/5 min-h-[160px] resize-none"
                        placeholder="Tell shoppers why they should buy from you..."
                        required
                      />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  {/* Logo Upload */}
                  <div className="space-y-4">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 font-logo text-center">
                      Visual Identity (Optional)
                    </label>
                    <div 
                      onClick={() => !logoPreview && fileInputRef.current?.click()}
                      className={`relative h-40 w-40 mx-auto rounded-[40px] border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden group ${
                        logoPreview ? "border-black border-solid" : "border-black/10 hover:border-black/20 bg-gray-50"
                      }`}
                    >
                      {logoPreview ? (
                        <>
                          <Image src={logoPreview} alt="Preview" fill className="object-cover" sizes="160px" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeLogo(); }}
                              className="p-3 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl"
                            >
                              <X size={20} />
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={32} className="text-black/20 mb-3" />
                          <span className="text-[10px] font-black text-black/30 uppercase tracking-widest">Add Logo</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleLogoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 font-logo text-center">
                        Choose your payout method
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <button
                          type="button"
                          onClick={() => setPaymentType("phone")}
                          className={`p-8 rounded-[30px] border transition-all text-left flex flex-col gap-4 ${
                            paymentType === "phone" 
                              ? "border-black bg-black text-white shadow-2xl scale-[1.05]" 
                              : "border-black/5 bg-gray-50 text-black/40 hover:border-black/10"
                          }`}
                        >
                          <Phone size={24} />
                          <div>
                            <p className="font-logo font-bold text-sm uppercase tracking-wider">Phone</p>
                            <p className="text-[10px] opacity-60 uppercase font-bold mt-1 tracking-widest">STK Pushes</p>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPaymentType("paybill")}
                          className={`p-8 rounded-[30px] border transition-all text-left flex flex-col gap-4 ${
                            paymentType === "paybill" 
                              ? "border-black bg-black text-white shadow-2xl scale-[1.05]" 
                              : "border-black/5 bg-gray-50 text-black/40 hover:border-black/10"
                          }`}
                        >
                          <Hash size={24} />
                          <div>
                            <p className="font-logo font-bold text-sm uppercase tracking-wider">Paybill</p>
                            <p className="text-[10px] opacity-60 uppercase font-bold mt-1 tracking-widest">Business</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-black/5">
                      {paymentType === "phone" ? (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 font-logo">
                            Personal phone (2547...)
                          </label>
                          <input
                            type="tel"
                            value={formData.phone_number}
                            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                            className="w-full rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 text-lg font-bold text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-8 focus:ring-black/5"
                            placeholder="2547XXXXXXXX"
                          />
                        </div>
                      ) : (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-4">
                          <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 font-logo">
                            Business till or paybill
                          </label>
                          <input
                            type="text"
                            value={formData.paybill_number}
                            onChange={(e) => setFormData({ ...formData, paybill_number: e.target.value })}
                            className="w-full rounded-2xl border border-black/5 bg-gray-50 px-6 py-5 text-lg font-bold text-gray-900 outline-none transition-all focus:border-black focus:bg-white focus:ring-8 focus:ring-black/5"
                            placeholder="e.g. 522533"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-red-50 border border-red-100 px-6 py-5 text-xs font-black text-red-600 font-logo uppercase tracking-widest text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-6">
              {step === 1 ? (
                <>
                  <Link
                    href="/dashboard"
                    className="flex-1 rounded-[24px] border border-black/5 bg-white py-6 text-center text-[10px] font-black text-black/40 hover:bg-gray-50 transition-colors font-logo uppercase tracking-[0.2em]"
                  >
                    Cancel
                  </Link>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="flex-[2] flex items-center justify-center gap-3 rounded-[24px] bg-black py-6 text-[10px] font-black text-white hover:bg-black/90 transition-all shadow-2xl font-logo uppercase tracking-[0.2em]"
                  >
                    Next Step
                    <ArrowRight size={16} strokeWidth={3} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="flex-1 flex items-center justify-center gap-3 rounded-[24px] border border-black/5 bg-white py-6 text-[10px] font-black text-black/40 hover:bg-gray-50 transition-colors font-logo uppercase tracking-[0.2em]"
                  >
                    <ArrowLeft size={16} strokeWidth={3} />
                    Back
                  </button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.97 }}
                    className="flex-[2] flex items-center justify-center gap-3 rounded-[24px] bg-sokoline-accent py-6 text-[10px] font-black text-black hover:opacity-90 transition-all shadow-2xl font-logo uppercase tracking-[0.2em]"
                  >
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      <>
                        Launch shop
                        <Check size={20} strokeWidth={3} />
                      </>
                    )}
                  </motion.button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
