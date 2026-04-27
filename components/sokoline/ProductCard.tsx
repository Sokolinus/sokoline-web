"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/types";
import { formatImageUrl } from "@/lib/api";
import { useCart } from "@/components/providers/CartProvider";
import { Loader2, Check, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: Product;
  className?: string;
}

export default function ProductCard({ product, className = "" }: ProductCardProps) {
  const { addItem } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  const [isDone, setIsDone] = useState(false);

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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isAdding || isDone) return;
    
    setIsAdding(true);
    try {
      // Use main product ID as expected by backend CartItem model
      await addItem(product.id, 1);
      setIsDone(true);
      setTimeout(() => setIsDone(false), 2000);
    } catch (error) {
      console.error("Failed to add to cart:", error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div 
      className={`group flex flex-col items-center gap-4 rounded-2xl border border-black/5 bg-sokoline-card-bg p-4 transition-all hover:shadow-lg sm:gap-[18px] sm:p-6 lg:p-[30px] ${className}`}
    >
      <Link href={`/products/${product.slug}`} className="flex w-full flex-col items-center gap-4 sm:gap-[18px]">
        <div className="bg-white w-full aspect-[427/628] rounded-sm overflow-hidden relative">
          {mainImage ? (
            <Image
              src={mainImage}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-black/10">
              <ShoppingBag size={64} strokeWidth={1} />
            </div>
          )}
        </div>

        <div className="flex w-full flex-col items-center text-center">
          <h3 className="w-full truncate font-logo text-xl leading-tight text-black sm:text-[22px] lg:text-[24px]">
            {product.name}
          </h3>
          <p className="font-sans text-xs text-black opacity-60 sm:text-[14px]">
            {product.shop_name || "Student Venture"}
          </p>
        </div>

        <div className="mt-auto flex w-full items-center justify-between gap-3 sm:gap-4">
          <p className="font-logo text-lg font-bold text-black sm:text-[20px]">
            Ksh. {product.price}
          </p>
          
          {uniqueColors.length > 0 && (
            <div className="flex items-center gap-1">
              {uniqueColors.slice(0, 4).map((color, i) => (
                <div 
                  key={i} 
                  className="h-4 w-4 rounded-[4px] border border-black/10 sm:h-[23px] sm:w-[26px]" 
                  style={{ backgroundColor: color }}
                />
              ))}
              {uniqueColors.length > 4 && (
                <span className="font-logo text-base text-black sm:text-[20px]">
                  +{uniqueColors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>

      <button 
        onClick={handleAddToCart}
        disabled={isAdding || isDone}
        className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 font-logo text-base text-black transition-all active:scale-[0.98] sm:gap-3 sm:py-4 sm:text-lg ${
          isDone ? "bg-emerald-500 text-white" : "bg-[#BEFDB1] hover:opacity-90"
        }`}
      >
        {isAdding ? (
          <Loader2 size={24} className="animate-spin" />
        ) : isDone ? (
          <>
            <Check size={24} />
            Added!
          </>

        ) : (
          <>
            <Image 
              src="/CartIcon.svg" 
              alt="Cart" 
              width={22} 
              height={22} 
              className="object-contain"
              unoptimized
            />
            Add to Cart
          </>
        )}
      </button>
    </div>
  );
}
