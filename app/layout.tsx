import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Breadcrumbs from "@/components/Breadcrumbs";

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
      <html lang="en" className="antialiased">
        <body className="font-sans">
          <Navbar />
          <Breadcrumbs />
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
