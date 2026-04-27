import React from 'react';
import { notFound } from "next/navigation";
import { Metadata } from 'next';
import { getProduct, formatImageUrl } from "@/lib/api";
import ProductHero from './components/ProductHero';
import ProductInfoTabs from './components/ProductInfoTabs';
import ReviewSection from './components/ReviewSection';
import FAQSection from './components/FAQSection';
import RelatedProducts from './components/RelatedProducts';

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  
  if (!product) return { title: 'Product Not Found' };

  const image = product.images?.[0]?.image || '/logo.svg';

  return {
    title: `${product.name} | Sokoline`,
    description: product.description.substring(0, 160),
    openGraph: {
      title: product.name,
      description: product.description,
      images: [formatImageUrl(image)],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: [formatImageUrl(image)],
    }
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return notFound();
  }

  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="mx-auto max-w-7xl">
        
        {/* Top Section: Navigation and Product Purchase */}
        <div className="px-4 md:px-10">
          <ProductHero product={product} />
        </div>

        {/* Middle Section: Technical Details */}
        <div className="mt-6 border-t border-zinc-200 bg-white">
          <ProductInfoTabs product={product} />
        </div>

        {/* Social Proof & Trust Sections */}
        <div className="space-y-4 border-y border-zinc-200 bg-white">
          <ReviewSection product={product} />
          <FAQSection />
        </div>

        {/* Discovery Section */}
        <div className="mt-12 mb-20">
          <RelatedProducts currentProductId={product.id} categoryId={product.category?.id} />
        </div>
      </div>
    </main>
  );
}
