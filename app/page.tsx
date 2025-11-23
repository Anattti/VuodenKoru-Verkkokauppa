"use client";

import Hero from "@/components/Hero";
import FinalistSection from "@/components/FinalistSection";
import JewelryGallery from "@/components/JewelryGallery";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { useState } from "react";
// import Navbar from "@/components/Navbar";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50">
      {/* <Navbar /> */}
      {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      <Hero isLoaded={!isLoading} />
      <FinalistSection />
      <JewelryGallery />
      <Footer />
    </main>
  );
}
