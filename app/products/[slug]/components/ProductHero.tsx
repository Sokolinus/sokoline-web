"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, ProductVariant } from "@/lib/types";
import { formatImageUrl } from "@/lib/api";
import { useCart } from "@/components/providers/CartProvider";
import { Check, ShoppingCart, Star, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AssuranceBadge from "@/components/sokoline/AssuranceBadge";

interface ProductHeroProps {
  product: Product;
}

const getOptionKey = (variant: ProductVariant) => JSON.stringify([variant.name, variant.size || ""]);

type AddState = "idle" | "adding" | "done";

export default function ProductHero({ product }: ProductHeroProps) {
  const { addItem } = useCart();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants.length > 0 ? product.variants[0] : null
  );
  const [activeImg, setActiveImg] = useState(0);
  const [addState, setAddState] = useState<AddState>("idle");

  // Derived data
  const currentPrice = selectedVariant?.price_override || product.discount_price || product.price;

  const allImages = product.images.length > 0
    ? product.images
    : [{ id: 0, image: "/placeholder-product.png", alt_text: product.name, is_feature: true }];

  const handleAddToCart = async () => {
    if (addState !== "idle") return;
    setAddState("adding");
    // Use main product ID as expected by backend CartItem model
    const success = await addItem(product.id, 1);
    if (success) {
      setAddState("done");
      setTimeout(() => setAddState("idle"), 1400);
    } else {
      setAddState("idle");
    }
  };

  const uniqueColors = product.variants
    .filter((variant) => variant.color_hex)
    .reduce<ProductVariant[]>((acc, variant) => {
      if (!acc.some((item) => item.color_hex === variant.color_hex)) {
        acc.push(variant);
      }
      return acc;
    }, []);

  const imageSource = formatImageUrl(allImages[activeImg]?.image);
  const imageAlt = allImages[activeImg]?.alt_text || product.name;

  return (
    <section className="bg-white py-10">
      <div className="max-w-[1708px] mx-auto px-[63px] grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* LEFT: Product Gallery */}
        <div className="flex flex-col gap-[15px]">
          <div className="relative aspect-[814/491] w-full overflow-hidden bg-sokoline-gray/20">
            <Image
              src={imageSource}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-wrap gap-[15px_18px]">
            {allImages.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveImg(i)}
                type="button"
                className={`relative w-[188px] aspect-[400/267] overflow-hidden bg-sokoline-gray/40 transition-all ${
                  activeImg === i ? "ring-2 ring-black" : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={formatImageUrl(img.image)} alt={img.alt_text || product.name} fill className="object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="flex flex-col pt-[48px] pl-[21px] pr-[29px]">
          <div className="mb-8 space-y-4">
            <h1 className="font-logo text-[32px] text-black leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2">
              <div className="w-[44px] h-[43px] rounded-full bg-sokoline-gray/30 overflow-hidden shrink-0" />
              <p className="font-sans text-[14px] text-black leading-relaxed">
                Handmade {product.category?.name || "item"}. Genuine materials.<br />
                Made with love for you.
              </p>
            </div>

            <div className="flex flex-col gap-[12px] pt-4 border-t border-black/10">
              <div className="flex gap-[22px] items-center font-sans text-[14px]">
                <div className="flex items-center gap-1">
                  <Star size={14} className="fill-black text-black" />
                  <span>{product.average_rating.toFixed(1)} Stars</span>
                </div>
                <span>132 Reviews</span>
              </div>
              
              <div className="flex gap-2 items-baseline font-logo">
                {product.discount_price && (
                  <span className="text-[12px] text-black/50 line-through">
                    KSH. {product.price}
                  </span>
                )}
                <span className="text-[16px] text-black font-bold">
                  KSh. {currentPrice}
                </span>
                {product.discount_price && (
                  <span className="text-[16px] text-black">
                    -{Math.round(((product.price - product.discount_price) / product.price) * 100)}%
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Color Selector */}
            {uniqueColors.length > 0 && (
              <div className="space-y-2">
                <p className="font-sans text-[14px] text-black uppercase tracking-wider">Color</p>
                <div className="flex gap-2">
                  {uniqueColors.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariant(v)}
                      title={v.color_name}
                      className={`w-[30px] h-[30px] border transition-all ${
                        selectedVariant?.id === v.id
                          ? "ring-2 ring-black ring-offset-2"
                          : "border-black/10 hover:border-black"
                      }`}
                      style={{ backgroundColor: v.color_hex || 'transparent' }}
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={addState !== "idle"}
              className={`w-[146px] h-[30px] rounded-[2px] font-logo text-[14px] flex items-center justify-center gap-2 transition-all ${
                addState === "done"
                  ? "bg-emerald-500 text-white"
                  : "bg-sokoline-accent text-black hover:opacity-90"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {addState === "adding" ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : addState === "done" ? (
                  <Check size={14} />
                ) : (
                  <div className="flex items-center gap-2">
                    <Image 
                      src="/CartIcon.svg" 
                      alt="Cart" 
                      width={18} 
                      height={18} 
                      className="object-contain"
                    />
                    <span>Add to cart</span>
                  </div>
                )}
              </AnimatePresence>
            </button>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 grid grid-cols-2 gap-x-[104px] gap-y-[17px] w-fit">
            <AssuranceBadge label="Secure Payments" />
            <AssuranceBadge label="Free Shipping" />
            <AssuranceBadge label="Free Returns" />
            <AssuranceBadge label="Safety certified" />
          </div>
        </div>
      </div>
    </section>
  );
}
