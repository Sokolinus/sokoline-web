"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { createShop } from "@/lib/api";
import { useShop } from "@/components/providers/ShopProvider";
import { useToast } from "@/components/providers/ToastProvider";
import { Store, Loader2, ArrowRight, Phone, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    mpesa_phone: "",
    paybill_number: "",
  });

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: slugEdited ? prev.slug : slugify(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getToken();
      if (token) {
        const shop = await createShop(token, formData);
        if (shop) {
          await refetchShop();
          toast("Shop created successfully!", "success");
          router.push(`/dashboard/my-shop/success?shop=${shop.slug}`);
        } else {
          setError("Failed to create shop. The URL handle might already be taken.");
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
    <div className="min-h-screen flex items-start justify-center py-16 px-6 bg-gray-50">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600 mb-5">
            <Store size={28} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create your shop</h1>
          <p className="mt-2 text-sm text-gray-500">
            Set up your storefront and payment details to start selling.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Shop Identity */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">Shop identity</h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Shop name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  placeholder="e.g. Campus Threads"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                  URL handle
                </label>
                <div className="flex items-center gap-2">
                  <span className="shrink-0 text-xs font-medium text-gray-400">sokoline/shops/</span>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => {
                      setSlugEdited(true);
                      setFormData({ ...formData, slug: e.target.value });
                    }}
                    className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                    placeholder="campus-threads"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-widest text-gray-400">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100 min-h-[110px] resize-none"
                  placeholder="Tell shoppers what your store is about..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Setup */}
          <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-sm font-semibold text-gray-800">Payment setup</h2>
              <p className="mt-0.5 text-xs text-gray-400">Customers will pay via M-Pesa. Add at least one option.</p>
            </div>
            <div className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  <Phone size={12} />
                  M-Pesa phone number
                </label>
                <input
                  type="tel"
                  value={formData.mpesa_phone}
                  onChange={(e) => setFormData({ ...formData, mpesa_phone: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  placeholder="2547XXXXXXXX"
                />
                <p className="text-[11px] text-gray-400">Format: 254700000000. Leave blank if using paybill.</p>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-300">
                <div className="flex-1 h-px bg-gray-100" />
                or
                <div className="flex-1 h-px bg-gray-100" />
              </div>

              <div className="space-y-1.5">
                <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                  <Hash size={12} />
                  Paybill number
                </label>
                <input
                  type="text"
                  value={formData.paybill_number}
                  onChange={(e) => setFormData({ ...formData, paybill_number: e.target.value })}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                  placeholder="e.g. 522533"
                />
                <p className="text-[11px] text-gray-400">Optional. Use if your business has a dedicated paybill.</p>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm font-medium text-red-600">
                  {error}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3">
            <Link
              href="/"
              className="flex-1 rounded-xl border border-gray-200 bg-white py-3 text-center text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </Link>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileTap={{ scale: 0.97 }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-all disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Launch shop
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
}
