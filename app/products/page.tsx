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
    <main className="flex w-full flex-col items-center bg-white py-2 sm:py-3">
      <div className="w-full max-w-[2048px] space-y-8 px-3 sm:space-y-10 sm:px-4 md:px-6">
        {/* Page header */}
        <div className="flex flex-col items-center border-b border-black/5 py-7 sm:py-10">
          <h1 className="text-center font-logo text-3xl font-bold text-black sm:text-[42px] md:text-[48px]">{title}</h1>
          <p className="mt-2 text-center font-sans text-sm text-black/60">
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
          <div className="grid grid-cols-1 gap-3 pb-16 sm:grid-cols-2 sm:gap-4 sm:pb-24 lg:grid-cols-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
