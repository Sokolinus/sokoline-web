import HeroSection from "@/components/HeroSection";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-white dark:bg-[#0A0A0A]">
      <HeroSection />
      
      {/* Feature Section */}
      <section className="w-full max-w-7xl px-6 py-24 sm:px-12 lg:px-24">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-bold tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] sm:text-4xl">
              Empowering Student Entrepreneurs
            </h2>
            <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
              Sokoline provides the complete infrastructure for student-led businesses to thrive in the modern economy.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-3">
            <div className="flex flex-col gap-4">
              <div className="h-1 w-12 bg-[#7C3AED]" />
              <h3 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#FBFBFB]">Data Aggregation</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Gain deep insights into your business performance. Track sales trends, customer behavior, and inventory metrics through our comprehensive analytics dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-1 w-12 bg-[#7C3AED]" />
              <h3 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#FBFBFB]">Payment Solutions</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Accept payments seamlessly. We support both credit cards and Daraja (M-Pesa) integration, ensuring your customers can pay using their preferred methods securely.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              <div className="h-1 w-12 bg-[#7C3AED]" />
              <h3 className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-[#FBFBFB]">Marketing Tools</h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Reach your audience effectively. Utilize our built-in marketing solutions to promote your products, manage campaigns, and grow your brand presence within the student community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="w-full bg-[#F5F3FF] dark:bg-[#1E1B4B]/30 px-6 py-24 sm:px-12 lg:px-24">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h2 className="text-3xl font-bold tracking-tighter text-[#1A1A1A] dark:text-[#FBFBFB] sm:text-4xl lg:text-5xl">
                The Infrastructure for <span className="text-[#7C3AED] dark:text-[#A855F7]">Student Success</span>
              </h2>
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Join hundreds of student entrepreneurs who are scaling their ventures with Sokoline. Our platform is designed to handle the technical complexities so you can focus on creating and selling.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Automated sales reporting",
                  "Secure payment processing",
                  "Simplified store management",
                  "Targeted marketing capabilities"
                ].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-700 dark:text-zinc-300">
                    <div className="h-2 w-2 rounded-full bg-[#7C3AED]" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-zinc-200 shadow-2xl">
              <Image
                src="/about-section-image.jpg"
                alt="Student entrepreneurs working"
                fill
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#7C3AED]/10 to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
