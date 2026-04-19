import React from "react";

interface ReviewCardProps {
  content: string;
  author: string;
  rating?: number;
}

export default function ReviewCard({ content, author, rating = 5 }: ReviewCardProps) {
  return (
    <div className="border-[0.5px] border-black p-[27px] flex flex-col gap-[42px] items-start w-full max-w-[994px]">
      <p className="font-sans text-[20px] text-black leading-relaxed">
        {content}
      </p>
      <div className="flex flex-col gap-[18px]">
        <p className="font-logo font-bold text-[20px] text-black">
          {author}
        </p>
        <div className="flex gap-1">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-black text-[20px]">
              {i < rating ? "★" : "☆"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
