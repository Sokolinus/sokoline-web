import React from 'react';
import { notFound } from "next/navigation";
import { getProduct } from "@/lib/api";
import ProductHero from './components/ProductHero';
import ProductInfoTabs from './components/ProductInfoTabs';
import ReviewSection from './components/ReviewSection';
import FAQSection from './components/FAQSection';
import RelatedProducts from './components/RelatedProducts';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return notFound();
  }

  return (
    <main className="bg-background min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        
        {/* Top Section: Navigation and Product Purchase */}
        <div className="md:px-10">
          <ProductHero product={product} />
        </div>

        {/* Middle Section: Technical Details */}
        <div className="border-t border-zinc-100 mt-10">
          <ProductInfoTabs product={product} />
        </div>

        {/* Social Proof & Trust Sections */}
        <div className="space-y-4 bg-background border-y border-zinc-100">
          <ReviewSection product={product} />
          <FAQSection />
        </div>

        {/* Discovery Section */}
        <RelatedProducts productId={product.id} />
        
      </div>
    </main>
  );
}
