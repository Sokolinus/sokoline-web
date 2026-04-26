"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { fetchMyShop, getProducts, formatImageUrl } from "@/lib/api";
import { Product } from "@/lib/types";
import { Plus, Edit2, Trash2, ExternalLink, Package, Share2, Check } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useToast } from "@/components/providers/ToastProvider";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { toast } = useToast();
  const [copiedId, setCopiedId] = useState<number | null>(null);

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
  }, [isLoaded, isSignedIn, getToken]);

  const copyToClipboard = (slug: string, id: number) => {
    const url = `${window.location.origin}/products/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast("Link copied to clipboard! Ready for your status.", "success");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isLoaded || loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#8484F6]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground font-logo">Inventory</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Manage your listings and track stock levels.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={async () => {
              if (confirm("This will delete all your products that have no images. Proceed?")) {
                try {
                  const token = await getToken();
                  if (token) {
                    const res = await apiRequest("products/cleanup_products/", { method: "DELETE" }, token);
                    if (res.ok) {
                      toast("Cleanup successful!", "success");
                      window.location.reload();
                    } else {
                      toast("Cleanup failed.", "error");
                    }
                  }
                } catch (error) {
                  toast("Error during cleanup", "error");
                }
              }
            }}
            className="rounded-xl border-red-200 text-red-500 font-bold hover:bg-red-50 gap-2 h-10 px-4"
          >
            <Trash2 size={16} />
            Cleanup Items
          </Button>
          <Link 
            href="/dashboard/products/new" 
            className="bg-[#8484F6] hover:bg-[#7373e5] text-white font-bold rounded-xl h-10 px-6 shadow-md shadow-[#8484F6]/20 flex items-center justify-center gap-2 transition-all"
          >
            <Plus size={18} />
            Add Item
          </Link>
        </div>
      </div>

      {/* Table Section */}
      <Card className="shadow-sm border-zinc-100 rounded-2xl overflow-hidden">
        <CardContent className="p-0">
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
               <div className="h-12 w-12 rounded-lg bg-zinc-50 flex items-center justify-center text-zinc-400 mb-4 border border-zinc-100">
                 <Package size={24} />
               </div>
               <h2 className="text-base font-semibold text-foreground font-logo">No products found</h2>
               <p className="text-zinc-500 text-sm max-w-xs mt-1">Start by adding your first product to your shop.</p>
               <Link href="/dashboard/products/new" className="text-sokoline-accent mt-4 font-bold text-sm underline underline-offset-4">
                 Create product
               </Link>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-zinc-50/50 hover:bg-zinc-50/50 border-zinc-100">
                  <TableHead className="w-[300px] uppercase text-[10px] font-black tracking-widest text-zinc-400">Product</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Status</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-zinc-400">Inventory</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-zinc-400 text-right">Price</TableHead>
                  <TableHead className="uppercase text-[10px] font-black tracking-widest text-zinc-400 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} className="group transition-colors border-zinc-50 hover:bg-zinc-50/30">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg border border-zinc-100 overflow-hidden bg-white shrink-0">
                           {product.images?.[0] ? (
                              <Image src={formatImageUrl(product.images[0].image)} alt={product.name} fill className="object-cover" sizes="40px" />
                           ) : (
                             <div className="flex items-center justify-center h-full text-zinc-200"><Package size={16} /></div>
                           )}
                        </div>
                        <span className="text-sm font-bold text-zinc-900 group-hover:text-[#8484F6] transition-colors">{product.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                       <Badge variant={product.stock > 0 ? "default" : "secondary"} className={`font-bold shadow-none ${product.stock > 0 ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-50" : "bg-zinc-100 text-zinc-400 border-zinc-200"}`}>
                         {product.stock > 0 ? "Active" : "Out of Stock"}
                       </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-bold uppercase tracking-tight ${product.stock <= 5 ? "text-orange-600" : "text-zinc-400"}`}>
                        {product.stock} units
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-sm font-black text-zinc-900">KES {product.price}</span>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex items-center justify-end gap-1">
                          <button 
                            onClick={() => copyToClipboard(product.slug, product.id)}
                            title="Copy share link for status"
                            className={`p-2 rounded-xl transition-all ${copiedId === product.id ? "bg-emerald-50 text-emerald-600 shadow-inner" : "text-zinc-300 hover:bg-zinc-100 hover:text-zinc-600"}`}
                          >
                             {copiedId === product.id ? <Check size={16} strokeWidth={3} /> : <Share2 size={16} strokeWidth={2.5} />}
                          </button>
                          <Link 
                            href={`/products/${product.slug}`} 
                            target="_blank" 
                            title="View on site"
                            className="p-2 rounded-xl text-zinc-300 hover:bg-zinc-100 hover:text-zinc-600 transition-all"
                          >
                             <ExternalLink size={16} strokeWidth={2.5} />
                          </Link>
                       </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
