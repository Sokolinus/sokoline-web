"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from "@/lib/types";
import { getRelatedProducts } from "@/lib/api";
import ProductCard from "@/components/sokoline/ProductCard";

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
    <section className="w-full bg-white flex flex-col gap-[72px] items-center py-[54px] px-[32px]">
      <h2 className="font-logo font-bold text-[36px] text-black text-center">
        Related Products
      </h2>
      
      <div className="w-full max-w-[1708px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[427/628] bg-sokoline-card-bg rounded-[11px] mb-4" />
              <div className="h-8 w-2/3 bg-sokoline-card-bg rounded-md mx-auto mb-2" />
              <div className="h-6 w-1/3 bg-sokoline-card-bg rounded-md mx-auto" />
            </div>
          ))
        ) : (
          products.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <ProductCard product={product} />
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
