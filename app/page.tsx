"use client";

import Hero from "@/components/Hero";
import FinalistSection from "@/components/FinalistSection";
import JewelryGallery from "@/components/JewelryGallery";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import { useState, useEffect } from "react";

import Navbar from "@/components/Navbar";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we've already shown the loading screen in this session
    const hasSeenLoading = sessionStorage.getItem("hasSeenLoadingScreen");
    if (hasSeenLoading) {
      setIsLoading(false);
    }
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem("hasSeenLoadingScreen", "true");
  };

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />

      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <Hero isLoaded={!isLoading} />
      <FinalistSection />
      <JewelryGallery />
      <Footer />
    </main>
  );
}
