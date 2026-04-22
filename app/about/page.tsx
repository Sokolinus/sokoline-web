import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-20 font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl">
          <Image 
            src="/hero-image.jpg" 
            alt="About Sokoline" 
            fill 
            className="object-cover"
          />
        </div>
        
        <div className="space-y-8">
          <h1 className="text-6xl font-black font-logo leading-tight">
            About <span className="text-[#8484F6]">SOKOLINE</span>
          </h1>
          <p className="text-2xl text-gray-600 leading-relaxed italic">
            "Empowering the next generation of campus entrepreneurs."
          </p>
          <div className="space-y-6 text-xl text-gray-500 leading-relaxed">
            <p>
              SOKOLINE is the campus-first commerce infrastructure. We empower students to launch verified ventures and reach their peer network with professional-grade storefront tools.
            </p>
            <p>
              Every shop on our platform is owned and operated by a student within the campus ecosystem, ensuring that your support goes directly to supporting student innovation and growth.
            </p>
          </div>
          
          <Link href="/products" className="inline-block px-10 py-5 text-xl font-bold bg-black text-white rounded-3xl hover:bg-[#8484F6] transition-all shadow-xl">
            Start Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
