"use client";

import React, { useEffect, useState } from 'react';
import { Product, Review } from "@/lib/types";
import { getReviews } from "@/lib/api";
import { Star, ChevronDown, User } from "lucide-react";

interface ReviewSectionProps {
  product: Product;
}

export default function ReviewSection({ product }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 5;

  const loadReviews = async (newOffset: number) => {
    setLoading(true);
    const data = await getReviews(product.id, LIMIT, newOffset);
    if (data.length < LIMIT) {
      setHasMore(false);
    }
    setReviews(prev => [...prev, ...data]);
    setLoading(false);
  };

  useEffect(() => {
    loadReviews(0);
  }, [product.id]);

  const handleSeeMore = () => {
    const nextOffset = offset + LIMIT;
    setOffset(nextOffset);
    loadReviews(nextOffset);
  };

  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 bg-zinc-50 dark:bg-zinc-900/30 rounded-[48px]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
           <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] uppercase">Community Feedback</h2>
           <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">Real reviews from students who bought this.</p>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-center">
              <div className="text-3xl font-black text-[#1A1A1A] dark:text-[#FBFBFB]">{product.average_rating.toFixed(1)}</div>
              <div className="flex gap-0.5 mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < Math.round(product.average_rating) ? "fill-[#7C3AED] text-[#7C3AED]" : "text-zinc-200"} />
                ))}
              </div>
           </div>
           <div className="h-12 w-px bg-zinc-200 dark:bg-zinc-800" />
           <div className="text-center">
              <div className="text-3xl font-black text-[#1A1A1A] dark:text-[#FBFBFB]">{product.review_count}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-1">Total Reviews</div>
           </div>
        </div>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white dark:bg-[#0A0A0A] p-8 rounded-3xl border border-zinc-100 dark:border-zinc-800 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-[#F5F3FF] dark:bg-[#1E1B4B] flex items-center justify-center text-[#7C3AED]">
                   <User size={20} />
                </div>
                <div>
                  <div className="font-bold text-[#1A1A1A] dark:text-[#FBFBFB]">{review.user.first_name} {review.user.last_name[0]}.</div>
                  <div className="text-xs font-medium text-zinc-400 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < review.rating ? "fill-[#7C3AED] text-[#7C3AED]" : "text-zinc-200"} />
                ))}
              </div>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              {review.comment}
            </p>
          </div>
        ))}

        {reviews.length === 0 && !loading && (
          <div className="py-12 text-center text-zinc-400 font-medium italic">
            No reviews yet. Be the first student to review this product!
          </div>
        )}

        {hasMore && reviews.length > 0 && (
          <div className="flex justify-center mt-12">
            <button 
              onClick={handleSeeMore}
              disabled={loading}
              className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#7C3AED] hover:opacity-70 transition-opacity disabled:opacity-50"
            >
              {loading ? "Loading..." : "See More Reviews"}
              {!loading && <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
