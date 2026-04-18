"use client";

import React, { useState } from 'react';

const faqData = [
  {
    question: "How long does shipping take?",
    answer: "Shipping typically takes 3-5 business days within the country. International shipping varies by location."
  },
  {
    question: "What is your return policy?",
    answer: "We offer a 30-day return policy for unused products in their original packaging."
  },
  {
    question: "How do I track my order?",
    answer: "Once your order is shipped, you will receive an email with a tracking link."
  }
];

// Sub-component for individual FAQ items
const FAQItem = ({ faq }: { faq: { question: string; answer: string } }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left hover:text-purple-600 transition-colors group"
      >
        <span className="text-sm font-bold uppercase tracking-wider">{faq.question}</span>
        <span className={`text-xl transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
      </button>
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-6' : 'max-h-0'}`}>
        <p className="text-sm text-gray-500 leading-relaxed">
          {faq.answer}
        </p>
      </div>
    </div>
  );
};

export default function FAQSection() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-20 bg-white">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div>
          <h2 className="text-4xl font-black tracking-tighter mb-4">FAQS</h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Everything you need to know about our products and services.
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
