"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/lib/types";
import { formatImageUrl } from "@/lib/api";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  // Extract colors from variants if they exist
  const uniqueColors = product.variants
    ? product.variants
        .filter((v) => v.color_hex)
        .reduce<string[]>((acc, v) => {
          if (v.color_hex && !acc.includes(v.color_hex)) {
            acc.push(v.color_hex);
          }
          return acc;
        }, [])
    : [];

  const mainImage = formatImageUrl(product.images?.[0]?.image);

  return (
    <div 
      className={`group bg-sokoline-card-bg rounded-[11px] p-[35px] flex flex-col gap-[18px] items-center transition-all hover:shadow-lg ${className}`}
    >
      <div className="bg-white w-full aspect-[427/628] rounded-sm overflow-hidden relative">
        <Image
          src={mainImage}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>

      <div className="w-full flex flex-col items-center">
        <h3 className="font-logo text-[32px] text-black text-center truncate w-full">
          {product.name}
        </h3>
        <p className="font-sans text-[14px] text-black opacity-60 text-center">
          {product.shop_name}
        </p>
      </div>

      <div className="w-full flex items-center justify-between gap-4 mt-auto">
        <p className="font-logo font-bold text-[20px] text-black">
          Ksh. {product.price}
        </p>
        
        {uniqueColors.length > 0 && (
          <div className="flex gap-1 items-center">
            {uniqueColors.slice(0, 4).map((color, i) => (
              <div 
                key={i} 
                className="w-[26px] h-[23px] border border-black/10" 
                style={{ backgroundColor: color }}
              />
            ))}
            {uniqueColors.length > 4 && (
              <span className="font-logo text-[20px] text-black">
                +{uniqueColors.length - 4}
              </span>
            )}
          </div>
        )}
      </div>

      <button className="w-full bg-sokoline-secondary py-[20px] rounded-[12px] font-logo text-[20px] text-black transition-all hover:opacity-90 active:scale-[0.98] flex items-center justify-center gap-4">
        <Image 
          src="/CartIcon.svg" 
          alt="Cart" 
          width={30} 
          height={30} 
          className="object-contain"
        />
        Add to Cart
      </button>
    </div>
  );
}
