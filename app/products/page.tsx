import { Product } from "@/lib/types";
import { getCategories, getProducts } from "@/lib/api";
import CategoryFilter from "@/components/CategoryFilter";
import { Suspense } from "react";
import ProductCard from "@/components/sokoline/ProductCard";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;
  
  // Use the standardized API functions
  const [products, categories] = await Promise.all([
    getProducts(category ? { category } : (search ? { search } : undefined)),
    getCategories(),
  ]);

  const title = search
    ? `Results for "${search}"`
    : category
    ? categories.find((c) => c.slug === category)?.name ?? "Browse"
    : "Products";

  return (
    <main className="w-full flex flex-col items-center py-[10px] bg-white">
      <div className="w-full max-w-[2048px] px-[10px] space-y-[38px]">
        {/* Page header */}
        <div className="py-10 border-b border-black/5 flex flex-col items-center">
          <h1 className="font-logo text-[48px] font-bold text-black">{title}</h1>
          <p className="mt-2 font-sans text-sm text-black/60">
            {products.length} {products.length === 1 ? "item" : "items"} available
          </p>
        </div>

        {/* Category filter */}
        <div className="w-full border-b border-black/5">
          <Suspense>
            <CategoryFilter
              categories={categories}
              activeCategory={category}
            />
          </Suspense>
        </div>

        {/* Product grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-300">
              <SearchX size={32} />
            </div>
            <div>
              <h2 className="font-logo text-lg font-semibold text-gray-900">No items found</h2>
              <p className="mt-1 font-sans text-sm text-gray-500 max-w-xs">
                Try adjusting your search or browse a different category.
              </p>
            </div>
            <Link
              href="/products"
              className="rounded-full bg-black px-8 py-3 text-sm font-bold text-white hover:opacity-80 transition-all font-logo"
            >
              Clear filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px] pb-24">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
