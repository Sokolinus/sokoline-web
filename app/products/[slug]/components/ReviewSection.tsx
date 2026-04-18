"use client";

import React, { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { getReviews } from '@/lib/api';
import { Star } from 'lucide-react';

export default function ReviewSection({ productId, initialCount }: { productId: number; initialCount: number }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 5;

  useEffect(() => {
    const fetchInitialReviews = async () => {
      setLoading(true);
      const data = await getReviews(productId, limit, 0);
      setReviews(data);
      setOffset(limit);
      setLoading(false);
    };
    fetchInitialReviews();
  }, [productId]);

  const handleSeeMore = async () => {
    setLoading(true);
    const newData = await getReviews(productId, limit, offset);
    setReviews((prev) => [...prev, ...newData]);
    setOffset((prev) => prev + limit);
    setLoading(false);
  };

  const isAllLoaded = reviews.length >= initialCount;

  return (
    <section className="max-w-4xl mx-auto py-20 px-4 text-center font-sans transition-colors duration-300">
      <h2 className="text-4xl font-black tracking-tighter mb-4 text-zinc-900 dark:text-zinc-50">REVIEWS</h2>
      <p className="text-zinc-500 dark:text-zinc-400 text-sm mb-12">Total reviews ({initialCount})</p>
      
      <div className="flex flex-col gap-6">
        {reviews.map((review) => (
          <div 
            key={review.id} 
            className="border border-zinc-100 dark:border-zinc-800 p-8 text-left bg-white dark:bg-zinc-900/50 rounded-2xl shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-1">
                  {review.user_name}
                </h3>
                <div className="flex text-orange-500">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      fill={i < review.rating ? "currentColor" : "none"} 
                      className={i < review.rating ? "" : "text-zinc-300 dark:text-zinc-700"}
                    />
                  ))}
                </div>
              </div>
              <span className="text-xs text-zinc-400">
                {new Date(review.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
              "{review.comment}"
            </p>
          </div>
        ))}

        {reviews.length === 0 && !loading && (
          <p className="text-zinc-400 py-10">No reviews yet for this product.</p>
        )}
      </div>

      {!isAllLoaded && reviews.length > 0 && (
        <button 
          onClick={handleSeeMore}
          disabled={loading}
          className="mt-10 px-10 py-4 bg-zinc-100 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 font-bold rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all disabled:opacity-50"
        >
          {loading ? "Loading..." : "See more reviews"}
        </button>
      )}
    </section>
  );
}
