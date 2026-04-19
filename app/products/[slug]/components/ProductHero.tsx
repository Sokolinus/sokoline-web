"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Product, ProductVariant } from "@/lib/types";
import { useCart } from "@/components/providers/CartProvider";
import { Check, ShoppingCart, Star, Heart, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Derived data
  const currentPrice = selectedVariant?.price_override || product.discount_price || product.price;

  const allImages = product.images.length > 0
    ? product.images
    : [{ id: 0, image: "/placeholder-product.png", alt_text: product.name, is_feature: true }];

  const handleAddToCart = async () => {
    if (addState !== "idle") return;
    setAddState("adding");
    const idToTrack = selectedVariant ? selectedVariant.id : product.id;
    await addItem(idToTrack, 1);
    setAddState("done");
    setTimeout(() => setAddState("idle"), 1400);
  };

  const uniqueColors = product.variants
    .filter((variant) => variant.color_hex)
    .reduce<ProductVariant[]>((acc, variant) => {
      if (!acc.some((item) => item.color_hex === variant.color_hex)) {
        acc.push(variant);
      }
      return acc;
    }, []);

  const uniqueOptions = product.variants.reduce<ProductVariant[]>((acc, variant) => {
    if (!acc.some((item) => getOptionKey(item) === getOptionKey(variant))) {
      acc.push(variant);
    }
    return acc;
  }, []);

  const selectedVariantImage = selectedVariant?.image
    ? allImages.find((img) => img.id === selectedVariant.image)
    : null;
  const imageSource =
    selectedVariant?.image_url ||
    selectedVariantImage?.image ||
    allImages[activeImg]?.image ||
    "/placeholder-product.png";
  const imageAlt = selectedVariantImage?.alt_text || allImages[activeImg]?.alt_text || product.name;

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

          {/* LEFT: Product Gallery */}
          <div className="lg:col-span-3 space-y-4">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
              <Image
                src={imageSource}
                alt={imageAlt}
                fill
                className="object-cover"
                priority
              />
              {product.is_on_sale && (
                <div className="absolute top-6 left-6 bg-violet-600 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                  Sale
                </div>
              )}
            </div>

            <div className="grid grid-cols-5 gap-4">
              {allImages.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImg(i)}
                  type="button"
                  className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all ${
                    activeImg === i ? "border-violet-500" : "border-transparent"
                  }`}
                >
                  <Image src={img.image} alt={img.alt_text || product.name} fill className="object-cover rounded-lg" />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="lg:col-span-2 p-8 bg-gray-50 rounded-2xl flex flex-col h-full border border-gray-100">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-xl font-bold text-gray-900">KES {currentPrice}</p>
              <p className="text-sm text-gray-400 mt-1">Sold by {product.shop_name}</p>
            </div>

            <div className="flex items-center gap-2 mb-8">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.average_rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-500">{product.average_rating.toFixed(1)}</span>
            </div>

            <div className="space-y-6 flex-1">
              {product.description && (
                <div>
                  <p className="text-gray-500 font-semibold uppercase text-[10px] tracking-widest mb-2">Description</p>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Variant Selectors */}
              {(uniqueColors.length > 0 || uniqueOptions.length > 0) && (
                <div className="space-y-4">
                  {uniqueColors.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Options</p>
                      <div className="flex flex-wrap gap-2">
                        {uniqueColors.map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedVariant(v)}
                            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                              selectedVariant?.id === v.id
                                ? "bg-violet-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            {v.color_name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  {uniqueOptions.length > 0 && (
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {uniqueOptions.map((v) => (
                          <button
                            key={getOptionKey(v)}
                            onClick={() => setSelectedVariant(v)}
                            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
                              selectedVariant && getOptionKey(selectedVariant) === getOptionKey(v)
                                ? "bg-violet-600 text-white"
                                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
                            }`}
                          >
                            {v.size || v.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 pt-8 border-t border-gray-200 space-y-3">
              <motion.button
                onClick={handleAddToCart}
                disabled={addState !== "idle"}
                whileTap={addState === "idle" ? { scale: 0.97 } : {}}
                className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-colors shadow-sm overflow-hidden ${
                  addState === "done"
                    ? "bg-emerald-500 text-white"
                    : "bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-70"
                }`}
              >
                <AnimatePresence mode="wait" initial={false}>
                  {addState === "adding" && (
                    <motion.span
                      key="loading"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      <Loader2 size={18} className="animate-spin" />
                      Adding…
                    </motion.span>
                  )}
                  {addState === "done" && (
                    <motion.span
                      key="done"
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                      className="flex items-center gap-2"
                    >
                      <Check size={18} strokeWidth={2.5} />
                      Added!
                    </motion.span>
                  )}
                  {addState === "idle" && (
                    <motion.span
                      key="idle"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart size={18} />
                      Add to cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all border ${
                  isWishlisted
                    ? "bg-rose-50 border-rose-200 text-rose-500"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <Heart size={16} className={isWishlisted ? "fill-current" : ""} />
                {isWishlisted ? "Saved" : "Save for later"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
