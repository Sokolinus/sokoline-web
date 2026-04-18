import React from 'react';

interface FeaturesBarProps {
  className?: string;
  hasFreeShipping?: boolean;
  hasFreeReturns?: boolean;
  isSafetyCertified?: boolean;
}

const FeaturesBar = ({ 
  className = "grid-cols-2",
  hasFreeShipping = false,
  hasFreeReturns = false,
  isSafetyCertified = false
}: FeaturesBarProps) => {
  
  // "Secure Payments" is a platform default, others are from the seller
  const features = [
    { title: "Secure Payments", show: true },
    { title: "Free Shipping", show: hasFreeShipping },
    { title: "Free Returns", show: hasFreeReturns },
    { title: "Safety Certified", show: isSafetyCertified }
  ].filter(f => f.show);

  return (
    <div className={`grid gap-y-4 gap-x-4 py-6 ${className}`}>
      {features.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {/* Circular Icon with a checkmark or purple accent */}
          <div className="w-6 h-6 rounded-full bg-[#F5F3FF] border border-[#7C3AED]/20 flex items-center justify-center flex-shrink-0">
            <div className="w-2 h-2 rounded-full bg-[#7C3AED]" />
          </div>
          <span className="text-[10px] font-bold tracking-tight text-[#1A1A1A] dark:text-[#FBFBFB] uppercase whitespace-nowrap">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FeaturesBar;
