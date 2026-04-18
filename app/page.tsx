import HeroSection from "@/components/HeroSection";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white dark:bg-[#0A0A0A]">
      <HeroSection />
      
      {/* Feature Section */}
      <section className="w-full max-w-7xl px-6 py-24 sm:px-12 lg:px-24">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <div className="h-1 w-12 bg-[#7C3AED]" />
            <h3 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#FBFBFB]">Minimalist Utility</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Designed for clarity and speed. No clutter, just the tools you need to build your business or find the best student ventures.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-1 w-12 bg-[#7C3AED]" />
            <h3 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#FBFBFB]">Gen Z Rebellion</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              A platform built by us, for us. Our aesthetic matches the raw energy of the target audience—professional but never boring.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="h-1 w-12 bg-[#7C3AED]" />
            <h3 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#FBFBFB]">Seamless Trust</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Secure payments via credit card and Daraja. We bridge the gap between student creativity and professional reliability.
            </p>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="w-full bg-[#F5F3FF] dark:bg-[#1E1B4B]/30 px-6 py-24 sm:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center text-center gap-6 mb-16">
            <h2 className="text-3xl font-bold tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] sm:text-4xl lg:text-5xl">
              built strictly for the <span className="text-[#7C3AED] dark:text-[#A855F7]">rebels</span>
            </h2>
            <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Sokoline isn't just a marketplace; it's a statement. Join the community of students redefining what it means to run a business in the digital age.
            </p>
          </div>
          <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-zinc-200 shadow-2xl">
            <Image
              src="/about-section-image.jpg"
              alt="Sokoline Community"
              fill
              className="object-cover opacity-90 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#7C3AED]/20 to-transparent" />
          </div>
        </div>
      </section>
    </main>
  );
}
