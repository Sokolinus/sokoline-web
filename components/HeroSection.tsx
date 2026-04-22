"use client";

import AnimatedText from "./AnimatedText";
import { motion } from "framer-motion";
import { ArrowRight, Crown } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[900px] w-full items-center overflow-hidden bg-[#8484F6] py-16 md:py-28 text-white sm:min-h-[1000px]">
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

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 md:gap-16 md:px-8 lg:grid-cols-2">
        
        {/* Phone Mockup + Buttons - Larger on Mobile */}
        <div className="relative order-2 flex flex-col items-center justify-center lg:order-1">
          
          <div className="relative z-10 rotate-[5deg] mb-12 lg:mb-16">
            {/* Outer Hardware Frame */}
            <div 
              className="relative p-[5px] md:p-[6px] bg-[#fdfdfd] shadow-[-10px_30px_80px_rgba(0,0,0,0.4)] border border-white/20"
              style={{
                /* Supersized mobile size (110vmin), desktop (85vmin) */
                width: 'calc(var(--phone-size, 110vmin) / 2.525)',
                height: 'calc(2.15 * (var(--phone-size, 110vmin) / 2.525))',
                borderRadius: 'calc((var(--phone-size, 110vmin) / 2.525) / 5)',
                maxHeight: '750px',
                maxWidth: 'calc(750px / 2.15)'
              }}
            >
              {/* CSS Variable for responsive scaling */}
              <style jsx>{`
                div { --phone-size: 110vmin; }
                @media (min-width: 1024px) {
                  div { --phone-size: 85vmin; }
                }
              `}</style>

              {/* Inner White Bezel & Screen */}
              <div className="relative w-full h-full bg-white rounded-[calc((var(--phone-size,110vmin)/2.525)/5.8)] overflow-hidden shadow-inner border-[4px] md:border-[6px] border-white">
                
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
          </div>

          {/* Buttons Moved Under Phone */}
          <div className="flex flex-wrap justify-center gap-4 font-logo w-full">
            <Link href="/products" className="group flex items-center gap-2 rounded-2xl border-2 border-[#BEFDB1] bg-[#BEFDB1] px-6 py-3.5 text-base font-bold text-black shadow-xl transition-all hover:bg-black hover:text-[#BEFDB1] hover:border-black md:gap-3 md:rounded-[2rem] md:px-10 md:py-5 md:text-xl">
              Browse Items <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1 md:h-6 md:w-6" />
            </Link>
            
            <Link href="/about" className="rounded-2xl border-2 border-white/20 bg-white/10 px-6 py-3.5 text-base font-bold text-white shadow-lg backdrop-blur-md transition-all hover:bg-white hover:text-[#8484F6] md:rounded-[2rem] md:px-10 md:py-5 md:text-xl">
              About Us
            </Link>
          </div>
        </div>

        {/* Content */}
         <div className="order-1 z-20 space-y-6 text-center md:space-y-10 lg:order-2 lg:-ml-20 lg:text-left">
          <div className="space-y-3 md:space-y-4 relative">
            {/* The Crown atop the 'I' */}
            <div className="absolute -top-7 left-[62.5%] z-30 text-yellow-300 drop-shadow-lg md:-top-12 -rotate-12">
              <Crown className="w-10 h-10 md:w-[64px] md:h-[64px]" fill="currentColor" strokeWidth={1} />
            </div>

            <h1 className="font-logo text-6xl leading-[0.85] font-black tracking-tight drop-shadow-sm sm:text-7xl md:text-8xl lg:text-9xl">
              SOKOLINE
            </h1>
            <div className="h-[1.8em] text-lg italic tracking-tight text-white/90 sm:text-xl md:text-2xl lg:text-3xl">
              <AnimatedText />
            </div>
          </div>

          <p className="mx-auto max-w-xl text-base leading-snug text-white/85 sm:text-lg md:text-xl lg:mx-0 lg:text-2xl">
            Support student entrepreneurs. Every item here is owned and operated by students within the campus ecosystem.
          </p>
        </div>

      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
    </section>
  );
}
