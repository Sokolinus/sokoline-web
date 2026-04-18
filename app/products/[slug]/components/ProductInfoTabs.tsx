"use client";

import React, { useState } from 'react';
import { Product } from "@/lib/types";

interface ProductInfoTabsProps {
  product: Product;
}

export default function ProductInfoTabs({ product }: ProductInfoTabsProps) {
  const [activeTab, setActiveTab] = useState('details');

  const tabs = [
    { id: 'details', label: 'Details' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'returns', label: 'Returns' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-20">
      <div className="flex gap-12 border-b border-zinc-100 dark:border-zinc-800 mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-6 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab.id 
                ? "text-[#7C3AED]" 
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#7C3AED] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'details' && (
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>
        )}
        
        {activeTab === 'shipping' && (
          <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {product.shipping_info || "Standard shipping applied by the student vendor. Contact the shop for more specific delivery timelines."}
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
            {product.return_policy || "Returns are subject to the vendor's policy. Most student ventures offer exchanges within 7 days of purchase."}
          </div>
        )}
      </div>
    </div>
  );
}
