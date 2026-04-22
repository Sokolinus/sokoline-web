"use client";

import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";
import { ArrowRight, Crown } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[820px] w-full items-center overflow-hidden bg-[#8484F6] py-20 pt-28 text-white sm:min-h-[880px] sm:pt-32 md:min-h-[900px] md:py-28">
      {/* Decorative SVG Accents */}
      <div className="absolute top-10 md:top-20 left-10 opacity-20 pointer-events-none">
        <svg width="200" height="200" className="md:w-[300px] md:h-[300px]" viewBox="0 0 100 100" fill="white">
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

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:gap-12 sm:px-6 md:gap-16 md:px-8 lg:grid-cols-2">
        
        {/* Phone Mockup (Top on Mobile, Left on Desktop) */}
        <div className="relative order-2 flex h-[390px] items-center justify-center sm:h-[450px] md:h-[650px] lg:order-1 lg:h-[750px]">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -30, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, x: 0, rotate: 5 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative z-10"
          >
            {/* Outer Hardware Frame */}
            <div 
              className="relative p-[5px] md:p-[6px] bg-[#fdfdfd] shadow-[-10px_30px_80px_rgba(0,0,0,0.4)] transition-transform duration-500 hover:scale-[1.03] border border-white/20"
              style={{
                width: 'calc(80vmin / 2.525)',
                height: 'calc(2.15 * (80vmin / 2.525))',
                borderRadius: 'calc((80vmin / 2.525) / 5)',
                maxHeight: '650px',
                maxWidth: 'calc(650px / 2.15)'
              }}
            >
              {/* Inner White Bezel & Screen */}
              <div className="relative w-full h-full bg-white rounded-[calc((80vmin/2.525)/5.8)] overflow-hidden shadow-inner border-[4px] md:border-[6px] border-white">
                
                {/* Ear Speaker */}
                <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-8 md:w-10 h-0.5 bg-black/5 rounded-full z-30" />

                {/* Dynamic Island */}
                <div className="absolute top-3 md:top-4 left-1/2 -translate-x-1/2 w-16 md:w-20 h-4 md:h-5 bg-black rounded-full z-30 flex items-center justify-end px-2 md:px-2.5">
                   <div className="w-0.5 md:w-1 h-0.5 md:h-1 bg-[#1a1a1a] rounded-full" />
                </div>
                
                <div className="relative w-full h-full overflow-hidden rounded-[1.2rem] md:rounded-[1.8rem]">
                  <video 
                    src="/hero-video-optimized.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.15)] pointer-events-none" />
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none z-20" />
              </div>
            </div>
            
            <div className="absolute inset-0 bg-white/10 blur-3xl -z-10 scale-150" />
          </motion.div>
        </div>

        {/* Content (Bottom on Mobile, Right on Desktop) */}
         <div className="order-1 z-20 space-y-5 text-center md:space-y-8 lg:order-2 lg:-ml-20 lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-2 md:space-y-4 relative"
          >
            {/* The Crown atop the 'I' - Adjusted for responsive centering */}
            <motion.div
              initial={{ opacity: 0, y: -20, rotate: -15 }}
              animate={{ opacity: 1, y: 0, rotate: -8 }}
              transition={{ delay: 0.8, duration: 0.6 }}
               className="absolute -top-7 left-[62%] z-30 text-yellow-300 drop-shadow-lg md:-top-12 md:left-[62%]"
            >
              <Crown className="w-8 h-8 md:w-[60px] md:h-[60px]" fill="currentColor" strokeWidth={1} />
            </motion.div>

            <h1 className="font-logo text-5xl leading-[0.85] font-black tracking-tight drop-shadow-sm sm:text-6xl md:text-7xl lg:text-9xl">
              SOKOLINE
            </h1>
            <div className="h-[1.8em] text-base italic tracking-tight text-white/90 sm:text-lg md:text-2xl lg:text-3xl">
              <AnimatedText />
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
             className="mx-auto max-w-xl text-sm leading-snug text-white/85 sm:text-base md:text-xl lg:mx-0 lg:text-2xl"
          >
            Support student entrepreneurs. Every item here is owned and operated by students within the campus ecosystem.
          </motion.p>

          <div className="flex flex-wrap justify-center gap-3 pt-2 font-logo sm:gap-4 md:gap-6 md:pt-4 lg:justify-start">
            <Link href="/products" className="group flex items-center gap-2 rounded-2xl border-2 border-white bg-white px-5 py-3 text-sm font-bold text-[#8484F6] shadow-xl transition-all hover:bg-black hover:text-white sm:px-6 sm:text-base md:gap-3 md:rounded-[2rem] md:px-10 md:py-5 md:text-xl">
              Browse Items <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 md:h-6 md:w-6" />
            </Link>
            
            <Link href="/about" className="rounded-2xl border-2 border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-white hover:text-[#8484F6] sm:px-6 sm:text-base md:rounded-[2rem] md:px-10 md:py-5 md:text-xl">
              About Us
            </Link>
          </div>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </section>
  );
}
