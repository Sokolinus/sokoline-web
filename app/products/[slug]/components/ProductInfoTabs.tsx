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
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-32">
      <div className="flex gap-16 border-b border-zinc-100 mb-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-8 text-sm font-black uppercase tracking-[0.2em] transition-all relative ${
              activeTab === tab.id 
                ? "text-sokoline-accent" 
                : "text-zinc-400 hover:text-foreground"
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 w-full h-1.5 bg-sokoline-accent rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-700">
        {activeTab === 'details' && (
          <div className="prose prose-zinc max-w-none">
            <p className="text-xl text-zinc-500 leading-relaxed font-medium">
              {product.description}
            </p>
          </div>
        )}
        
        {activeTab === 'shipping' && (
          <div className="text-xl text-zinc-500 leading-relaxed font-medium">
            {product.shipping_info || "Standard shipping applied by the student vendor. Contact the shop for more specific delivery timelines."}
          </div>
        )}

        {activeTab === 'returns' && (
          <div className="text-xl text-zinc-500 leading-relaxed font-medium">
            {product.return_policy || "Returns are subject to the vendor's policy. Most student ventures offer exchanges within 7 days of purchase."}
          </div>
        )}
      </div>
    </div>
  );
}
