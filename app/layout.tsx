import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CartProvider } from "@/components/providers/CartProvider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesque",
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
      <CartProvider>
        <html lang="en" className={`${spaceGrotesk.variable} antialiased`}>
          <body className={spaceGrotesk.className}>
            <Navbar />
            <Breadcrumbs />
            <main>
              {children}
            </main>
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  );
}
