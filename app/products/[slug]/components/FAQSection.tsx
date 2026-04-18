"use client";

import React, { useState } from 'react';
import { Plus } from "lucide-react";

const faqData = [
  {
    question: "When will I receive my campus order?",
    answer: "Since all our vendors are students, deliveries usually happen between classes or in the evenings. You can coordinate a pickup point via the vendor's shop contact after checkout."
  },
  {
    question: "How do M-Pesa payments work?",
    answer: "We use the Daraja API. When you confirm your purchase, you will receive an STK push on your phone to complete the transaction securely."
  },
  {
    question: "Is this platform safe?",
    answer: "Yes. Every shop on Sokoline is campus-verified. We act as a trusted intermediary, holding payments until delivery is confirmed by both parties."
  }
];

const FAQItem = ({ faq }: { faq: { question: string; answer: string } }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-8 flex items-center justify-between text-left group"
      >
        <span className="text-sm font-black uppercase tracking-widest text-[#1A1A1A] dark:text-[#FBFBFB] group-hover:text-[#7C3AED] transition-colors">{faq.question}</span>
        <Plus className={`text-[#7C3AED] transform transition-transform duration-500 ${isOpen ? 'rotate-45' : ''}`} size={20} />
      </button>
      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-60 pb-8' : 'max-h-0'}`}>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium max-w-xl">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-32 bg-white dark:bg-[#0A0A0A] transition-colors duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-16 lg:gap-24">
        <div>
          <h2 className="text-5xl font-black tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] uppercase mb-6 leading-none">FAQS</h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg leading-relaxed">
            Quick answers about shopping and selling on the campus marketplace.
          </p>
        </div>
        
        <div className="md:col-span-2">
          {faqData.map((faq, i) => (
            <FAQItem key={i} faq={faq} />
          ))}
        </div>
      </div>
    </section>
  );
}
