"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { siteConfig } from "@/lib/config";

// Imports from JewelryGallery
import img2312 from "@/assets/images/IMG_2312.webp";
import img2313 from "@/assets/images/IMG_2313.webp";
import img2314 from "@/assets/images/IMG_2314.webp";
import img2317 from "@/assets/images/IMG_2317.webp";
import img2318 from "@/assets/images/IMG_2318.webp";
import img2315 from "@/assets/images/IMG_2315.webp";
import img2316 from "@/assets/images/IMG_2316.webp";
import img2320 from "@/assets/images/IMG_2320.webp";
import img2319 from "@/assets/images/IMG_2319.webp";
import img2322 from "@/assets/images/IMG_2322.webp";
import img2323 from "@/assets/images/IMG_2323.webp"; // Hero image
import img2321 from "@/assets/images/IMG_2321.webp";
import img2324 from "@/assets/images/IMG_2324.webp";
import img2325 from "@/assets/images/IMG_2325.webp";
import img2326 from "@/assets/images/IMG_2326.webp";


const RANDOM_IMAGES = [
    img2312, img2313, img2314, img2317, img2318,
    img2315, img2316, img2320, img2319, img2322,
    img2321, img2324, img2325, img2326
];

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [items, setItems] = useState<any[]>([]);

    // 1. Setup Dimensions
    useEffect(() => {
        setDimensions({ width: window.innerWidth, height: window.innerHeight });
    }, []);

    // 2. Generate Items (Memoized)
    useEffect(() => {
        if (dimensions.width === 0) return;

        const generatedItems = [];
        const colCount = dimensions.width < 768 ? 2 : 4;
        const colWidth = 100 / colCount;
        const colDelays = new Array(colCount).fill(0);

        // Random Background Rain
        const randomCount = 12;
        const shuffled = [...RANDOM_IMAGES].sort(() => Math.random() - 0.5);

        for (let i = 0; i < randomCount; i++) {
            const colIndex = i % colCount;
            const image = shuffled[i % shuffled.length];
            const duration = 5 + Math.random() * 2.5; // Slower, more elegant
            const startTime = colDelays[colIndex];

            colDelays[colIndex] += (duration * 0.3) + Math.random() * 0.4;

            generatedItems.push({
                id: `random-${i}`,
                image,
                left: `${colIndex * colWidth}%`,
                width: `${colWidth}%`,
                delay: startTime,
                duration,
                isHero: false
            });
        }

        // Hero Image
        const heroDelay = 3.5;
        generatedItems.push({
            id: 'hero',
            image: img2320,
            left: '50%',
            delay: heroDelay,
            duration: 4.5,
            isHero: true
        });

        setItems(generatedItems);
    }, [dimensions]);

    // 3. GSAP Animation Sequence
    useEffect(() => {
        if (items.length === 0 || !containerRef.current) return;

        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                onComplete: () => {
                    // Fade out container then call onComplete
                    gsap.to(containerRef.current, {
                        opacity: 0,
                        duration: 0.8,
                        ease: "power2.inOut",
                        onComplete: onComplete
                    });
                }
            });

            // Animate Random Items
            items.forEach((item) => {
                if (!item.isHero) {
                    const element = document.getElementById(`item-${item.id}`);
                    if (element) {
                        gsap.fromTo(element,
                            { y: "-120vh" },
                            {
                                y: "120vh",
                                duration: item.duration,
                                delay: item.delay,
                                ease: "none", // Linear fall for rain
                            }
                        );
                    }
                }
            });

            // Animate Hero Item
            const heroItem = items.find(i => i.isHero);
            if (heroItem) {
                const heroEl = document.getElementById(`item-hero`);
                const textEl = document.getElementById('loading-text');
                const overlayGradient = document.getElementById('hero-overlay-gradient');
                const overlayBlack = document.getElementById('hero-overlay-black');

                if (heroEl) {
                    // PERFORMANCE OPTIMIZATION: Use Scale instead of Width/Height to avoid layout thrashing

                    // Set initial state: Full screen but scaled down
                    // Scale 0.3 approximates the previous 30vw width
                    gsap.set(heroEl, {
                        width: "100%",
                        height: "100%",
                        scale: 0.3,
                        yPercent: -150, // Start off-screen top
                        xPercent: 0,
                        left: 0,
                        top: 0,
                        position: "fixed",
                        zIndex: 40,
                        transformOrigin: "center center"
                    });

                    // Fall to center
                    tl.to(heroEl, {
                        yPercent: 0, // Center
                        duration: 4.5,
                        ease: "power3.out", // Smooth landing
                    }, heroItem.delay);

                    // Text Fade In
                    if (textEl) {
                        gsap.set(textEl, { opacity: 0, scale: 0.9 });
                        tl.to(textEl, {
                            opacity: 1,
                            scale: 1,
                            duration: 1,
                            ease: "power2.out"
                        }, 0.5);
                    }

                    // Pause briefly
                    tl.to({}, { duration: 0.3 });

                    // Expand
                    tl.to(heroEl, {
                        scale: 1, // Expand to full screen
                        duration: 1.8,
                        ease: "expo.inOut" // Premium expansion ease
                    }, "expand");

                    // Text Fade Out
                    if (textEl) {
                        tl.to(textEl, {
                            opacity: 0,
                            scale: 1.2,
                            duration: 0.8,
                            ease: "power2.in"
                        }, "expand");
                    }

                    // Overlays Fade In
                    if (overlayGradient && overlayBlack) {
                        tl.to([overlayGradient, overlayBlack], {
                            opacity: 1,
                            duration: 1.8,
                            ease: "expo.inOut"
                        }, "expand");
                    }
                }
            }

        }, containerRef);

        return () => ctx.revert();
    }, [items, dimensions, onComplete]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden"
        >
            {items.map((item) => (
                <div
                    key={item.id}
                    id={`item-${item.id}`}
                    className={item.isHero ? "overflow-hidden shadow-2xl will-change-transform" : "absolute flex justify-center pointer-events-none will-change-transform"}
                    style={!item.isHero ? {
                        left: item.left,
                        width: item.width,
                        top: 0,
                        transform: "translateY(-120vh)" // Initial position for GSAP to pick up
                    } : {}}
                >
                    <div className={item.isHero ? "relative w-full h-full" : "relative w-[90%] aspect-square"}>
                        <Image
                            src={item.image}
                            alt={item.isHero ? "Hero Background" : "Jewelry"}
                            fill
                            className={`object-cover ${!item.isHero ? "object-contain opacity-90" : "object-[70%_50%] md:object-center"}`}
                            priority={item.isHero}
                        />
                        {item.isHero && (
                            <>
                                <div id="hero-overlay-gradient" className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 opacity-0" />
                                <div id="hero-overlay-black" className="absolute inset-0 bg-black/10 opacity-0" />
                            </>
                        )}
                    </div>
                </div>
            ))}



            <div
                id="loading-text"
                className="absolute z-50 text-black font-thin tracking-[0.2em] md:tracking-[0.5em] text-sm md:text-xl uppercase text-center px-4 bg-white/50 backdrop-blur-sm py-6 rounded-full opacity-0"
            >
                {siteConfig.contestName} {siteConfig.contestFinalist}
            </div>
        </div>
    );
}