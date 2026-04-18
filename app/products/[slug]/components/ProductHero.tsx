"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, ProductVariant } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import FeaturesBar from './FeaturesBar';
import { ShoppingCart, Star } from "lucide-react";

interface ProductHeroProps {
  product: Product;
}

export default function ProductHero({ product }: ProductHeroProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [activeImg, setActiveImg] = useState(0);
  const [isAdding, setIsAdding] = useState(false);

  // Derived data
  const currentPrice = selectedVariant?.price_override || product.discount_price || product.price;
  const originalPrice = product.is_on_sale ? product.price : null;
  const discountPercent = product.is_on_sale 
    ? Math.round((1 - (Number(product.discount_price) / Number(product.price))) * 100) 
    : null;
  
  const allImages = product.images.length > 0 
    ? product.images 
    : [{ id: 0, image: "/placeholder-product.png", alt_text: product.name, is_feature: true }];

  const handleAddToCart = async () => {
    setIsAdding(true);
    // Use variant ID if selected, otherwise product ID
    const idToTrack = selectedVariant ? selectedVariant.id : product.id;
    await addItem(idToTrack, 1);
    setIsAdding(false);
  };

  return (
    <section className="bg-white dark:bg-[#0A0A0A] font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 py-10">
        
        {/* --- LEFT COLUMN: GALLERY --- */}
        <div className="flex flex-col gap-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800">
            <Image
              src={allImages[activeImg]?.image || "/placeholder-product.png"}
              alt={allImages[activeImg]?.alt_text || product.name}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              priority
            />
            {product.is_on_sale && (
              <div className="absolute top-6 left-6 bg-[#7C3AED] text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-xl">
                Sale -{discountPercent}%
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
              {allImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  className={`relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-2xl border-2 transition-all ${
                    activeImg === i ? "border-[#7C3AED]" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image src={img.image} alt={img.alt_text} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* --- RIGHT COLUMN: INFO & ACTIONS --- */}
        <div className="flex flex-col pt-4">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#7C3AED]">{product.shop_name}</span>
               <span className="h-1 w-1 rounded-full bg-zinc-300" />
               <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">{product.category?.name || "General"}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] uppercase leading-[0.9]">
              {product.name}
            </h1>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center gap-1 bg-[#F5F3FF] dark:bg-[#1E1B4B] px-3 py-1 rounded-full border border-[#7C3AED]/10">
              <Star size={14} className="fill-[#7C3AED] text-[#7C3AED]" />
              <span className="text-sm font-black text-[#7C3AED]">{product.average_rating.toFixed(1)}</span>
            </div>
            <span className="text-sm font-bold text-zinc-400 uppercase tracking-widest decoration-dotted underline underline-offset-4 cursor-pointer hover:text-zinc-600">
              {product.review_count} reviews
            </span>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-4 mb-10">
            <span className="text-4xl font-black text-[#1A1A1A] dark:text-[#FBFBFB]">
              ${currentPrice}
            </span>
            {originalPrice && (
              <span className="text-xl text-zinc-400 line-through decoration-zinc-400/40 italic font-medium">
                ${originalPrice}
              </span>
            )}
          </div>

          {/* Variant Selector */}
          {product.variants.length > 0 && (
            <div className="mb-10">
              <p className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-4">Select Option</p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button 
                    key={variant.id}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-6 py-3 rounded-2xl border-2 font-bold transition-all text-sm ${
                      selectedVariant?.id === variant.id
                        ? "border-[#7C3AED] bg-[#7C3AED] text-white shadow-lg shadow-purple-200 dark:shadow-none"
                        : "border-zinc-100 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-600"
                    }`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className={`group relative w-full py-5 rounded-[24px] font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all duration-300 overflow-hidden ${
              isAdding 
                ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" 
                : "bg-[#1A1A1A] dark:bg-[#FBFBFB] text-white dark:text-[#1A1A1A] hover:bg-[#7C3AED] dark:hover:bg-[#7C3AED] hover:text-white shadow-2xl active:scale-95"
            }`}
          >
            <ShoppingCart size={20} className={isAdding ? "animate-bounce" : "group-hover:translate-x-1 transition-transform"} />
            {isAdding ? "Adding to bag..." : "Add to bag"}
          </button>

          <FeaturesBar 
            className="grid-cols-2 mt-8 border-t border-zinc-100 dark:border-zinc-800 pt-8" 
            hasFreeShipping={product.has_free_shipping}
            hasFreeReturns={product.has_free_returns}
            hasSafetyCertification={product.is_safety_certified}
          />
        </div>
      </div>
    </section>
  );
}
