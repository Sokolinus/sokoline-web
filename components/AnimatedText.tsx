"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const phrases = [
  "empowers student ventures",
  "provides business analytics",
  "enables credit card payments",
  "handles daraja payments",
];

export default function AnimatedText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % phrases.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentPhrase = phrases[index];

  return (
    <div className="relative h-[1.5em] w-full overflow-hidden flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhrase}
          className="flex flex-wrap whitespace-nowrap gap-x-[0.3em]"
        >
          {currentPhrase.split(" ").map((word, i) => (
            <div key={i} className="relative overflow-hidden py-2 px-1">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-120%" }}
                transition={{
                  duration: 0.8,
                  delay: i * 0.08,
                  ease: [0.33, 1, 0.68, 1],
                }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
