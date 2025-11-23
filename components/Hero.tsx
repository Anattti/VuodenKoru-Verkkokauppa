"use client";

import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, MouseEvent } from "react";

import FluidGlass from "./FluidGlass";
import { useUI } from "@/context/UIContext";
import { siteConfig, isPreview } from "@/lib/config";
import { previewHeroImage } from "@/lib/previewImages";

export default function Hero({ isLoaded = true }: { isLoaded?: boolean }) {
    const { openContact } = useUI();

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
                        src={isPreview ? previewHeroImage : "/IMG_2323.webp"}
                        alt={`${siteConfig.designerName} Jewelry Background`}
                        fill
                        className="object-cover"
                        priority
                        quality={100}
                    />
                </motion.div>
                {/* Gradient Overlay with Spotlight Effect */}
                <motion.div
                    className="absolute inset-0 z-10"
                    style={{
                        maskImage,
                        WebkitMaskImage: maskImage,
                        willChange: "mask-image",
                    }}
                >
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                    <div className="absolute inset-0 bg-black/10" />
                </motion.div>
            </div>

            {/* Top Navigation */}
            <motion.div
                className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start px-4 pt-4 md:px-12 md:pt-6 text-[10px] md:text-sm font-medium tracking-[0.2em] uppercase text-white/90 font-sans"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : -20 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            >
                <AnimatedText text={siteConfig.brandName} />
                <div className="hidden md:block" onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}><AnimatedText text="Kokoelma" /></div>
                <div className="hidden md:block"><AnimatedText text="Tarina" /></div>
                <div onClick={openContact}><AnimatedText text="Ota Yhteyttä" /></div>
            </motion.div>

            {/* Center Content */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: isLoaded ? 1 : 0, scale: isLoaded ? 1 : 0.9 }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
                    className="relative w-full"
                >
                    <div className="absolute inset-0 -z-10 bg-black/50 blur-3xl rounded-full transform scale-150 opacity-50" />
                    <h1 className="flex flex-col items-center justify-center leading-[0.85] font-thin tracking-[-0.2em] md:tracking-[-0.7em] text-white opacity-95 font-antonio drop-shadow-2xl" style={{ fontFamily: 'var(--font-antonio)' }}>
                        <span className="text-[18vw] uppercase">{siteConfig.designerName}</span>
                    </h1>
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

function AnimatedText({ text }: { text: string }) {
    return (
        <motion.div
            className="relative overflow-hidden cursor-pointer group"
            initial="initial"
            whileHover="hover"
        >
            <motion.span
                className="block"
                variants={{
                    initial: { y: 0, opacity: 1 },
                    hover: { y: -20, opacity: 0 }
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                {text}
            </motion.span>
            <motion.span
                className="absolute inset-0 block"
                variants={{
                    initial: { y: 20, opacity: 0 },
                    hover: { y: 0, opacity: 1 }
                }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            >
                {text}
            </motion.span>
        </motion.div>
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
