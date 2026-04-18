import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
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
      <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <body>
          <header className="flex justify-between items-center p-4 border-b">
            <h1 className="text-xl font-bold">Sokoline</h1>
            <nav>
              <Show when="signed-out">
                <div className="flex gap-4">
                  <SignInButton />
                  <SignUpButton />
                </div>
              </Show>
              <Show when="signed-in">
                <UserButton />
              </Show>
            </nav>
          </header>
          <main>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
