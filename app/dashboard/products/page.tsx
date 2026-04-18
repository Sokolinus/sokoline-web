"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, getProducts } from "@/lib/api";
import { Product } from "@/lib/types";
import { Plus, Edit2, Trash2, ExternalLink, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const token = await getToken();
        if (token) {
          const shop = await fetchMyShop(token);
          if (shop) {
            const data = await getProducts({ shop: shop.slug });
            setProducts(data);
          }
        }
      } catch (error) {
        console.error("Failed to load inventory:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded && isSignedIn) {
      loadInventory();
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7C3AED]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] uppercase">Inventory</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-4 text-lg font-medium">
            Manage your listings, update stock, and control your store.
          </p>
        </div>
        <button className="bg-[#7C3AED] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:bg-[#6D28D9] transition-all shadow-xl shadow-purple-100 dark:shadow-none active:scale-95">
          <Plus size={18} />
          New Product
        </button>
      </div>

      {/* Table / Grid */}
      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[48px] text-center">
           <div className="h-20 w-20 rounded-3xl bg-zinc-50 flex items-center justify-center text-zinc-300 mb-8">
             <Package size={40} />
           </div>
           <h2 className="text-2xl font-bold text-[#1A1A1A] dark:text-[#FBFBFB] uppercase mb-2">No products yet</h2>
           <p className="text-zinc-500 max-w-xs font-medium mb-8">Ready to start selling? List your first student venture product today.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#0A0A0A] border border-zinc-100 dark:border-zinc-800 rounded-[40px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-50 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/30">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Product</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Price</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Stock</th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50 dark:divide-zinc-900">
                {products.map((product) => (
                  <tr key={product.id} className="group hover:bg-zinc-50/50 dark:hover:bg-zinc-900/20 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative h-16 w-16 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
                           {product.images?.[0] ? (
                             <Image src={product.images[0].image} alt={product.name} fill className="object-cover" />
                           ) : (
                             <div className="flex items-center justify-center h-full text-zinc-300"><Package size={24} /></div>
                           )}
                        </div>
                        <div>
                          <p className="font-bold text-[#1A1A1A] dark:text-[#FBFBFB] uppercase text-sm">{product.name}</p>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{product.category?.name || "General"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-[#1A1A1A] dark:text-[#FBFBFB]">${product.price}</span>
                      {product.is_on_sale && <span className="ml-2 text-[10px] font-black text-[#7C3AED] uppercase italic">Sale</span>}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`h-1.5 w-1.5 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-500"}`} />
                        <span className="text-sm font-bold text-zinc-500">{product.stock} units</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/products/${product.slug}`} className="p-2 rounded-xl text-zinc-400 hover:text-[#7C3AED] hover:bg-[#F5F3FF] transition-all">
                             <ExternalLink size={18} />
                          </Link>
                          <button className="p-2 rounded-xl text-zinc-400 hover:text-[#7C3AED] hover:bg-[#F5F3FF] transition-all">
                             <Edit2 size={18} />
                          </button>
                          <button className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 transition-all">
                             <Trash2 size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
