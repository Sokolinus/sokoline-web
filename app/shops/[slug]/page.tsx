import Image from "next/image";
import Link from "next/link";
import { Metadata } from 'next';
import { ArrowLeft, ShoppingBag, ShieldCheck, MapPin } from "lucide-react";
import { getShop, formatImageUrl } from "@/lib/api";
import ProductCard from "@/components/sokoline/ProductCard";
import { Product } from "@/lib/types";

interface ShopPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;
  const shop = await getShop(slug);
  
  if (!shop) return { title: 'Shop Not Found' };

  return {
    title: `${shop.name} | Sokoline`,
    description: shop.description.substring(0, 160),
    openGraph: {
      title: shop.name,
      description: shop.description,
      images: shop.logo ? [formatImageUrl(shop.logo)] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: shop.name,
      description: shop.description,
      images: shop.logo ? [formatImageUrl(shop.logo)] : [],
    }
  };
}

export default async function ShopPage({ params }: ShopPageProps) {
  const { slug } = await params;
  const shop = await getShop(slug);

  if (!shop) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8 px-6 text-center font-sans">
        <h1 className="text-5xl font-black font-logo tracking-tighter">Vendor Not Found</h1>
        <Link href="/shops" className="bg-black text-white px-10 py-4 rounded-[20px] font-bold font-logo uppercase tracking-widest hover:bg-black/80 transition-all flex items-center gap-3">
          <ArrowLeft size={18} />
          All Vendors
        </Link>
      </div>
    );
  }

  const products = shop.products || [];

  return (
    <main className="min-h-screen bg-gray-50/50">
      {/* Dynamic Header */}
      <div className="bg-zinc-900 pt-12 pb-24 md:pt-20 md:pb-32 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sokoline-accent/10 blur-[150px] -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-sokoline-tertiary/5 blur-[150px] -ml-64 -mb-64" />
        
        <div className="mx-auto max-w-7xl px-4 md:px-10">
          <div className="mb-12">
            <Link href="/shops" className="text-[10px] font-black text-white/30 hover:text-white transition-all flex items-center gap-3 uppercase tracking-[0.2em]">
              <ArrowLeft size={14} />
              Back to Campus Marketplace
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-12 items-start md:items-end relative z-10">
            {shop.logo ? (
               <div className="relative h-40 w-40 rounded-[40px] overflow-hidden border-4 border-white bg-white shrink-0 shadow-2xl shadow-black/10">
                 <Image src={formatImageUrl(shop.logo)} alt={shop.name} fill className="object-cover object-top" sizes="160px" />
               </div>
            ) : (
              <div className="h-40 w-40 rounded-[40px] bg-white border border-black/5 flex items-center justify-center text-black/5 shrink-0 shadow-sm">
                <ShoppingBag size={80} strokeWidth={1} />
              </div>
            )}

            <div className="flex-1 space-y-6">
              <div className="space-y-1">
                <div className="flex items-center gap-4">
                  <h1 className="text-4xl md:text-6xl font-black text-white font-logo tracking-tighter uppercase leading-none">{shop.name}</h1>
                  <div className="px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm hidden sm:block">
                     <span className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-1.5">
                       <ShieldCheck size={12} className="text-sokoline-tertiary" />
                       Verified Student Venture
                     </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/40 font-logo text-xs uppercase tracking-widest font-black">
                   <MapPin size={12} className="text-sokoline-accent" />
                   {shop.pickup_point || "Campus Wide"}
                </div>
              </div>
              <p className="text-white/60 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                {shop.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="mx-auto max-w-7xl px-4 md:px-10 -mt-12 relative z-20 mb-20">
        <div className="bg-white rounded-[3rem] border border-black/5 p-8 md:p-12 shadow-2xl shadow-black/5">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-2xl font-black text-gray-900 font-logo uppercase tracking-tight">Venture Inventory</h2>
              <p className="text-sm text-gray-400 font-medium">{products.length} Items Available</p>
            </div>
            <div className="h-px flex-1 bg-gray-100 mx-8 hidden md:block" />
          </div>

          {products.length === 0 ? (
            <div className="py-24 text-center">
               <div className="inline-flex h-20 w-20 items-center justify-center rounded-[2.5rem] bg-gray-50 text-gray-200 mb-6">
                  <ShoppingBag size={40} />
               </div>
               <p className="text-xl font-black text-gray-900 font-logo uppercase tracking-tighter">This shop is empty</p>
               <p className="text-gray-400 font-medium">The student is currently updating their stock. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product: Product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
