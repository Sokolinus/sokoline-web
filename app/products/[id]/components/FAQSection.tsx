import React, { useState } from 'react';

const faqData = [
  {
    question: "Frequently Asked Question",
    answer: "This is the answer to your frequently asked question. It appears when the box is clicked."
  },
  {
    question: "Frequently Asked Question",
    answer: "Another detailed answer to help your users understand the product better."
  },
  {
    question: "Frequently Asked Question",
    answer: "You can put as much text as you want here. The box will expand to fit the content."
  }
];

// Sub-component for individual FAQ items
const FAQItem = ({ faq }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="border border-gray-300 mb-4 cursor-pointer transition-all duration-300"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="p-6 flex justify-between items-center bg-white">
        <h3 className="text-xl font-bold text-center w-full">
          {faq.question}
        </h3>
        {/* Optional: Add a +/- or chevron icon here */}
      </div>
      
      {isOpen && (
        <div className="px-6 pb-6 text-gray-700 animate-fadeIn">
          <p>{faq.answer}</p>
        </div>
      )}
    </div>
  );
};

export default function FAQSection() {
  return (
    <section className="max-w-3xl mx-auto py-16 px-4 font-sans text-center">
      <h2 className="text-2xl font-bold mb-8 tracking-wide">FAQ</h2>
      
      <div className="flex flex-col">
        {faqData.map((item, index) => (
          <FAQItem key={index} faq={item} />
        ))}
      </div>
    </section>
  );
}