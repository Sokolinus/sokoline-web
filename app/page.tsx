import HeroSection from "@/components/HeroSection";
import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/lib/api";
import { ShoppingBag, ArrowRight, ShieldCheck, Zap, BarChart3 } from "lucide-react";

export default async function Home() {
  const featuredProducts = await getProducts({ limit: "4" });

  return (
    <main className="flex min-h-screen flex-col items-center bg-background transition-colors duration-300">
      <HeroSection />
      
      {/* Featured Drop: Minimal Grid */}
      <section className="w-full max-w-7xl px-6 py-40 sm:px-12 lg:px-24">
        <div className="flex flex-col gap-24">
          <div className="flex flex-col items-start justify-between gap-10 border-b border-border pb-16 md:flex-row md:items-end">
             <div className="space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-muted-foreground/60">curated selection</p>
                <h2 className="text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
                   featured drop
                </h2>
             </div>
             <Link href="/products" className="group flex items-center gap-4 text-xs font-semibold text-foreground transition-all hover:text-sokoline-accent">
                view all <ArrowRight size={14} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
             </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-10 gap-y-20 sm:grid-cols-2 lg:grid-cols-4">
             {featuredProducts.map((product) => (
               <Link key={product.id} href={`/products/${product.slug}`} className="group block space-y-6">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl border border-border bg-card transition-all duration-700 group-hover:border-border/80 group-hover:shadow-lg">
                    {product.images?.[0] ? (
                      <Image 
                        src={product.images[0].image} 
                        alt={product.name} 
                        fill 
                        className="object-cover opacity-90 transition-transform duration-[2s] group-hover:scale-105 group-hover:opacity-100" 
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-muted-foreground/20">
                        <ShoppingBag size={40} strokeWidth={1} />
                      </div>
                    )}
                    {product.is_on_sale && (
                      <div className="absolute top-4 left-4 rounded-full border border-border bg-background/80 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-foreground backdrop-blur-md">
                        limited
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 px-2 text-center">
                    <p className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">{product.shop_name}</p>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-sokoline-accent">
                       {product.name}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground tracking-tight">${product.discount_price || product.price}</p>
                  </div>
               </Link>
             ))}
          </div>

          {featuredProducts.length === 0 && (
             <div className="py-20 text-center text-muted-foreground/40 font-medium italic text-sm">
                awaiting next synchronization
             </div>
          )}
        </div>
      </section>

      {/* Narrative Section: Deep Focus */}
      <section className="relative w-full border-y border-border bg-muted/30 py-40">
        <div className="mx-auto max-w-4xl px-6 text-center space-y-10">
           <h2 className="text-4xl font-semibold leading-[1.2] tracking-tight text-foreground md:text-5xl">
             We are building the technical bridge between student ambition and professional commerce.
           </h2>
           <p className="mx-auto max-w-2xl text-lg font-normal leading-relaxed text-muted-foreground">
             a unified engine for student founders to launch, scale, and manage their ventures without the friction of modern infrastructure.
           </p>
           <div className="flex justify-center gap-12 pt-6">
              <div className="flex flex-col items-center gap-2">
                 <span className="text-3xl font-semibold tracking-tighter text-foreground">15k+</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">active users</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                 <span className="text-3xl font-semibold tracking-tighter text-foreground">240+</span>
                 <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">student ventures</span>
              </div>
           </div>
        </div>
      </section>

      {/* Feature Grid: Clean Functionalism */}
      <section className="w-full max-w-7xl px-6 py-40 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-24 lg:grid-cols-3">
          <div className="space-y-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
               <BarChart3 size={20} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">venture analytics</h3>
            <p className="text-sm font-normal leading-relaxed text-muted-foreground">
              full visibility into your unit economics and inventory flow through a unified portal.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
               <Zap size={20} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">instant settlement</h3>
            <p className="text-sm font-normal leading-relaxed text-muted-foreground">
              synchronized m-pesa (daraja) processing with zero-friction checkout logic.
            </p>
          </div>
          <div className="space-y-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground">
               <ShieldCheck size={20} strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-semibold tracking-tight text-foreground">campus verified</h3>
            <p className="text-sm font-normal leading-relaxed text-muted-foreground">
              a trusted intermediary layer protecting both student founders and campus shoppers.
            </p>
          </div>
        </div>
      </section>

      {/* Statement CTA: Final Minimal Focus */}
      <section className="flex w-full flex-col items-center justify-center px-6 py-80 text-center">
         <h2 className="mb-20 max-w-4xl text-5xl font-semibold leading-[1] tracking-tighter text-foreground md:text-8xl">
           start your venture today.
         </h2>
         <div className="flex flex-col items-center gap-12 sm:flex-row">
            <Link href="/sign-up" className="text-sm font-semibold text-sokoline-accent underline underline-offset-8 transition-all hover:text-sokoline-accent-hover">
               join the ecosystem
            </Link>
            <span className="hidden h-8 w-px bg-border sm:block" />
            <Link href="/shops" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
               explore all shops
            </Link>
         </div>
      </section>

      <footer className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-10 border-t border-border px-6 py-20 md:flex-row">
         <div className="space-y-2 text-center md:text-left">
            <p className="text-sm font-bold tracking-tight text-foreground">sokoline</p>
            <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground/60">© 2026 unified commerce infrastructure</p>
         </div>
         <div className="flex gap-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
            {['instagram', 'twitter', 'support'].map((link) => (
              <Link key={link} href="#" className="transition-colors hover:text-foreground">{link}</Link>
            ))}
         </div>
      </footer>
    </main>
  );
}
