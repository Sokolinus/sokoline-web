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
    <ClerkProvider>
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
                <main>
                  {children}
                </main>
                <ChatSheet />
              </body>
            </html>
          </ShopProvider>
        </CartProvider>
      </ToastProvider>
    </ClerkProvider>
  );
}
