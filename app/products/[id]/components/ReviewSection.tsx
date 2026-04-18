import React, { useState } from 'react';

// This would ideally come from a separate data file or an API
const allReviews = [
  {
    id: 1,
    text: "Sed non ipsum nec quam eleifend maximus. In auctor nulla nec dui pulvinar, nec vehicula nisl mattis. Morbi ac nunc turpis. Quisque eget dui id ante euismod facilisis quis non tortor",
    author: "Michael Agoya",
  },
  {
    id: 2,
    text: "Sed non ipsum nec quam eleifend maximus. In auctor nulla nec dui pulvinar, nec vehicula nisl mattis. Morbi ac nunc turpis. Quisque eget dui id ante euismod facilisis quis non tortor",
    author: "Michael Agoya",
  },
  {
    id: 3,
    text: "Additional review text for testing the load more functionality. This ensures the slice logic works as expected.",
    author: "John Doe",
  },
  {
    id: 4,
    text: "Another review to demonstrate the grid or list expansion in your UI component.",
    author: "Jane Smith",
  }
];

export default function ReviewSection() {
  const [visibleCount, setVisibleCount] = useState(2);
  const step = 2;

  const handleSeeMore = () => {
    setVisibleCount((prev) => prev + step);
  };

  const isAllLoaded = visibleCount >= allReviews.length;

  return (
    <section className="max-w-4xl mx-auto py-12 px-4 text-center font-sans">
      <h2 className="text-3xl font-light mb-10 text-gray-800">Customer Reviews</h2>
      
      <div className="flex flex-col gap-6">
        {allReviews.slice(0, visibleCount).map((review) => (
          <div 
            key={review.id} 
            className="border border-gray-300 p-8 text-left bg-white"
          >
            <p className="text-gray-700 leading-relaxed mb-6">
              {review.text}
            </p>
            <h3 className="font-bold text-black mb-1">
              {review.author}
            </h3>
            <div className="text-xs tracking-widest text-black">
              ★★★★★★★★★
            </div>
          </div>
        ))}
      </div>

      {!isAllLoaded && (
        <button 
          onClick={handleSeeMore}
          className="w-full mt-6 py-5 bg-[#eee4e4] text-xl text-gray-800 hover:bg-[#e5d8d8] transition-all duration-200"
        >
          See more
        </button>
      )}
    </section>
  );
}