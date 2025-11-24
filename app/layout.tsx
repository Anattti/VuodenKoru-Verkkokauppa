import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Playfair_Display, Inter, Antonio, Oranienbaum, Prosto_One } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";
import { UIProvider } from "@/context/UIContext";
import BusinessCard from "@/components/BusinessCard";
import PageTransition from "@/components/PageTransition";
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

const oranienbaum = Oranienbaum({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-oranienbaum",
});

const prostoOne = Prosto_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-prosto-one",
});

export const metadata: Metadata = {
  title: siteConfig.metaTitle,
  description: siteConfig.metaDescription,
  icons: {
    icon: [
      { url: "/HL-favicon.svg", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-valkoinen.svg", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [
      { url: "/HL-favicon.svg" },
    ],
  },
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
        className={`${playfair.variable} ${inter.variable} ${antonio.variable} ${oranienbaum.variable} ${prostoOne.variable} font-sans antialiased bg-zinc-50 text-zinc-900`}
      >
        <UIProvider>
          <PageTransition />
          <BusinessCard />
          <SmoothScroll>{children}</SmoothScroll>
          <Analytics />
        </UIProvider>
      </body>
    </html>
  );
}
