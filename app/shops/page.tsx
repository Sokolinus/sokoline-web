import Image from "next/image";
import Link from "next/link";
import { Store, ArrowRight, ShieldCheck } from "lucide-react";
import { getShops, formatImageUrl } from "@/lib/api";
import { Shop } from "@/lib/types";

export default async function ShopsPage() {
  const shops = await getShops();

  return (
    <main className="mx-auto mb-16 max-w-7xl px-4 font-sans sm:mb-20 sm:px-6">
      <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-b border-black/5 py-6 sm:mt-6 sm:gap-4 sm:py-8">
         <h1 className="font-logo text-3xl leading-none font-black tracking-tighter text-black sm:text-[48px]">Campus Vendors</h1>
         <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/40 sm:text-xs">Verified Student Ventures</p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:gap-6 md:mt-12 md:grid-cols-3 md:gap-8">
        {shops.map((shop: Shop) => (
          <div key={shop.id} className="group flex flex-col">
            <Link href={`/shops/${shop.slug}`} className="flex flex-1 flex-col overflow-hidden rounded-[28px] border border-black/5 bg-gray-50 transition-all hover:border-black/10 hover:bg-white hover:shadow-2xl hover:shadow-black/5 sm:rounded-[40px]">
              <div className="relative h-64 w-full overflow-hidden bg-white border-b border-black/5">
                {shop.logo ? (
                  <Image 
                    src={formatImageUrl(shop.logo)} 
                    alt={shop.name} 
                    fill 
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105" 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-black/10">
                    <Store size={64} strokeWidth={1} />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col p-5 sm:p-7 md:p-10">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="font-logo text-xl font-black leading-tight tracking-tight text-black transition-colors group-hover:text-black/60 sm:text-2xl">{shop.name}</h2>
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-black text-white group-hover:bg-sokoline-accent group-hover:text-black transition-all">
                    <ArrowRight size={20} strokeWidth={3} />
                  </div>
                </div>
                
                <p className="mb-6 flex-1 line-clamp-3 text-sm leading-relaxed text-black/50 sm:mb-8">
                  {shop.description || "Campus-verified student venture providing high-quality services and products within the university ecosystem."}
                </p>
                
                <div className="flex flex-wrap gap-3 mt-auto">
                  <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-black/5 text-black/60 uppercase tracking-widest border border-black/5">
                    {shop.category || "General"}
                  </span>
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black bg-sokoline-accent/20 text-black uppercase tracking-widest border border-sokoline-accent/30">
                    <ShieldCheck size={12} strokeWidth={3} /> Verified
                  </span>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {shops.length === 0 && (
        <div className="py-40 flex flex-col items-center justify-center text-center bg-gray-50 rounded-[40px] border border-dashed border-black/10 gap-6 mt-12">
          <div className="h-20 w-20 rounded-[30px] bg-white flex items-center justify-center text-black/10 border border-black/5 shadow-sm">
             <Store size={40} />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black font-logo text-black tracking-tight">No shops available</h2>
            <p className="text-black/40 font-medium max-w-xs mx-auto leading-relaxed">The campus marketplace is preparing for the next wave of student launches. Stay tuned!</p>
          </div>
        </div>
      )}
    </main>
  );
}
