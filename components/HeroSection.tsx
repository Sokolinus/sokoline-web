"use client";

import Image from "next/image";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";

export default function HeroSection() {
  const title = "sokoline";

  return (
    <section className="relative flex min-h-[80vh] w-full items-center justify-center overflow-hidden bg-zinc-50 dark:bg-black px-6 py-12 sm:px-12 lg:px-24">
      <div className="grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-start gap-6">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl lg:text-6xl">
            <span className="flex overflow-hidden">
              {title.split("").map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  transition={{
                    duration: 0.8,
                    delay: i * 0.05,
                    ease: [0.215, 0.61, 0.355, 1],
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            <span className="relative mt-2 block h-[1.2em]">
              <AnimatedText />
            </span>
          </h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="max-w-xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-xl"
          >
            The ultimate marketplace for student entrepreneurs. Shop from local student-led businesses, analyze your sales, and manage payments with ease.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="flex flex-wrap gap-4 mt-4"
          >
            <button className="rounded-full bg-blue-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-blue-700 active:scale-95">
              Start Shopping
            </button>
            <button className="rounded-full border-2 border-zinc-200 bg-white px-8 py-3 text-lg font-semibold text-zinc-900 transition-transform hover:scale-105 hover:border-zinc-300 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50 active:scale-95">
              Open Your Shop
            </button>
          </motion.div>
        </div>

        {/* Right Side: Image */}
        <div className="relative aspect-[4/3] w-full max-w-xl justify-self-center lg:justify-self-end">
          <div className="absolute -inset-4 rounded-3xl bg-blue-100/50 dark:bg-blue-900/20 blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-2xl">
            <Image
              src="/hero_image.png"
              alt="Sokoline Marketplace"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
