"use client";

import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CssGlassButton from "@/components/CssGlassButton";
import { siteConfig } from "@/lib/config";
import img2323 from "@/assets/images/IMG_2323.webp";
import TransitionLink from "@/components/TransitionLink";

export default function NotFound() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Taustakuva ja overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={img2323}
          alt={`${siteConfig.designerName} Vuoden Koru 2026 - Täplät-korusarja`}
          fill
          priority
          quality={100}
          className="object-cover md:object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
      </div>

      <Navbar />

      <section className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 pb-16 pt-28 text-center">
        <div className="absolute inset-0 -z-10 bg-black/20 blur-[120px]" />

        <div className="space-y-6 max-w-3xl">
          <p className="text-xs md:text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
            404 • Täplät-korusarja
          </p>

          <h1 className="flex flex-col items-center gap-3 text-white drop-shadow-2xl">
            <span
              className="text-5xl md:text-7xl italic tracking-tight font-serif opacity-95"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Sivua ei löytynyt
            </span>
            <span
              className="text-xs md:text-base uppercase tracking-[0.35em] font-light text-white/80"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              Palaa helilampi.fi etusivulle
            </span>
          </h1>

          <p className="mx-auto max-w-xl text-base md:text-lg text-white/85 leading-relaxed">
            Etsimääsi sivua ei ole tai se on siirretty. Jatka matkasi Täplät-korusarjan maailmassa etusivun kautta.
          </p>

          <div className="mt-4 flex items-center justify-center">
            <TransitionLink href="https://www.helilampi.fi">
              <CssGlassButton text="Palaa etusivulle" className="!px-12 !py-4" />
            </TransitionLink>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

