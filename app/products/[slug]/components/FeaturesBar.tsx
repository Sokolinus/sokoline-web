import React from 'react';

const FeaturesBar = ({ className = "grid-cols-2" }) => {
  const features = [
    { title: "Secure Payments" },
    { title: "Free Shipping" },
    { title: "Free Returns" },
    { title: "Safety certified" }
  ];

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