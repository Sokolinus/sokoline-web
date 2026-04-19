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
    <div className="w-full bg-white flex flex-col gap-[50px] items-center py-[98px] px-[64px]">
      <div className="w-full max-w-[1580px] flex flex-col gap-[67px]">
        {/* Tab Headers */}
        <div className="w-full border-b border-black flex items-center px-[28px] py-[30px]">
          <div className="flex gap-[115px] items-center">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-[36px] transition-all relative ${
                  activeTab === tab.id 
                    ? "font-logo font-bold text-black" 
                    : "font-logo font-normal text-black/60 hover:text-black"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="w-full px-[43px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="font-sans text-[36px] text-black leading-relaxed flex flex-col gap-[55px]">
            {activeTab === 'details' && (
              <>
                <p className="max-w-[1088px]">
                  {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin varius egestas urna, quis laoreet mi tincidunt sed. Etiam nec pharetra dolor, non luctus velit."}
                </p>
                <p>
                  Donec pharetra pellentesque scelerisque. Aliquam scelerisque pellentesque sapien. Morbi ut dui tristique, dictum risus quis, malesuada lacus.
                </p>
              </>
            )}
            
            {activeTab === 'shipping' && (
              <p>
                {product.shipping_info || "Standard shipping applied by the student vendor. Contact the shop for more specific delivery timelines."}
              </p>
            )}

            {activeTab === 'returns' && (
              <p>
                {product.return_policy || "Returns are subject to the vendor's policy. Most student ventures offer exchanges within 7 days of purchase."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
