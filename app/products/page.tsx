import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Star, SearchX } from "lucide-react";
import { Product } from "@/lib/types";
import { mockProducts } from "@/lib/mockProducts";
import { getCategories } from "@/lib/api";
import CategoryFilter from "@/components/CategoryFilter";
import { Suspense } from "react";

async function getProducts(search?: string, category?: string) {
  try {
    const envUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app").replace(/\/$/, "");
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);

    const res = await fetch(`${envUrl}/api/products/?${params.toString()}`, { next: { revalidate: 3600 } });
    if (!res.ok) return mockProducts;
    const data = await res.json();
    const products = data.results || data;

    if ((search || category) && products.length === 0) return [];

    return products.length > 0 ? products : mockProducts;
  } catch (error) {
    console.error("Error fetching products page data:", error);
    return mockProducts;
  }
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.slug}`} className="group block">
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-gray-100">
        {product.images?.[0] ? (
          <Image
            src={product.images[0].image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <ShoppingBag size={48} />
          </div>
        )}
        {product.is_on_sale && (
          <span className="absolute left-3 top-3 rounded-full bg-black/80 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
            Sale
          </span>
        )}
      </div>

      <div className="mt-3 px-0.5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-sm font-semibold text-gray-900 line-clamp-1 group-hover:text-violet-600 transition-colors">
            {product.name}
          </h2>
          {product.average_rating > 0 && (
            <div className="flex shrink-0 items-center gap-1">
              <Star size={11} className="fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium text-gray-500">{product.average_rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-gray-900">
            KES {product.discount_price || product.price}
          </span>
          <span className="text-xs text-gray-400">{product.shop_name}</span>
        </div>
      </div>
    </Link>
  );
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>;
}) {
  const { search, category } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(search, category),
    getCategories(),
  ]);

  const title = search
    ? `Results for "${search}"`
    : category
    ? categories.find((c) => c.slug === category)?.name ?? "Browse"
    : "Browse";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
      {/* Page header */}
      <div className="py-10 border-b border-gray-100">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">{title}</h1>
        <p className="mt-1 text-sm text-gray-500">
          {products.length} {products.length === 1 ? "item" : "items"} found
        </p>
      </div>

      {/* Category filter */}
      <div className="py-5 border-b border-gray-100">
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
            <h2 className="text-lg font-semibold text-gray-900">No items found</h2>
            <p className="mt-1 text-sm text-gray-500 max-w-xs">
              Try adjusting your search or browse a different category.
            </p>
          </div>
          <Link
            href="/products"
            className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            Clear filters
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
          {products.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </main>
  );
}
