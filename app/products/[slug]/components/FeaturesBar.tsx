import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Lock } from "lucide-react";

interface FeaturesBarProps {
  className?: string;
  hasFreeShipping?: boolean;
  hasFreeReturns?: boolean;
  hasSafetyCertification?: boolean;
}

const FeaturesBar = ({
  className = "grid-cols-2",
  hasFreeShipping = false,
  hasFreeReturns = false,
  hasSafetyCertification = false
}: FeaturesBarProps) => {
  const features = [
    { title: "Secure Payments", enabled: true, icon: Lock },
    { title: "Free Shipping", enabled: hasFreeShipping, icon: Truck },
    { title: "Free Returns", enabled: hasFreeReturns, icon: RotateCcw },
    { title: "Campus Certified", enabled: hasSafetyCertification, icon: ShieldCheck }
  ].filter((feature) => feature.enabled);

  return (
    <div className={`grid gap-y-6 gap-x-4 py-8 ${className}`}>
      {features.map((item, index) => (
        <div key={index} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex items-center justify-center text-[#7C3AED] flex-shrink-0 shadow-sm">
            <item.icon size={16} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-foreground dark:text-zinc-100 whitespace-nowrap">
            {item.title}
          </span>
        </div>
      ))}
    </div>
  );
};

export default FeaturesBar;
