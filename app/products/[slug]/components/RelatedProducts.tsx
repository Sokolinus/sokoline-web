"use client";

import React, { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { getRelatedProducts } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';

export default function RelatedProducts({ productId }: { productId: number }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      const data = await getRelatedProducts(productId);
      setProducts(data);
      setLoading(false);
    };
    fetchRelated();
  }, [productId]);

  if (!loading && products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 bg-zinc-50 dark:bg-zinc-950/30">
      <h2 className="text-3xl font-black tracking-tighter mb-10 text-zinc-900 dark:text-zinc-50">YOU MIGHT ALSO LIKE</h2>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-zinc-200 dark:bg-zinc-800 aspect-[3/4] rounded-2xl" />
          ))
        ) : (
          products.slice(0, 4).map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="group flex flex-col gap-4 bg-white dark:bg-zinc-900 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-zinc-50 dark:bg-zinc-800">
                <Image 
                  src={product.images[0]?.image || "/file.svg"} 
                  alt={product.name}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 truncate text-sm">
                  {product.name}
                </h3>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-2">{typeof product.shop === 'object' ? (product.shop as any).name : product.shop}</p>
                <p className="font-black text-[#7C3AED] dark:text-[#A855F7]">USD ${product.price}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
