"use client";

import React from 'react';

const faqData = [
  {
    question: "Frequently Asked Question",
    answer: "Since all our vendors are students, deliveries usually happen between classes or in the evenings."
  },
  {
    question: "What are the business hours?",
    answer: "Most student vendors are available from 8:00 AM to 8:00 PM."
  },
  {
    question: "How can I contact customer support?",
    answer: "You can reach us through the support chat or email."
  }
];

export default function FAQSection() {
  return (
    <section className="bg-white flex flex-col gap-[30px] items-center py-[20px] px-[224px] w-full max-w-[1124px] mx-auto">
      <h2 className="font-logo font-bold text-[36px] text-black text-center min-w-full">
        FAQ
      </h2>
      
      <div className="w-full flex flex-col gap-[30px] items-center">
        {faqData.map((faq, i) => (
          <div 
            key={i} 
            className="border border-black flex items-center justify-center px-[39px] py-[35px] w-full max-w-[784px] text-center"
          >
            <p className="font-logo font-bold text-[36px] text-black leading-tight">
              {faq.question}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
