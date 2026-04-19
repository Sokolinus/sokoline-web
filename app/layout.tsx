import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Montserrat, Quicksand } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CartProvider } from "@/components/providers/CartProvider";
import { ShopProvider } from "@/components/providers/ShopProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import ChatSheet from "@/components/ChatSheet";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const quicksand = Quicksand({
  variable: "--font-quicksand",
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
              <body className={`${montserrat.variable} ${quicksand.variable} font-sans`}>
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
