import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CartProvider } from "@/components/providers/CartProvider";
import { ShopProvider } from "@/components/providers/ShopProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import ChatSheet from "@/components/ChatSheet";
import ReferralTracker from "@/components/ReferralTracker";
import { Suspense } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sokoline",
  description: "Your modern marketplace",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsVariant: "blockButton",
          logoPlacement: "inside",
        },
        variables: {
          colorPrimary: "#8484F6",
          colorText: "#111827",
          colorTextSecondary: "#6b7280",
          colorBackground: "#ffffff",
          colorInputBackground: "#f9fafb",
          colorInputText: "#111827",
          borderRadius: "0.75rem",
          fontFamily: "var(--font-inter), sans-serif",
        },
        elements: {
          formButtonPrimary: 
            "!bg-[#8484F6] hover:opacity-90 transition-all text-sm font-bold rounded-xl h-11 shadow-md shadow-[#8484F6]/20",
          card: "shadow-xl border border-black/5 rounded-[2rem]",
          headerTitle: "font-logo text-2xl font-black tracking-tight",
          headerSubtitle: "text-gray-500 font-medium",
          socialButtonsBlockButton: 
            "border-2 border-gray-100 hover:bg-gray-50 transition-colors rounded-xl h-11 font-bold",
          formFieldLabel: "text-xs font-bold uppercase tracking-widest text-gray-400 mb-1.5",
          formFieldInput: 
            "bg-gray-50 border-gray-100 focus:border-[#8484F6] focus:ring-0 rounded-xl h-11 transition-all",
          footerActionLink: "text-[#8484F6] hover:text-[#7373e5] font-bold",
          userButtonAvatarBox: "w-10 h-10 rounded-xl",
          userButtonPopoverCard: "shadow-2xl border border-black/5 rounded-[1.5rem]",
        },
      }}
    >
      <ToastProvider>
        <CartProvider>
          <ShopProvider>
            <html lang="en" className="antialiased">
              <head>
                <link href="https://api.fontshare.com/v2/css?f[]=satoshi@900,700,500,400&display=swap" rel="stylesheet" />
              </head>
              <body className={`${inter.variable} font-sans min-h-screen bg-white`}>
                <Navbar />
                <Breadcrumbs />
                <Suspense fallback={null}>
                  <ReferralTracker />
                </Suspense>
                <main>
                  {children}
                </main>
                <ChatSheet />
                <SpeedInsights />
              </body>
            </html>
          </ShopProvider>
        </CartProvider>
      </ToastProvider>
    </ClerkProvider>
  );
}
