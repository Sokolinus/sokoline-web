import { ClerkProvider, SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Space_Grotesque } from "next/font/google";
import "./globals.css";

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
      <html lang="en" className={`${spaceGrotesque.variable} antialiased`}>
        <body className={spaceGrotesque.className}>
          <header className="flex justify-between items-center px-6 py-4 border-b border-zinc-100 bg-white">
            <h1 className="text-2xl font-bold tracking-tight text-[#1A1A1A]">Sokoline</h1>
            <nav>
              <Show when="signed-out">
                <div className="flex gap-4">
                  <div className="text-sm font-medium hover:text-[#7C3AED] transition-colors cursor-pointer">
                    <SignInButton />
                  </div>
                  <div className="rounded-full bg-[#7C3AED] px-4 py-2 text-sm font-semibold text-white hover:bg-[#6D28D9] transition-colors">
                    <SignUpButton />
                  </div>
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
