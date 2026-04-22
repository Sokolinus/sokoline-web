"use client";

import Image from "next/image";
import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";
import { ArrowRight, Crown } from "lucide-react";
import Link from "next/link";
import { Show } from "@clerk/nextjs";

export default function HeroSection() {
  return (
    <section className="w-full bg-[#8484F6] py-32 relative flex items-center text-white min-h-[900px] overflow-hidden">
      {/* Decorative SVG Accents */}
      <div className="absolute top-20 left-10 opacity-20 pointer-events-none">
        <svg width="300" height="300" viewBox="0 0 100 100" fill="white">
          <circle cx="2" cy="2" r="1" />
          <circle cx="22" cy="2" r="1" />
          <circle cx="42" cy="2" r="1" />
          <circle cx="2" cy="22" r="1" />
          <circle cx="22" cy="22" r="1" />
          <circle cx="42" cy="22" r="1" />
          <circle cx="2" cy="42" r="1" />
          <circle cx="22" cy="42" r="1" />
          <circle cx="42" cy="42" r="1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto w-full px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        
        {/* Left: Subtly Slanted Premium Phone Mockup Showcase */}
        <div className="relative flex justify-center items-center h-[600px] md:h-[750px] order-2 lg:order-1">
          
          {/* Top Layer: PREMIUM WHITE iPhone Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -50, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: 5 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Outer Hardware Frame (Silver/Chrome) */}
            <div 
              className="relative p-[6px] bg-[#fdfdfd] shadow-[-10px_30px_80px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-[1.03] border border-white/20"
              style={{
                width: 'calc(95vmin / 2.525)',
                height: 'calc(2.15 * (95vmin / 2.525))',
                borderRadius: 'calc((95vmin / 2.525) / 5)',
                maxHeight: '700px',
                maxWidth: 'calc(700px / 2.15)'
              }}
            >
              {/* Side Buttons (Left) */}
              <div className="absolute left-[-2px] top-24 w-[3px] h-12 bg-[#e5e5e5] rounded-r-sm shadow-sm border-r border-black/5" />
              <div className="absolute left-[-2px] top-40 w-[3px] h-12 bg-[#e5e5e5] rounded-r-sm shadow-sm border-r border-black/5" />
              
              {/* Power Button (Right) */}
              <div className="absolute right-[-2px] top-32 w-[3px] h-16 bg-[#e5e5e5] rounded-l-sm shadow-sm border-l border-black/5" />

              {/* Inner White Bezel & Screen */}
              <div className="relative w-full h-full bg-white rounded-[calc((95vmin/2.525)/5.8)] overflow-hidden shadow-inner border-[6px] border-white">
                
                {/* Ear Speaker */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-10 h-0.5 bg-black/5 rounded-full z-30" />

                {/* Dynamic Island */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-30 flex items-center justify-end px-2.5">
                   <div className="w-1 h-1 bg-[#1a1a1a] rounded-full" />
                </div>
                
                {/* The Video (The Screen) */}
                <div className="relative w-full h-full overflow-hidden rounded-[1.8rem]">
                  <video 
                    src="/hero-video-optimized.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  {/* Internal Screen Shadow (Depth) */}
                  <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.15)] pointer-events-none" />
                </div>

                {/* Glass Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none z-20" />
              </div>
            </div>
            
            {/* Background Glow */}
            <div className="absolute inset-0 bg-white/10 blur-3xl -z-10 scale-150" />
          </motion.div>
        </div>

        {/* Right: Content (Nudged Left with negative margin) */}
        <div className="space-y-10 z-20 order-1 lg:order-2 lg:-ml-20">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4 relative"
          >
            {/* The Crown atop the 'I' in SOKOLINE */}
            <motion.div
              initial={{ opacity: 0, y: -20, rotate: -15 }}
              animate={{ opacity: 1, y: 0, rotate: -8 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -top-12 left-[62%] text-yellow-300 drop-shadow-lg z-30"
            >
              <Crown size={60} fill="currentColor" strokeWidth={1} />
            </motion.div>

            <h1 className="text-6xl md:text-7xl lg:text-9xl font-black tracking-tight font-logo leading-[0.85] drop-shadow-sm">
              SOKOLINE
            </h1>
            <div className="text-2xl md:text-3xl text-white/90 italic font-medium tracking-tight">
              <AnimatedText />
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-xl md:text-2xl text-white/80 max-w-xl leading-snug font-medium"
          >
            Support student entrepreneurs. Every item here is owned and operated by students within the campus ecosystem.
          </motion.p>

          <div className="flex flex-wrap gap-6 pt-4 font-logo">
            <Link href="/products" className="px-10 py-5 text-xl font-bold bg-white text-[#8484F6] rounded-[2rem] hover:bg-black hover:text-white transition-all shadow-xl flex items-center gap-3 group border-2 border-white">
              Browse Items <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link href="/about" className="px-10 py-5 text-xl font-bold bg-white/10 backdrop-blur-md text-white border-2 border-white/20 rounded-[2rem] hover:bg-white hover:text-[#8484F6] transition-all shadow-lg">
              About Us
            </Link>
          </div>
        </div>

      </div>

      {/* Subtle bottom gradient to transition to next section */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </section>
  );
}
