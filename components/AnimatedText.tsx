"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const words = [
  "empowers student ventures",
  "provides business analytics",
  "enables credit card payments",
  "handles daraja payments",
];

export default function AnimatedText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % words.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const currentText = words[index];

  return (
    <div className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentText}
          className="absolute left-0 top-0 flex whitespace-nowrap text-blue-600 dark:text-blue-400"
        >
          {currentText.split("").map((char, i) => (
            <motion.span
              key={`${currentText}-${i}`}
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.02,
                ease: [0.215, 0.61, 0.355, 1],
              }}
              style={{ display: "inline-block", minWidth: char === " " ? "0.3em" : "auto" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
