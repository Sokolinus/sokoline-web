import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, ShieldCheck, MapPin } from "lucide-react";
import { getShop, formatImageUrl } from "@/lib/api";
import ProductCard from "@/components/sokoline/ProductCard";
import { Product } from "@/lib/types";

export default async function ShopPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const shop = await getShop(slug);

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6 text-center font-sans">
        <h1 className="text-5xl font-black font-logo tracking-tighter">Vendor Not Found</h1>
        <p className="text-black/50 font-medium max-w-sm mx-auto">The student venture you're looking for might have changed its handle or is currently offline.</p>
        <Link href="/shops" className="bg-black text-white px-10 py-4 rounded-[20px] font-bold font-logo uppercase tracking-widest hover:bg-black/80 transition-all flex items-center gap-3">
          <ArrowLeft size={18} strokeWidth={3} /> Back to Shops
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-6 mb-20 font-sans">
      {/* Navigation */}
      <div className="mt-6 py-6 border-b border-black/5">
          <Link href="/shops" className="text-[10px] font-black text-black/30 hover:text-black transition-all flex items-center gap-3 uppercase tracking-[0.2em]">
            <ArrowLeft size={14} strokeWidth={3} /> Back to vendors
          </Link>
      </div>

      {/* Shop Header */}
      <section className="mt-12 p-12 bg-gray-50 rounded-[40px] border border-black/5 relative overflow-hidden">
          {/* Subtle background branding */}
          <div className="absolute -right-20 -bottom-20 opacity-[0.03] rotate-12 select-none pointer-events-none">
            <StoreIcon size={400} />
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-start md:items-center relative z-10">
            {shop.logo ? (
               <div className="relative h-40 w-40 rounded-[40px] overflow-hidden border-4 border-white bg-white shrink-0 shadow-2xl shadow-black/10">
                 <Image src={formatImageUrl(shop.logo)} alt={shop.name} fill className="object-cover" />
               </div>
            ) : (
              <div className="h-40 w-40 rounded-[40px] bg-white border border-black/5 flex items-center justify-center text-black/5 shrink-0 shadow-sm">
                <ShoppingBag size={80} strokeWidth={1} />
              </div>
            )}
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <h1 className="text-6xl font-black font-logo tracking-tighter text-black leading-tight">{shop.name}</h1>
                <div className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[10px] font-black bg-sokoline-accent text-black uppercase tracking-widest border border-sokoline-accent/30 shadow-sm">
                   <ShieldCheck size={12} strokeWidth={3} /> Verified Vendor
                </div>
              </div>
              
              <p className="text-black/60 text-xl font-medium max-w-2xl leading-relaxed mb-10">
                {shop.description || "A student-led venture committed to bringing quality items to the campus ecosystem."}
              </p>
              
              <div className="flex flex-wrap items-center gap-8">
                 <div className="flex items-center gap-3 text-[10px] text-black font-black uppercase tracking-[0.15em]">
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/40">
                      <MapPin size={16} strokeWidth={2.5} />
                    </div>
                    <span>Campus Pickup Available</span>
                 </div>
                 <div className="flex items-center gap-3 text-[10px] text-black font-black uppercase tracking-[0.15em]">
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/40">
                      <ShoppingBag size={16} strokeWidth={2.5} />
                    </div>
                    <span>{shop.products?.length || 0} Listed Items</span>
                 </div>
              </div>
            </div>
          </div>
      </section>

      {/* Products Grid */}
      <section className="mt-20">
        <div className="flex items-center gap-6 mb-12 px-6">
          <h2 className="text-[36px] font-black font-logo tracking-tight text-black whitespace-nowrap leading-none">Shop Inventory</h2>
          <div className="h-0.5 flex-1 bg-black/5 rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {shop.products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {(!shop.products || shop.products.length === 0) && (
          <div className="py-32 text-center bg-gray-50 rounded-[40px] border border-dashed border-black/10">
             <div className="h-16 w-16 rounded-[24px] bg-white border border-black/5 flex items-center justify-center text-black/10 mx-auto mb-6 shadow-sm">
               <ShoppingBag size={32} />
             </div>
             <h3 className="text-xl font-black font-logo text-black tracking-tight mb-2">No active listings</h3>
             <p className="text-black/40 font-medium uppercase text-[10px] tracking-widest">Check back soon for new drops</p>
          </div>
        )}
      </section>
    </main>
  );
}

function StoreIcon(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
      <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7" />
    </svg>
  );
}
