"use client";

import React, { useState } from 'react';
import { Product } from '@/lib/types';

type TabName = 'Details' | 'Shipping' | 'Returns';

const ProductTabs = ({ product }: { product: Product }) => {
  const [activeTab, setActiveTab] = useState<TabName>('Details');

  const tabs: TabName[] = ['Details', 'Shipping', 'Returns'];

  const tabContent: Record<TabName, React.ReactNode> = {
    Details: (
      <div className="space-y-6 text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
        <p>{product.description || "No detailed description available."}</p>
      </div>
    ),
    Shipping: <div className="text-zinc-600 dark:text-zinc-400 text-sm py-4">Ships from student shop "{typeof product.shop === 'object' ? (product.shop as any).name : product.shop}". Local and campus delivery available.</div>,
    Returns: <div className="text-zinc-600 dark:text-zinc-400 text-sm py-4">Standard 7-day campus return policy for unused items.</div>,
  };

  return (
    <div className="max-w-4xl mx-auto p-6 font-sans">
      {/* Tab Headers */}
      <div className="flex border-b border-zinc-200 dark:border-zinc-800 relative overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`
              pb-4 px-6 text-sm font-bold tracking-widest uppercase transition-all duration-200 relative whitespace-nowrap
              ${activeTab === tab 
                ? 'text-[#7C3AED] dark:text-[#A855F7] border-b-[4px] border-[#7C3AED] dark:border-[#A855F7] -mb-[2px]' 
                : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200'}
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-8">
        {tabContent[activeTab]}
      </div>
    </div>
  );
};

export default ProductTabs;
