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
      className={`group bg-sokoline-card-bg rounded-[11px] p-[35px] flex flex-col gap-[18px] items-center transition-all hover:shadow-lg ${className}`}
    >
      <Link href={`/products/${product.slug}`} className="w-full flex flex-col items-center gap-[18px]">
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

        <div className="w-full flex flex-col items-center text-center">
          <h3 className="font-logo text-[32px] text-black truncate w-full leading-tight">
            {product.name}
          </h3>
          <p className="font-sans text-[14px] text-black opacity-60">
            {product.shop_name || "Student Venture"}
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
      </Link>

      <button 
        onClick={handleAddToCart}
        disabled={isAdding || isDone}
        className={`w-full py-[20px] rounded-[12px] font-logo text-[20px] text-black transition-all active:scale-[0.98] flex items-center justify-center gap-4 ${
          isDone ? "bg-emerald-500 text-white" : "bg-sokoline-secondary hover:opacity-90"
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
              width={30} 
              height={30} 
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
