import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { Playfair_Display, Inter, Antonio, Oranienbaum, Prosto_One } from "next/font/google";
import "./globals.css";

import SmoothScroll from "@/components/SmoothScroll";
import { UIProvider } from "@/context/UIContext";
import BusinessCard from "@/components/BusinessCard";
import PageTransition from "@/components/PageTransition";
import { siteConfig } from "@/lib/config";

const ogImage = "https://www.helilampi.fi/images/hero-jewelry.jpg";

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

import JsonLd from "@/components/JsonLd";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.helilampi.fi'),
  title: {
    default: siteConfig.metaTitle,
    template: `%s | ${siteConfig.brandName}`,
  },
  description: siteConfig.metaDescription,
  keywords: ["Vuoden Koru", "Heli Lampi", "Korumuotoilu", "Finnish Design", "Jewelry Design", "Finalisti 2026 -finalisti, kultaseppä"],
  authors: [{ name: siteConfig.designerName, url: "https://www.helilampi.fi" }],
  creator: siteConfig.designerName,
  alternates: {
    canonical: "https://www.helilampi.fi",
  },
  applicationName: siteConfig.brandName,
  openGraph: {
    type: "website",
    locale: "fi_FI",
    url: "https://www.helilampi.fi",
    title: siteConfig.metaTitle,
    description: siteConfig.metaDescription,
    siteName: siteConfig.brandName,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.metaTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.metaTitle,
    description: siteConfig.metaDescription,
    images: [ogImage],
    creator: siteConfig.instagramHandle,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-light.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark.svg', type: 'image/svg+xml', media: '(prefers-color-scheme: dark)' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', type: 'image/png' },
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
          <JsonLd />
          <PageTransition />
          <BusinessCard />
          <SmoothScroll>{children}</SmoothScroll>
          <Analytics />
        </UIProvider>
      </body>
    </html>
  );
}
