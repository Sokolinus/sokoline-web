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
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-32 bg-background">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 mb-20">
        <div>
           <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">Community <br /> Feedback</h2>
           <p className="text-zinc-500 font-medium text-lg">Real reviews from students who bought this.</p>
        </div>
        <div className="flex items-center gap-10">
           <div className="text-center">
              <div className="text-4xl font-bold text-foreground tracking-tight">{product.average_rating.toFixed(1)}</div>
              <div className="flex gap-1 mt-2 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < Math.round(product.average_rating) ? "fill-sokoline-accent text-sokoline-accent" : "text-zinc-200"} />
                ))}
              </div>
           </div>
           <div className="h-16 w-px bg-zinc-200" />
           <div className="text-center">
              <div className="text-4xl font-bold text-foreground tracking-tight">{product.review_count}</div>
              <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-2">Total Reviews</div>
           </div>
        </div>
      </div>

      <div className="space-y-8">
        {reviews.map((review) => (
          <div key={review.id} className="bg-card p-10 rounded-[40px] border border-zinc-100 shadow-sm transition-all hover:shadow-xl hover:shadow-purple-100/20">
            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-5">
                <div className="h-12 w-12 rounded-2xl bg-[#F5F3FF] border border-sokoline-accent/10 flex items-center justify-center text-sokoline-accent">
                   <User size={24} />
                </div>
                <div>
                  <div className="font-bold text-foreground text-lg">{review.user.first_name} {review.user.last_name[0]}.</div>
                  <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{new Date(review.created_at).toLocaleDateString()}</div>
                </div>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? "fill-sokoline-accent text-sokoline-accent" : "text-zinc-100"} />
                ))}
              </div>
            </div>
            <p className="text-zinc-600 leading-relaxed font-medium text-lg max-w-2xl">
              {review.comment}
            </p>
          </div>
        ))}

        {reviews.length === 0 && !loading && (
          <div className="py-20 text-center text-zinc-400 font-medium italic border-2 border-dashed border-zinc-200 rounded-[40px]">
            No reviews yet. Be the first student to review this product!
          </div>
        )}

        {hasMore && reviews.length > 0 && (
          <div className="flex justify-center mt-16">
            <button 
              onClick={handleSeeMore}
              disabled={loading}
              className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-sokoline-accent hover:opacity-70 transition-opacity disabled:opacity-50"
            >
              {loading ? "Loading..." : "Load More Experiences"}
              {!loading && <ChevronDown size={18} />}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
