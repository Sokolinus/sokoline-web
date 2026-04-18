import React from 'react';

const products = [
  { id: 1, name: 'Product 1' },
  { id: 2, name: 'Product 2' },
  { id: 3, name: 'Product 3' },
];

export default function RelatedProducts() {
  return (
    <section className="max-w-4xl mx-auto py-20 px-4 text-center">
      <h2 className="text-xl font-bold mb-12 text-black tracking-tight">
        Related Products
      </h2>
      
      {/* 3-column grid that scales */}
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        {products.map((product) => (
          <div 
            key={product.id} 
            className="aspect-square bg-[#ddd4d4] hover:opacity-90 transition-opacity cursor-pointer"
          >
            {/* Image will go here later */}
          </div>
        ))}
      </div>
    </section>
  );
}