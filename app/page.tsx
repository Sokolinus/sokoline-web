import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import ProductCard from "@/components/sokoline/ProductCard";

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
        <div className="mt-8 rounded-3xl border border-black/5 bg-gradient-to-b from-sokoline-tertiary/25 to-gray-50 px-4 py-8 sm:mt-12 sm:px-6 sm:py-12">
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
