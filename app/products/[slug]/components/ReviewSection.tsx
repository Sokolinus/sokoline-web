"use client";

import React, { useEffect, useState } from 'react';
import { Product, Review } from "@/lib/types";
import { getReviews } from "@/lib/api";
import ReviewCard from "@/components/sokoline/ReviewCard";
import { Loader2 } from "lucide-react";

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
    try {
      const data = await getReviews(product.id, LIMIT, newOffset);
      if (data.length < LIMIT) {
        setHasMore(false);
      }
      if (newOffset === 0) {
        setReviews(data);
      } else {
        setReviews(prev => [...prev, ...data]);
      }
    } catch (error) {
      console.error("Failed to load reviews:", error);
    } finally {
      setLoading(false);
    }
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
    <section className="w-full flex flex-col gap-[50px] items-center py-10">
      <div className="w-full py-[42px] flex justify-center border-b border-black/5">
        <h2 className="font-sans text-[36px] text-black text-center">
          Customer Reviews
        </h2>
      </div>
      
      <div className="w-full flex flex-col gap-[50px] items-center px-4">
        {reviews.map((review) => (
          <ReviewCard 
            key={review.id}
            author={`${review.user.first_name} ${review.user.last_name}`}
            content={review.comment}
            rating={review.rating}
          />
        ))}

        {reviews.length === 0 && !loading && (
          <div className="py-10 text-center opacity-50">
            <p className="font-sans text-[20px]">No reviews yet.</p>
          </div>
        )}
      </div>

      {hasMore && reviews.length > 0 && (
        <button 
          onClick={handleSeeMore}
          disabled={loading}
          className="bg-sokoline-details-bg py-[25px] px-[100px] md:px-[348px] font-sans text-[36px] text-black transition-all hover:opacity-80 active:scale-[0.98] mt-4 flex items-center justify-center gap-4"
        >
          {loading && <Loader2 size={30} className="animate-spin" />}
          See more
        </button>
      )}
    </section>
  );
}
