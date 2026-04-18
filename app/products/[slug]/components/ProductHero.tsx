"use client";

import React, { useState } from 'react';
import { Product, Variant } from '@/lib/types';
import Image from 'next/image';
import { ShoppingCart, Star } from 'lucide-react';
import FeaturesBar from './FeaturesBar';

export default function ProductHero({ product }: { product: Product }) {
  const [activeVariant, setActiveVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  
  const displayImages = product.images.length > 0 
    ? product.images.map(img => img.image)
    : ["/file.svg"]; // Fallback

  const [activeImg, setActiveImg] = useState(0);

  const price = activeVariant ? activeVariant.price : product.price;
  const stock = activeVariant ? activeVariant.stock : 0;

  return (
    <section className="max-w-7xl mx-auto bg-white dark:bg-[#0A0A0A] font-sans transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:p-10">
        
        {/* --- LEFT COLUMN: GALLERY --- */}
        <div className="flex flex-col">
          {/* Desktop Title (Hidden on Mobile) */}
          <h1 className="hidden md:block text-3xl font-bold mb-6 px-4 md:px-0 text-zinc-900 dark:text-zinc-50 tracking-tight">
            {product.name}
          </h1>

          {/* MAIN IMAGE */}
          <div className="relative w-full group">
            <div className="relative aspect-square md:aspect-[4/3] bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl overflow-hidden shadow-sm">
              <Image 
                src={activeVariant?.image || displayImages[activeImg]} 
                alt={product.name}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
              <div className="mt-4 grid grid-cols-5 gap-2">
                {displayImages.map((img, i) => (
                  <button 
                    key={i} 
                    onClick={() => setActiveImg(i)}
                    className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                      activeImg === i ? 'border-[#7C3AED]' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`Thumbnail ${i}`} fill sizes="150px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* --- RIGHT COLUMN: INFO & ACTIONS --- */}
        <div className="flex flex-col px-6 pt-4">
          {/* Mobile Title */}
          <h1 className="md:hidden text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50">
            {product.name}
          </h1>

          <div className="flex items-center gap-2 text-sm mb-6">
            <div className="flex items-center text-orange-500">
              <Star size={16} fill="currentColor" />
              <span className="ml-1 font-bold">{(product.avg_rating || 0).toFixed(1)}</span>
            </div>
            <span className="text-zinc-400 underline">{product.review_count || 0} reviews</span>
            <span className="text-zinc-300 dark:text-zinc-700">|</span>
            <span className="text-zinc-500 font-medium">Shop: {typeof product.shop === 'object' ? (product.shop as any).name : product.shop}</span>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">USD ${price}</span>
            {stock <= 5 && stock > 0 && (
              <span className="text-orange-600 text-sm font-semibold px-2 py-0.5 bg-orange-50 dark:bg-orange-900/20 rounded">
                Only {stock} left!
              </span>
            )}
            {stock === 0 && (
              <span className="text-red-600 text-sm font-semibold px-2 py-0.5 bg-red-50 dark:bg-red-900/20 rounded">
                Out of Stock
              </span>
            )}
          </div>

          {/* Variants / Color Selector */}
          {product.variants.length > 0 && (
            <div className="mb-8">
              <p className="text-sm font-bold mb-4 text-zinc-900 dark:text-zinc-50 uppercase tracking-widest">Select Variant</p>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((variant) => (
                  <button 
                    key={variant.id} 
                    onClick={() => setActiveVariant(variant)}
                    disabled={variant.stock === 0}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      activeVariant?.id === variant.id 
                        ? 'border-[#7C3AED] bg-[#F5F3FF] dark:bg-[#1E1B4B]/30 text-[#7C3AED]' 
                        : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300'
                    } ${variant.stock === 0 ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                  >
                    {variant.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to Cart Button */}
          <button 
            disabled={!activeVariant || activeVariant.stock === 0}
            className="w-full bg-[#7C3AED] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#6D28D9] transition-all shadow-lg shadow-purple-200 dark:shadow-none mb-10 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            <ShoppingCart size={20} /> Add to cart
          </button>

          {/* Trust Badge */}
          <div className="flex items-start gap-4 py-6 border-t border-zinc-100 dark:border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#A855F7] flex-shrink-0 flex items-center justify-center text-white">
              <Star size={20} fill="currentColor" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Vetted by the Sokoline community. Secure checkout with buyer protection for all student-led ventures.
            </p>
          </div>

          {/* Features Bar */}
          <FeaturesBar className="grid-cols-2 mt-2" />
        </div>
      </div>
    </section>
  );
}
