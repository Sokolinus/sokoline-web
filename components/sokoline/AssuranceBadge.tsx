import React from "react";

interface AssuranceBadgeProps {
  label: string;
  icon?: React.ReactNode;
}

export default function AssuranceBadge({ label, icon }: AssuranceBadgeProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="w-[29px] h-[28px] rounded-full bg-sokoline-gray flex items-center justify-center overflow-hidden">
        {icon || <div className="w-full h-full bg-sokoline-gray opacity-50" />}
      </div>
      <p className="font-sans text-[12px] text-black whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}
