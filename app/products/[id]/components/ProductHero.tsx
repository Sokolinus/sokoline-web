"use client";

import React, { useState } from 'react';
import FeaturesBar from './FeaturesBar';

const images = [1, 2, 3, 4, 5, 6, 7]; // Placeholder for your image array

export default function ProductHero() {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <section className="max-w-7xl mx-auto bg-white font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:p-10">
        
        {/* --- LEFT COLUMN: GALLERY --- */}
        <div className="flex flex-col">
          {/* Mobile Navigation/Breadcrumbs (Only shows on mobile) */}
          <div className="px-4 py-2 md:hidden text-[10px] text-gray-400 uppercase tracking-widest">
            Home &gt; Mens &gt; Accessories &gt; <span className="text-black font-bold">Goggles</span>
          </div>

          {/* Desktop Title (Hidden on Mobile) */}
          <h1 className="hidden md:block text-3xl font-medium mb-6 px-4 md:px-0">
            Sassy Gog ZERO-FOG Snow Goggles - Mens
          </h1>

          {/* MAIN IMAGE / CAROUSEL */}
          <div className="relative w-full">
            <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar md:block">
              {images.map((img, i) => (
                <div key={i} className="min-w-full snap-center aspect-square md:aspect-[4/3] bg-[#f3f3f3] md:mb-4 flex-shrink-0">
                  {/* <img src={...} className="w-full h-full object-contain" /> */}
                </div>
              ))}
            </div>

            {/* Mobile Pagination Dots (Hidden on Desktop) */}
            <div className="flex justify-center gap-2 mt-4 md:hidden">
              {images.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full border border-gray-400 ${activeImg === i ? 'bg-purple-600 border-purple-600' : ''}`} />
              ))}
            </div>

            {/* Desktop Thumbnails (Hidden on Mobile) */}
            <div className="hidden md:grid grid-cols-4 gap-4">
              {images.map((_, i) => (
                <div key={i} className="aspect-square bg-[#f3f3f3] cursor-pointer hover:opacity-75 transition-opacity" />
              ))}
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: INFO & ACTIONS --- */}
        <div className="flex flex-col px-6 pt-4">
          {/* Mobile Title (Only shows on mobile) */}
          <h1 className="md:hidden text-2xl font-bold mb-2">
            Sassy Gog ZERO-FOG Snow Goggles - Mens
          </h1>

          <div className="flex items-center gap-2 text-sm mb-6">
            <span className="text-orange-500 font-bold">5.0</span>
            <span className="text-orange-500 text-xs">★</span>
            <span className="text-gray-400 underline">132 reviews</span>
          </div>

          {/* Price Section */}
          <div className="flex items-baseline gap-3 mb-8">
            <span className="text-gray-400 line-through text-lg italic">USD $399</span>
            <span className="text-3xl font-bold">USD $249</span>
            <span className="text-red-500 font-medium">-30%</span>
          </div>

          {/* Color Selector */}
          <div className="mb-8">
            <p className="text-sm font-bold mb-4">Color</p>
            <div className="flex gap-4">
              {['#D8B4FE', '#FBCFE8', '#6EE7B7', '#60A5FA'].map((color, i) => (
                <button 
                  key={i} 
                  className={`w-10 h-10 rounded-full border-2 border-white ring-1 ring-gray-200 shadow-sm`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button className="w-full bg-[#8a2be2] text-white py-4 rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-[#7a26c9] transition-colors mb-10">
            <span className="text-xl">🛒</span> Add to cart
          </button>

          {/* Trust Badge (The circular award icon from your screen) */}
          <div className="flex items-start gap-4 py-6 border-t border-gray-100">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-green-500 flex-shrink-0" />
            <p className="text-[10px] text-gray-600 leading-relaxed">
              Voted 2023's best goggles by GogglesGlobal. These low temp goggles provide clear vision with zero fogging protection.
            </p>
          </div>

          {/* Features Bar (Imported) */}
          <FeaturesBar className="grid-cols-2 mt-2" />
        </div>
      </div>
    </section>
  );
}
