"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, updateShop } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import { Shop } from "@/lib/types";
import { Save, Loader2, Store, ExternalLink, Phone, Hash } from "lucide-react";
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
    mpesa_phone: "",
    paybill_number: "",
  });

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
              mpesa_phone: data.mpesa_phone || "",
              paybill_number: data.paybill_number || "",
            });
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
        const updated = await updateShop(token, shop.id, formData);
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
        <Loader2 className="animate-spin text-gray-300" size={28} />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="h-14 w-14 rounded-2xl bg-violet-100 flex items-center justify-center text-violet-600 mb-5">
          <Store size={28} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No shop found</h2>
        <p className="text-gray-500 text-sm mb-6">You haven&apos;t created your shop yet.</p>
        <Link
          href="/dashboard/my-shop/new"
          className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
        >
          Create your shop
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Shop settings</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your storefront and payment details.</p>
        </div>
        <Link
          href={`/shops/${shop.slug}`}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-all shadow-sm"
          title="View shop"
        >
          <ExternalLink size={16} />
        </Link>
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
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                placeholder="Shop name"
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
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
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
                required
              />
            </div>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="rounded-2xl bg-white border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-800">Payment settings</h2>
            <p className="mt-0.5 text-xs text-gray-400">Where customers send M-Pesa payments.</p>
          </div>
          <div className="p-6 space-y-5">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
                <Phone size={11} />
                M-Pesa phone number
              </label>
              <input
                type="tel"
                value={formData.mpesa_phone}
                onChange={(e) => setFormData({ ...formData, mpesa_phone: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                placeholder="2547XXXXXXXX"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
                <Hash size={11} />
                Paybill number
              </label>
              <input
                type="text"
                value={formData.paybill_number}
                onChange={(e) => setFormData({ ...formData, paybill_number: e.target.value })}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-900 outline-none transition-all focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-100"
                placeholder="e.g. 522533"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-700 transition-all disabled:opacity-60 active:scale-95"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
