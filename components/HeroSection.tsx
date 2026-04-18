"use client";

import Image from "next/image";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";
import Link from "next/link";

export default function HeroSection() {
  const title = "sokoline";

  return (
    <section className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden px-6 py-12 sm:px-12 lg:px-24">
      <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start gap-6">
          <h1 className="flex flex-nowrap items-center gap-x-4 text-4xl font-bold tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] sm:text-5xl lg:text-7xl">
            <span className="flex overflow-hidden pb-1">
              {title.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                    ease: [0.33, 1, 0.68, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <span className="relative inline-block h-[1.2em] text-[#7C3AED] dark:text-[#A855F7]">
              <AnimatedText />
            </span>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl font-medium"
          >
            The dedicated platform for student-led businesses. Launch your shop, analyze your growth, and manage payments with professional-grade tools.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <Link 
              href="/products" 
              className="rounded-full bg-[#7C3AED] px-8 py-3 text-lg font-bold text-white transition-all hover:scale-[1.02] hover:bg-[#6D28D9] active:scale-95"
            >
              Browse Products
            </Link>
            <Link 
              href="/dashboard" 
              className="rounded-full border border-zinc-300 bg-transparent px-8 py-3 text-lg font-bold text-zinc-900 transition-all hover:scale-[1.02] hover:border-[#7C3AED] hover:text-[#7C3AED] dark:border-zinc-700 dark:text-zinc-100 dark:hover:border-[#A855F7] dark:hover:text-[#A855F7] active:scale-95"
            >
              Launch Your Shop
            </Link>
          </motion.div>
        </div>

        {/* Right Side: Image */}
        <div className="relative aspect-[4/3] w-full max-w-xl justify-self-center lg:justify-self-end">
          <div className="absolute -inset-4 rounded-3xl bg-[#7C3AED]/15 dark:bg-[#A855F7]/20 blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <Image
              src="/hero_image.png"
              alt="Sokoline Marketplace"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
