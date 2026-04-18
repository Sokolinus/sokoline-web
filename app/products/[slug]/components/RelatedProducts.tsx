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
    <section className="max-w-7xl mx-auto py-32 px-6 md:px-10">
      <div className="flex flex-col items-center text-center mb-16">
        <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] uppercase">You might also like</h2>
        <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Curated recommendations based on your selection.</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[4/5] bg-zinc-100 dark:bg-zinc-900 rounded-[24px] mb-4" />
              <div className="h-4 w-2/3 bg-zinc-100 dark:bg-zinc-900 rounded-full mb-2" />
              <div className="h-6 w-1/3 bg-zinc-100 dark:bg-zinc-900 rounded-full" />
            </div>
          ))
        ) : (
          products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`} className="group">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px] bg-zinc-50 dark:bg-zinc-900 mb-6">
                {product.images?.[0] ? (
                  <Image 
                    src={product.images[0].image} 
                    alt={product.name} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-300">
                    <ShoppingBag size={48} />
                  </div>
                )}
                {product.is_on_sale && (
                  <div className="absolute top-4 left-4 bg-[#7C3AED] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter">
                    Sale
                  </div>
                )}
              </div>
              <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-[#FBFBFB] group-hover:text-[#7C3AED] transition-colors line-clamp-1 uppercase">
                {product.name}
              </h3>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xl font-black text-[#1A1A1A] dark:text-[#FBFBFB]">
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
