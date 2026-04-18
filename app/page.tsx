import HeroSection from "@/components/HeroSection";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default async function Home() {
  const featuredProducts = await getProducts({ limit: "4" });

  return (
    <main className="flex min-h-screen flex-col items-center bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <HeroSection />
      
      {/* Featured Products Section */}
      <section className="w-full max-w-7xl px-6 py-24 sm:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
           <div className="max-w-2xl">
              <h2 className="text-4xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] uppercase leading-none mb-4">
                 Featured <br /> <span className="text-[#7C3AED]">Student Ventures</span>
              </h2>
              <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg">
                 The latest and greatest items curated from across the campus entrepreneur community.
              </p>
           </div>
           <Link href="/products" className="group flex items-center gap-2 text-sm font-black uppercase tracking-widest text-[#7C3AED] hover:opacity-70 transition-opacity">
              See All Products <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
           {featuredProducts.map((product) => (
             <Link key={product.id} href={`/products/${product.slug}`} className="group">
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[32px] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-purple-100 dark:group-hover:shadow-none">
                  {product.images?.[0] ? (
                    <Image 
                      src={product.images[0].image} 
                      alt={product.name} 
                      fill 
                      className="object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-zinc-300">
                      <ShoppingBag size={48} className="group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                  {product.is_on_sale && (
                    <div className="absolute top-4 left-4 bg-[#7C3AED] text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg">
                      Sale
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-[#1A1A1A] dark:text-[#FBFBFB] group-hover:text-[#7C3AED] transition-colors line-clamp-1 uppercase tracking-tight">
                   {product.name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                   <span className="text-xl font-black text-[#1A1A1A] dark:text-[#FBFBFB]">
                      ${product.discount_price || product.price}
                   </span>
                </div>
             </Link>
           ))}
        </div>

        {featuredProducts.length === 0 && (
           <div className="py-20 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[48px] text-zinc-400 italic">
              No products featured yet. Stay tuned!
           </div>
        )}
      </section>

      {/* Value Proposition Section */}
      <section className="w-full bg-[#F5F3FF]/50 dark:bg-[#1E1B4B]/20 py-32 px-6 sm:px-12 lg:px-24 border-y border-[#7C3AED]/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="flex flex-col gap-6">
            <div className="h-14 w-14 rounded-3xl bg-white dark:bg-[#0A0A0A] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-center text-[#7C3AED]">
               <BarChart3 size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#FBFBFB] uppercase mb-3">Data Driven</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                Track sales trends, customer behavior, and inventory metrics through our comprehensive vendor portal.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="h-14 w-14 rounded-3xl bg-white dark:bg-[#0A0A0A] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-center text-[#7C3AED]">
               <Zap size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#FBFBFB] uppercase mb-3">M-Pesa Ready</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                Accept payments via credit card or Daraja. Secure, student-to-student transactions built for local needs.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="h-14 w-14 rounded-3xl bg-white dark:bg-[#0A0A0A] border border-zinc-100 dark:border-zinc-800 shadow-sm flex items-center justify-center text-[#7C3AED]">
               <ShieldCheck size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#FBFBFB] uppercase mb-3">Safety First</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                Every shop is campus-verified. We bridge the gap between student creativity and professional reliability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="w-full max-w-7xl px-6 py-32 sm:px-12 lg:px-24">
         <div className="relative rounded-[64px] bg-[#1A1A1A] overflow-hidden p-12 md:p-24 text-center">
            <div className="relative z-10 flex flex-col items-center">
               <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white uppercase leading-none mb-8">
                  Ready to launch?
               </h2>
               <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mb-12">
                  Join hundreds of students turning their passions into professional ventures on Sokoline.
               </p>
               <div className="flex flex-wrap justify-center gap-6">
                  <Link href="/sign-up" className="bg-[#7C3AED] text-white px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-[#6D28D9] transition-all shadow-2xl">
                     Get Started
                  </Link>
                  <Link href="/shops" className="bg-white text-[#1A1A1A] px-12 py-5 rounded-[24px] font-black uppercase tracking-widest text-sm hover:bg-zinc-100 transition-all">
                     Explore Shops
                  </Link>
               </div>
            </div>
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED]/20 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]" />
         </div>
      </section>
    </main>
  );
}
