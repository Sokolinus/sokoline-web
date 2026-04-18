"use client";

import Image from "next/image";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  const title = "sokoline";

  return (
    <section className="relative flex min-h-[90vh] w-full flex-col items-center justify-center overflow-hidden bg-background px-6">
      
      {/* Subtle Grid Background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(var(--foreground) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="relative z-10 grid w-full max-w-7xl grid-cols-1 items-center gap-24 lg:grid-cols-2">
        
        {/* Left Side: Clean Typography */}
        <div className="flex flex-col items-start gap-12">
          <div className="space-y-4">
            <h1 className="text-6xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-7xl lg:text-9xl">
              <span className="flex overflow-hidden">
                {title.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: i * 0.02,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
              <span className="mt-2 block text-2xl font-normal lg:text-3xl">
                <AnimatedText />
              </span>
            </h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col gap-10"
          >
            <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
              A minimalist commerce engine designed for student entrepreneurs to launch and scale their ventures with total technical clarity.
            </p>
            
            <div className="flex items-center gap-10">
              <Link href="/products" className="group flex items-center gap-3 text-sm font-semibold text-sokoline-accent transition-all hover:text-sokoline-accent-hover">
                explore the collection <ArrowRight size={16} strokeWidth={1.5} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/sign-up" className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground">
                apply to sell
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Side: Clean Media */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="relative aspect-[4/5] w-full max-w-md justify-self-end"
        >
          <div className="group relative h-full w-full overflow-hidden rounded-[32px] border border-border bg-card shadow-sm transition-all hover:shadow-md">
            <Image
              src="/hero-image.jpg"
              alt="Sokoline Workspace"
              fill
              className="object-cover p-0 opacity-80 transition-opacity duration-700 group-hover:opacity-100"
              priority
            />
          </div>
          {/* Subtle floating detail */}
          <div className="absolute -left-10 top-10 hidden h-20 w-20 items-center justify-center rounded-full border border-border bg-background/40 backdrop-blur-sm lg:flex">
             <div className="h-2 w-2 rounded-full bg-border" />
          </div>
        </motion.div>
      </div>

      {/* Scroll Hint */}
      <div className="absolute bottom-10 left-6">
        <div className="h-20 w-px bg-border" />
      </div>
    </section>
  );
}
