import React from 'react';

interface FeaturesBarProps {
  className?: string;
  hasFreeShipping?: boolean;
  hasFreeReturns?: boolean;
  isSafetyCertified?: boolean;
}

const FeaturesBar = ({
  className = "grid-cols-2",
  hasFreeShipping = true,
  hasFreeReturns = true,
  isSafetyCertified = true
}: FeaturesBarProps) => {
  const features = [
    { title: "Secure Payments" },
    { title: "Free Shipping", enabled: hasFreeShipping },
    { title: "Free Returns", enabled: hasFreeReturns },
    { title: "Safety certified", enabled: isSafetyCertified }
  ].filter((feature) => feature.enabled ?? true);

  return (
    <div className={`grid gap-y-4 gap-x-4 py-6 ${className}`}>
      {features.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {/* Circular Placeholder for Icon */}
          <div className="w-6 h-6 rounded-full bg-[#ddd4d4] flex-shrink-0" />
          <span className="text-[10px] font-medium text-gray-700 whitespace-nowrap">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FeaturesBar;
