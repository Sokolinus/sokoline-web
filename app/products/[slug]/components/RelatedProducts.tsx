"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from "@/lib/types";
import { getRelatedProducts } from "@/lib/api";
import { ShoppingBag } from "lucide-react";

interface RelatedProductsProps {
  productId: number;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      setLoading(true);
      const data = await getRelatedProducts(productId);
      setProducts(data);
      setLoading(false);
    };
    fetchRelated();
  }, [productId]);

  if (products.length === 0 && !loading) return null;

  return (
    <section className="max-w-7xl mx-auto py-40 px-6 md:px-10">
      <div className="flex flex-col items-center text-center mb-24">
        <h2 className="text-5xl font-black tracking-tighter text-foreground uppercase">Vibe match</h2>
        <p className="text-zinc-500 mt-4 font-medium text-lg max-w-sm">Curated items similar to what you're seeing now.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-zinc-100 rounded-[48px] mb-6" />
              <div className="h-4 w-2/3 bg-zinc-100 rounded-full mb-3" />
              <div className="h-6 w-1/3 bg-zinc-100 rounded-full" />
            </div>
          ))
        ) : (
          products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[48px] bg-muted border border-zinc-100 mb-8 transition-all duration-700 group-hover:shadow-2xl group-hover:shadow-purple-100 group-hover:-translate-y-1">
                {product.images?.[0] ? (
                  <Image 
                    src={product.images[0].image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-700" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-300">
                    <ShoppingBag size={48} className="group-hover:scale-110 transition-transform" />
                  </div>
                )}
                {product.is_on_sale && (
                  <div className="absolute top-6 left-6 bg-sokoline-accent text-white text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                    Sale
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-foreground group-hover:text-sokoline-accent transition-colors line-clamp-1 uppercase tracking-tight">
                {product.name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-black text-foreground">
                  ${product.discount_price || product.price}
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
