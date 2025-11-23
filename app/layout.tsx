import type { Metadata } from "next";
import { Playfair_Display, Inter, Antonio } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";
import { UIProvider } from "@/context/UIContext";
import BusinessCard from "@/components/BusinessCard";
import { siteConfig } from "@/lib/config";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const antonio = Antonio({
  subsets: ["latin"],
  variable: "--font-antonio",
});

export const metadata: Metadata = {
  title: siteConfig.metaTitle,
  description: siteConfig.metaDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fi" className="scroll-smooth" suppressHydrationWarning translate="no">
      <body
        suppressHydrationWarning
        className={`${playfair.variable} ${inter.variable} ${antonio.variable} font-sans antialiased bg-zinc-50 text-zinc-900`}
      >
        <UIProvider>
          <BusinessCard />
          <SmoothScroll>{children}</SmoothScroll>
        </UIProvider>
      </body>
    </html>
  );
}
