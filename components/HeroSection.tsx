"use client";

import Image from "next/image";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Show } from "@clerk/nextjs";

export default function HeroSection() {
  return (
    <section className="mt-6 px-8 py-16 bg-[#8484F6] rounded-3xl overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left: Apple-Style iPhone XS Mockup */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex justify-center md:justify-start"
        >
          <div 
            className="group relative overflow-hidden bg-black transition-all duration-300 ease-linear hover:shadow-[0_0.5em_3em_0.25em_rgba(0,0,0,0.33)]"
            style={{
              /* Proportions from your CSS snippet */
              width: 'calc(60vmin / 2.525)',
              height: 'calc(2.15 * (60vmin / 2.525))',
              border: 'solid #111',
              borderWidth: 'calc((60vmin / 2.525) / 15.625)',
              borderRadius: 'calc((60vmin / 2.525) / 5.86)',
              boxShadow: '0 0.5em 2em 0.2em rgba(0, 0, 0, 0.33), 0 0 0 0.5px #000 inset',
            }}
          >
            {/* The Video Layer */}
            <video 
              src="/hero-video-optimized.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />

            {/* Dark Gradient Overlay (from your snippet) */}
            <div 
              className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111] transition-opacity duration-300 group-hover:opacity-0 pointer-events-none z-10" 
            />

            {/* iPhone Notch */}
            <div 
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#111] z-20"
              style={{
                width: '50%',
                height: 'calc((60vmin / 2.525) / 12)',
                borderBottomLeftRadius: '1.5vmin',
                borderBottomRightRadius: '1.5vmin',
              }}
            />
          </div>
        </motion.div>

        {/* Right: Content */}
        <div className="space-y-8 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-6xl md:text-7xl font-black tracking-tighter font-logo leading-none">
              SOKOLINE
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-2xl text-white/90 italic font-medium"
          >
            <AnimatedText />
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-xl text-white/80 max-w-xl leading-relaxed"
          >
            Support student entrepreneurs. Every item here is owned and operated by students within the campus ecosystem.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-4 pt-4 font-logo"
          >
            <Link href="/products" className="px-8 py-4 text-lg font-bold bg-black text-white rounded-2xl hover:bg-gray-900 transition-all shadow-lg flex items-center gap-2">
              Browse Items <ArrowRight className="w-5 h-5" />
            </Link>
            <Show when="signed-in">
              <Link href="/dashboard" className="px-8 py-4 text-lg font-bold bg-white text-[#8484F6] rounded-2xl hover:bg-white/90 transition-all shadow-lg">
                Open your shop
              </Link>
            </Show>
            <Show when="signed-out">
              <Link href="/sign-up" className="px-8 py-4 text-lg font-bold bg-white text-[#8484F6] rounded-2xl hover:bg-white/90 transition-all shadow-lg">
                Open your shop
              </Link>
            </Show>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
