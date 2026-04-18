import Image from "next/image";
import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";

async function getShops() {
  const envUrl = (process.env.NEXT_PUBLIC_API_URL || "https://api.sokoline.app").replace(/\/$/, "");
  const res = await fetch(`${envUrl}/api/shops/`, { next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results || data;
}

export default async function ShopsPage() {
  const shops = await getShops();

  return (
    <div className="bg-white dark:bg-[#0A0A0A] min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-12 md:px-10">
        
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900 dark:text-zinc-50 mb-4 uppercase">Student Shops</h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-xl text-lg">
            Support your peers. Every shop here is owned and operated by students within the campus ecosystem.
          </p>
        </div>

        {/* Shop Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shops.map((shop: any) => (
            <Link 
              key={shop.id} 
              href={`/shops/${shop.slug}`}
              className="group relative flex flex-col gap-6 p-8 border border-zinc-100 dark:border-zinc-800 rounded-[32px] bg-white dark:bg-zinc-900/50 hover:border-[#7C3AED] dark:hover:border-[#A855F7] hover:shadow-2xl hover:shadow-purple-100 dark:hover:shadow-none transition-all duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="h-16 w-16 rounded-2xl bg-[#F5F3FF] dark:bg-[#1E1B4B] flex items-center justify-center text-[#7C3AED] dark:text-[#A855F7] group-hover:scale-110 transition-transform">
                  <Store size={32} />
                </div>
                <div className="p-2 rounded-full bg-zinc-50 dark:bg-zinc-800 text-zinc-400 group-hover:text-[#7C3AED] dark:group-hover:text-[#A855F7] transition-colors">
                  <ArrowRight size={20} />
                </div>
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">{shop.name}</h3>
                <p className="text-zinc-500 dark:text-zinc-400 line-clamp-2 text-sm leading-relaxed mb-6">
                  {shop.description || "A student-led business specializing in high-quality products and services."}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-bold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
                    {shop.category || "General"}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#F5F3FF] dark:bg-[#1E1B4B] text-xs font-bold text-[#7C3AED] dark:text-[#A855F7] uppercase tracking-widest">
                    Verified Shop
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {shops.length === 0 && (
          <div className="py-40 text-center">
            <h2 className="text-2xl font-bold text-zinc-400">No shops available at the moment.</h2>
            <p className="text-zinc-500">Stay tuned for new student ventures launching soon!</p>
          </div>
        )}

      </div>
    </div>
  );
}
