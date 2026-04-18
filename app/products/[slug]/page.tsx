import React from 'react';
import ProductHero from './components/ProductHero';
import ProductInfoTabs from './components/ProductInfoTabs';
import ReviewSection from './components/ReviewSection';
import FAQSection from './components/FAQSection';
import RelatedProducts from './components/RelatedProducts';
import { getProduct } from '@/lib/api';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="bg-white dark:bg-[#0A0A0A] min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: Navigation and Product Purchase */}
        <div className="md:px-10">
          <ProductHero product={product} />
        </div>

        {/* Middle Section: Technical Details */}
        <div className="border-t border-gray-100 dark:border-zinc-800 mt-10">
          <ProductInfoTabs product={product} />
        </div>

        {/* Social Proof & Trust Sections */}
        <div className="space-y-4">
          <ReviewSection productId={product.id} initialCount={product.review_count} />
          <FAQSection />
        </div>

        {/* Discovery Section */}
        <RelatedProducts productId={product.id} />
        
      </div>
    </main>
  );
}
