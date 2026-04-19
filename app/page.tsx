import HeroSection from "@/components/HeroSection";
import Link from "next/link";
import { getProducts, getCategories } from "@/lib/api";
import { mockProducts } from "@/lib/mockProducts";
import ProductCard from "@/components/sokoline/ProductCard";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getProducts({ limit: "6" }),
    getCategories()
  ]);
  
  const newestItems = products.length > 0 ? products : mockProducts.slice(0, 6);

  return (
    <main className="max-w-7xl mx-auto px-6 mb-20 font-sans">
      <HeroSection />
      
      {/* Newest Items Section */}
      <div className="mt-6 px-6 py-12 bg-gray-100 rounded-xl">
        <h2 className="mb-12 text-[36px] text-center font-logo font-bold">Newest items</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {newestItems.map((item) => (
                <ProductCard key={item.id} product={item} />
            ))}
        </div>
      </div>

      {/* Categories Section */}
      <div className="mt-6 px-6 py-12 bg-gray-100 rounded-xl">
        <h2 className="mb-12 text-[36px] text-center font-logo font-bold">Categories</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
                <div key={category.id}>
                    <Link href={`/products?category=${category.slug}`}>
                        <div className="p-6 bg-white rounded-xl hover:shadow-md transition-all text-center border border-black/5">
                            <h2 className="text-lg font-logo font-bold text-gray-900">{category.name}</h2>
                            <p className="text-black/40 text-[10px] mt-1 uppercase tracking-widest font-bold">Explore</p>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
      </div>

      <footer className="mt-12 py-12 px-10 flex flex-col md:flex-row justify-between bg-black rounded-xl text-white">
        <div className="w-full md:w-2/3 pr-10 mb-8 md:mb-0">
          <h3 className="mb-5 font-logo font-bold text-white/50 uppercase tracking-widest text-[10px]">About</h3>
          <p className="text-xl text-white/80 leading-relaxed font-sans">
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
    </main>
  );
}
