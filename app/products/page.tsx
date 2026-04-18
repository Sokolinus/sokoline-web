import { Product } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { Star, Filter } from "lucide-react";

async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://api.sokoline.app/api/products/", { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || data;
}

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12 md:px-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 mb-4">SHOP ALL</h1>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-md">
              Discover unique products created and sold by student entrepreneurs from your campus and beyond.
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 border border-zinc-200 dark:border-zinc-800 rounded-full text-sm font-bold hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
          {products.map((product) => (
            <Link 
              key={product.id} 
              href={`/products/${product.slug}`}
              className="group flex flex-col gap-4"
            >
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-zinc-50 dark:bg-zinc-900 shadow-sm transition-all group-hover:shadow-xl group-hover:shadow-purple-100 dark:group-hover:shadow-none">
                <Image 
                  src={product.images[0]?.image || "/file.svg"} 
                  alt={product.name}
                  fill
                  className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-4 right-4 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-black shadow-sm flex items-center gap-1">
                  <Star size={12} fill="#F59E0B" className="text-[#F59E0B]" />
                  {(product.avg_rating || 0).toFixed(1)}
                </div>
              </div>
              
              <div className="flex flex-col gap-1 px-1">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 leading-tight group-hover:text-[#7C3AED] transition-colors">
                    {product.name}
                  </h3>
                  <p className="font-black text-lg text-[#7C3AED] dark:text-[#A855F7]">
                    ${product.price}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">{typeof product.shop === 'object' ? (product.shop as any).name : product.shop}</span>
                  <span className="h-1 w-1 rounded-full bg-zinc-300" />
                  <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">{typeof product.category === 'object' ? (product.category as any).name : product.category}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="py-40 text-center">
            <h2 className="text-2xl font-bold text-zinc-400">No products found.</h2>
            <p className="text-zinc-500">Check back later for new student ventures!</p>
          </div>
        )}

      </div>
    </div>
  );
}
