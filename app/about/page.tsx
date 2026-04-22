import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-10 font-sans sm:px-6 sm:py-16 md:py-20">
      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2 md:gap-16">
        <div className="relative h-[320px] overflow-hidden rounded-3xl shadow-2xl sm:h-[460px] md:h-[600px] md:rounded-[3rem]">
          <Image 
            src="/hero-image.jpg" 
            alt="About Sokoline" 
            fill 
            className="object-cover"
          />
        </div>
        
        <div className="space-y-6 md:space-y-8">
          <h1 className="font-logo text-4xl leading-tight font-black sm:text-5xl md:text-6xl">
            About <span className="text-[#8484F6]">SOKOLINE</span>
          </h1>
          <p className="text-lg italic leading-relaxed text-gray-600 sm:text-xl md:text-2xl">
            “Empowering the next generation of campus entrepreneurs.”
          </p>
          <div className="space-y-4 text-base leading-relaxed text-gray-500 sm:space-y-6 sm:text-lg md:text-xl">
            <p>
              SOKOLINE is the campus-first commerce infrastructure. We empower students to launch verified ventures and reach their peer network with professional-grade storefront tools.
            </p>
            <p>
              Every shop on our platform is owned and operated by a student within the campus ecosystem, ensuring that your support goes directly to supporting student innovation and growth.
            </p>
          </div>
          
          <Link href="/products" className="inline-block rounded-2xl bg-black px-6 py-3 text-base font-bold text-white shadow-xl transition-all hover:bg-[#8484F6] sm:rounded-3xl sm:px-8 sm:py-4 sm:text-lg md:px-10 md:py-5 md:text-xl">
            Start Shopping
          </Link>
        </div>
      </div>
    </main>
  );
}
