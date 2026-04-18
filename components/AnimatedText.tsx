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
    <div className="relative inline-block h-[1.2em] w-full overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPhrase}
          className="absolute left-0 top-0 flex flex-wrap gap-x-[0.3em] text-blue-600 dark:text-blue-400"
        >
          {currentPhrase.split(" ").map((word, i) => (
            <span key={i} className="relative inline-flex overflow-hidden pb-[0.1em]">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                exit={{ y: "-100%" }}
                transition={{
                  duration: 0.6,
                  delay: i * 0.1,
                  ease: [0.33, 1, 0.68, 1],
                }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
