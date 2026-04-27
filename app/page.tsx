import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories, formatImageUrl } from "@/lib/api";
import ProductCard from "@/components/sokoline/ProductCard";
import { ArrowUpRight } from "lucide-react";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: "6" }),
    getCategories()
  ]);
  
  const newestItems = products;

  return (
    <main className="mb-16 font-sans sm:mb-20">
      <HeroSection />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Newest Items Section */}
        <div className="mt-8 rounded-3xl border border-black/5 bg-gradient-to-b from-[#BEFDB140] to-gray-50 px-4 py-8 sm:mt-12 sm:px-6 sm:py-12">
          <h2 className="mb-8 text-center font-logo text-3xl font-bold sm:mb-12 sm:text-[36px]">Newest items</h2>

          <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3">
              {newestItems.map((item) => (
                  <ProductCard key={item.id} product={item} />
              ))}
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-8 rounded-3xl border border-black/5 bg-gray-100 px-4 py-8 sm:mt-12 sm:px-6 sm:py-12">
          <h2 className="mb-8 text-center font-logo text-3xl font-bold sm:mb-12 sm:text-[36px]">Categories</h2>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-6">
              {categories.map((category) => (
                  <div key={category.id}>
                      <Link href={`/products?category=${category.slug}`}>
                          <div className="rounded-2xl border border-black/5 bg-white p-4 text-center transition-all hover:shadow-md sm:p-6">
                              <h2 className="font-logo text-base font-bold text-gray-900 sm:text-lg">{category.name}</h2>
                              <p className="text-black/40 text-[10px] mt-1 uppercase tracking-widest font-bold">Explore</p>
                          </div>
                      </Link>
                  </div>
              ))}
          </div>
        </div>

        {/* Marketplace Vision Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="p-10 rounded-[2.5rem] bg-gray-50 border border-black/5 flex flex-col justify-center">
              <h3 className="text-sm font-black text-sokoline-accent uppercase tracking-widest mb-4">For Vendors</h3>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-[0.95] mb-6 font-logo">Launch in<br/>record time.</h2>
              <p className="text-gray-500 font-medium text-lg leading-relaxed mb-8">
                The campus-first dashboard for student CEOs. Manage your visual identity, inventory, and automated payouts with professional-grade tools.
              </p>
              <Link href="/dashboard/my-shop" className="text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
                Open your storefront <ArrowUpRight size={18} />
              </Link>
           </div>
           <div className="p-10 rounded-[2.5rem] bg-[#BEFDB1]/10 border border-[#BEFDB1]/20 flex flex-col justify-center">
              <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4">For Partners</h3>
              <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-[0.95] mb-6 font-logo">Monetize your<br/>influence.</h2>
              <p className="text-gray-500 font-medium text-lg leading-relaxed mb-8">
                Join our Social Partner program. Earn up to 20% commission by promoting your favorite student ventures to your network.
              </p>
              <Link href="/dashboard/influencer" className="text-sm font-black uppercase tracking-widest flex items-center gap-2 hover:translate-x-2 transition-transform">
                Browse campaigns <ArrowUpRight size={18} />
              </Link>
           </div>
        </div>

        {/* Affiliate CTA Section */}
        <div className="mt-16 bg-[#121212] rounded-[3rem] overflow-hidden shadow-2xl shadow-black/5 grid grid-cols-1 lg:grid-cols-2">
           {/* Left: Content */}
           <div className="p-10 md:p-20 flex flex-col justify-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sokoline-accent/20 blur-[100px]" />
              
              <div className="relative z-10 space-y-6">
                <span className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-white uppercase tracking-[0.3em] w-fit inline-block">Affiliate Marketing for Students</span>
                <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none font-logo uppercase">
                    Get Paid to <br /> <span className="text-sokoline-accent">Promote.</span>
                </h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed max-w-md">
                    Are you a campus influencer? Share links to your favorite student shops and earn <span className="text-white">5% commission</span> on every sale.
                </p>

                <Link 
                    href="/dashboard/influencer"
                    className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-white text-black rounded-[1.5rem] font-black text-lg transition-all hover:scale-105 active:scale-95"
                >
                    Join the Squad
                    <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              </div>
           </div>

           {/* Right: Visual */}
           <div className="relative hidden lg:block min-h-[500px]">
              <Image 
                  src="/social-media.jpg" 
                  alt="Social Media Growth" 
                  fill 
                  className="object-cover"
                  sizes="50vw"
                  priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent opacity-60" />
           </div>
        </div>

        <footer className="mt-8 flex flex-col justify-between rounded-3xl bg-black px-5 py-8 text-white sm:mt-12 sm:px-8 sm:py-12 md:flex-row md:px-10">
          <div className="mb-8 w-full md:mb-0 md:w-2/3 md:pr-10">
            <h3 className="mb-5 font-logo font-bold text-white/50 uppercase tracking-widest text-[10px]">About</h3>
            <p className="font-sans text-base leading-relaxed text-white/80 sm:text-xl">
              SOKOLINE is the campus-first commerce infrastructure. We empower students to launch verified ventures and reach their peer network with professional-grade storefront tools.
            </p>
          </div>

          <div className="w-full md:w-1/3">
            <h3 className="mb-5 font-logo font-bold text-white/50 uppercase tracking-widest text-[10px]">Menu</h3>

            <ul className="space-y-3 font-logo">
              <li>
                <Link href="#" className="text-lg text-white hover:text-white/60 transition-colors font-medium">About</Link>
              </li>
              <li>
                <Link href="#" className="text-lg text-white hover:text-white/60 transition-colors font-medium">Contact</Link>
              </li>
              <li>
                <Link href="#" className="text-lg text-white hover:text-white/60 transition-colors font-medium">Privacy policy</Link>
              </li>
              <li>
                <Link href="#" className="text-lg text-white hover:text-white/60 transition-colors font-medium">Terms of use</Link>
              </li>
            </ul>
          </div>
        </footer>
      </div>
    </main>
  );
}
