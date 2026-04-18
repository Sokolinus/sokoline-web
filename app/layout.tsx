import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Space_Grotesque } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";
import { CartProvider } from "@/components/providers/CartProvider";

const spaceGrotesque = Space_Grotesque({
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
        <html lang="en" className={`${spaceGrotesque.variable} antialiased`}>
          <body className={spaceGrotesque.className}>
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
