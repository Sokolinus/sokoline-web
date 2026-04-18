import React from 'react';
import Breadcrumbs from './components/Breadcrumbs';
import ProductHero from './components/ProductHero';
import ProductInfoTabs from './components/ProductInfoTabs';
import ReviewSection from './components/ReviewSection';
import FAQSection from './components/FAQSection';
import RelatedProducts from './components/RelatedProducts';

export default function ProductPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Container to keep everything aligned with your max-width */}
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: Navigation and Product Purchase */}
        <div className="md:px-10">
          <Breadcrumbs />
          <ProductHero />
        </div>

        {/* Middle Section: Technical Details */}
        <div className="border-t border-gray-100 mt-10">
          <ProductInfoTabs />
        </div>

        {/* Social Proof & Trust Sections */}
        <div className="space-y-4">
          <ReviewSection />
          <FAQSection />
        </div>

        {/* Discovery Section */}
        <RelatedProducts />
        
      </div>
    </main>
  );
}