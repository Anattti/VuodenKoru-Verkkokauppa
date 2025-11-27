"use client";

import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import TransitionLink from "@/components/TransitionLink";
import { useState, useEffect, MouseEvent, useRef } from "react";


import { useUI } from "@/context/UIContext";
import { siteConfig, isPreview } from "@/lib/config";
import { previewHeroImage } from "@/lib/previewImages";

import Logo from "@/components/Logo";
import CssGlassButton from "@/components/CssGlassButton";
import AnimatedText from "@/components/AnimatedText";
import img2323 from "@/assets/images/IMG_2323.webp";

export default function Hero({ isLoaded = true }: { isLoaded?: boolean }) {
    const { openContact } = useUI();

    // Scroll effects for button
    const { scrollY } = useScroll();
    const buttonY = useTransform(scrollY, [0, 300], [0, 100]); // Parallax effect
    const buttonScale = useTransform(scrollY, [0, 300], [1, 1.2]); // Scale effect

    // Mouse position for spotlight effect
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);
    const [isHovering, setIsHovering] = useState(false);

    // Smooth spring animation for the spotlight
    const springConfig = { damping: 20, stiffness: 100, mass: 0.5 }; // Softer spring for ambient feel
    const smoothX = useSpring(mouseX, springConfig);
    const smoothY = useSpring(mouseY, springConfig);

    // Ambient animation loop
    useEffect(() => {
        if (isHovering) return;

        let animationFrameId: number;
        let startTime = Date.now();

        const animate = () => {
            const time = (Date.now() - startTime) / 1000;
            // Gentle figure-8 or orbital motion
            // Center of screen
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const radiusX = window.innerWidth * 0.2; // 20% of width
            const radiusY = window.innerHeight * 0.2; // 20% of height

            const x = centerX + Math.cos(time * 0.5) * radiusX;
            const y = centerY + Math.sin(time * 0.3) * radiusY;

            mouseX.set(x);
            mouseY.set(y);

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [isHovering, mouseX, mouseY]);

    // Create the mask image template
    const maskImage = useMotionTemplate`radial-gradient(circle 350px at ${smoothX}px ${smoothY}px, transparent 0%, rgba(0, 0, 0, 0.5) 50%, black 100%)`;

    const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
        setIsHovering(true);
        const { clientX, clientY } = e;
        const { left, top } = e.currentTarget.getBoundingClientRect();
        mouseX.set(clientX - left);
        mouseY.set(clientY - top);
    };

    const handleMouseLeave = () => {
        setIsHovering(false);
    };

    return (
        <section
            className="relative h-[100dvh] w-full overflow-hidden text-white"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <motion.div
                    className="relative w-full h-full"
                    initial={{ scale: 1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.5, ease: "easeOut" }}
                >
                    <Image
                        src={isPreview ? previewHeroImage : img2323}
                        alt={`${siteConfig.designerName} Jewelry Background`}
                        fill
                        className="object-cover object-[40%_50%] md:object-center"
                        priority
                        quality={100}
                    />
                </motion.div>
                {/* Gradient Overlay with Spotlight Effect */}
                <motion.div
                    className="absolute inset-0 z-[999] pointer-events-none"
                    style={{
                        maskImage,
                        WebkitMaskImage: maskImage,
                        willChange: "mask-image",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                    <div className="absolute inset-0 bg-black/1" />
                </motion.div>
            </div>



            {/* Center Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center pb-12 md:pb-0">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.95 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="relative w-full max-w-5xl mx-auto flex flex-col items-center"
                >
                    {/* Darker blur for better text contrast */}
                    <div className="absolute inset-0 -z-10 bg-black/20 blur-[100px] rounded-full transform scale-125 opacity-60" />

                    {/* Headline Group */}
                    <div className="relative mb-12 flex flex-col items-center">
                        <h1 className="flex flex-col items-center justify-center text-white drop-shadow-2xl">
                            <span
                                className="text-8xl md:text-9xl italic tracking-tight font-serif opacity-95"
                                style={{ fontFamily: 'var(--font-playfair)' }}
                            >
                                Täplät
                            </span>
                            <span
                                className="text-lg md:text-2xl uppercase tracking-[0.3em] font-light mt-6 text-white/80"
                                style={{ fontFamily: 'var(--font-inter)' }}
                            >
                                Korusarja
                            </span>
                        </h1>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.0, duration: 0.8 }}
                            className="mt-8 flex items-center gap-4"
                        >
                            <div className="h-[1px] w-12 bg-white/30" />
                            <span className="text-sm md:text-base font-medium tracking-widest uppercase text-white/90">
                                Vuoden Koru 2026 finalisti
                            </span>
                            <div className="h-[1px] w-12 bg-white/30" />
                        </motion.div>
                    </div>

                    {/* Ingress */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.8 }}
                        className="max-w-xl text-center mb-16"
                    >
                        <p className="text-lg md:text-xl text-white/80 leading-relaxed font-light font-serif italic" style={{ fontFamily: 'var(--font-playfair)' }}>
                            &quot;Suomalainen käsityö Reisjärveltä. Näyttävää, ajatonta muotoilua, arkeen ja juhlaan.&quot;
                        </p>
                    </motion.div>

                    {/* CTAs */}
                    <motion.div
                        className="flex flex-col md:flex-row items-center gap-0 md:gap-8 pointer-events-auto"
                        style={{ y: buttonY, scale: buttonScale }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                        transition={{ duration: 0.6, delay: 1.4, ease: "easeOut" }}
                    >
                        {/* Primary CTA */}
                        <Link href="https://www.vuodenkoru.fi" target="_blank">
                            <motion.div
                                className="relative flex justify-center"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <CssGlassButton
                                    text="Äänestä nyt"
                                    className="!px-12 !py-4"
                                />
                            </motion.div>
                        </Link>

                        {/* Secondary CTA */}
                        <motion.div
                            className="relative flex justify-center"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <CssGlassButton
                                text="Katso kokoelma"
                                className="!px-12 !py-4"
                                onClick={() => {
                                    const gallery = document.getElementById('gallery');
                                    gallery?.scrollIntoView({ behavior: 'smooth' });
                                }}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>

            {/* Bottom Info */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 z-20 flex justify-between items-end px-4 pb-6 md:px-12 md:pb-6 text-[10px] md:text-sm font-medium tracking-[0.15em] uppercase text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 20 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            >
                <div className="flex-1">
                    <div className="max-w-[120px] md:max-w-none leading-relaxed">
                        <AnimatedText text={`${siteConfig.contestName} ${siteConfig.contestFinalist}`} />
                    </div>
                </div>
                <div className="flex-1 text-center hidden md:block">
                    <AnimatedText text={siteConfig.location} />
                </div>
                <div className="flex-1 flex justify-end items-end gap-4">
                    <TimeDisplay />
                </div>
            </motion.div>
        </section >
    );
}



function TimeDisplay() {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setTime(now.toLocaleTimeString('fi-FI', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex font-variant-numeric tabular-nums">
            <AnimatePresence mode="popLayout">
                {time.split("").map((char, index) => (
                    <motion.span
                        key={`${index}-${char}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="inline-block"
                        style={{ width: char === ":" ? "auto" : "0.6em", textAlign: "center" }}
                    >
                        {char}
                    </motion.span>
                ))}
            </AnimatePresence>
        </div>
    );
}
