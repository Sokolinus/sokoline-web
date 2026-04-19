"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@/lib/types";

interface CategoryFilterProps {
  categories: Category[];
  activeCategory?: string;
}

export default function CategoryFilter({ categories, activeCategory }: CategoryFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleCategory = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) {
      params.set("category", slug);
    } else {
      params.delete("category");
    }
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => handleCategory(null)}
        className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
          !activeCategory
            ? "bg-gray-900 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => handleCategory(cat.slug)}
          className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === cat.slug
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
