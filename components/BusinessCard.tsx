"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from "framer-motion";
import { useLenis } from "lenis/react";
import { X, Mail, Phone, Instagram, MapPin, ArrowRight } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/config";

export default function BusinessCard() {
    const { isContactOpen, closeContact } = useUI();
    const cardRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Check for mobile/touch device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || window.matchMedia("(hover: none) and (pointer: coarse)").matches);
        };
        checkMobile();
        window.addEventListener("resize", checkMobile);
        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    // Adjusted tilt range for a more stable feel - Disabled on mobile
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

    // Dynamic sheen/lighting
    const sheenX = useTransform(mouseX, [-0.5, 0.5], ["0%", "200%"]);
    const sheenY = useTransform(mouseY, [-0.5, 0.5], ["0%", "200%"]);

    const lenis = useLenis();

    // Update rect on mount and resize
    useEffect(() => {
        const updateRect = () => {
            if (cardRef.current) {
                rectRef.current = cardRef.current.getBoundingClientRect();
            }
        };

        if (isContactOpen) {
            // Small delay to ensure animation has settled or element is rendered
            const timer = setTimeout(updateRect, 100);
            window.addEventListener("resize", updateRect);
            window.addEventListener("scroll", updateRect);

            // Lock body scroll
            lenis?.stop();
            document.body.style.overflow = "hidden";

            return () => {
                clearTimeout(timer);
                window.removeEventListener("resize", updateRect);
                window.removeEventListener("scroll", updateRect);
                // Restore body scroll
                lenis?.start();
                document.body.style.overflow = "";
            };
        }
    }, [isContactOpen, lenis]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (isMobile) return;

        // Fallback if rect is missing, but try to use cached
        const rect = rectRef.current || cardRef.current?.getBoundingClientRect();
        if (!rect) return;

        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
        if (isMobile) return;
        x.set(0);
        y.set(0);
    };

    const handleFlip = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFlipped(!isFlipped);
    };

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") closeContact();
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [closeContact]);

    return (
        <AnimatePresence>
            {isContactOpen && (
                <>
                    {/* Backdrop - Light frosted glass */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        onClick={closeContact}
                        className="fixed inset-0 z-[60] bg-zinc-100/60 backdrop-blur-md will-change-[opacity]"
                        style={{ transform: "translateZ(0)" }} // Force hardware acceleration
                    />

                    {/* Card Container */}
                    <div
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4 perspective-2000"
                        onClick={closeContact}
                    >
                        <motion.div
                            ref={cardRef}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            initial={{ scale: 0.8, opacity: 0, y: 100, rotateX: 45 }}
                            animate={{
                                scale: 1,
                                opacity: 1,
                                y: 0,
                                rotateX: 0,
                                transition: {
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 120,
                                    duration: 0.8
                                }
                            }}
                            exit={{
                                scale: 0.8,
                                opacity: 0,
                                y: 100,
                                rotateX: 45,
                                transition: {
                                    type: "spring",
                                    damping: 25,
                                    stiffness: 120,
                                    duration: 0.8
                                }
                            }}
                            style={{
                                rotateX: isMobile ? 0 : rotateX,
                                rotateY: isMobile ? 0 : rotateY,
                                transformStyle: "preserve-3d",
                            }}
                            className="relative w-full max-w-[90vw] md:max-w-[550px] aspect-[1.7/1] cursor-pointer group will-change-transform"
                            onClick={handleFlip}
                        >
                            {/* Floating Particles (Sparkles) */}
                            <Particles />

                            {/* The Card Itself - Double Sided */}
                            <motion.div
                                className="relative w-full h-full transform-style-3d transition-all duration-700 will-change-transform"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                            >

                                {/* ================= FRONT SIDE (BRANDING) ================= */}
                                <div className="absolute inset-0 backface-hidden bg-[#faf9f6] rounded-xl overflow-hidden shadow-2xl border border-white/40 z-20">
                                    {/* Texture & Effects */}
                                    <CardEffects sheenX={sheenX} sheenY={sheenY} isMobile={isMobile} />

                                    {/* Content */}
                                    <div className="relative z-30 h-full flex flex-col items-center justify-center text-center p-8 md:p-12">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="flex flex-col items-center"
                                        >
                                            <h2 className="font-antonio text-[clamp(1.8rem,7vw,4.5rem)] tracking-[0.2em] text-[#1a1a1a] drop-shadow-sm leading-none uppercase">
                                                {siteConfig.designerName}
                                            </h2>
                                            <div className="h-[1px] w-12 md:w-24 mx-auto mt-5 md:mt-6 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-60" />
                                            <p className="font-serif italic text-[#666] text-[clamp(0.75rem,1.5vw,1.1rem)] mt-5 md:mt-6 tracking-[0.15em] font-light px-4">
                                                {siteConfig.profession}
                                            </p>
                                        </motion.div>

                                        <div className="absolute bottom-6 md:bottom-8 text-[#d4af37]/60 text-[10px] tracking-[0.25em] uppercase flex items-center gap-2 animate-pulse">
                                            Käännä <ArrowRight size={10} />
                                        </div>
                                    </div>
                                </div>

                                {/* ================= BACK SIDE (CONTACT) ================= */}
                                <div
                                    className="absolute inset-0 backface-hidden bg-[#faf9f6] rounded-xl overflow-hidden shadow-2xl border border-white/40 z-10"
                                    style={{ transform: "rotateY(180deg)" }}
                                >
                                    {/* Texture & Effects */}
                                    <CardEffects sheenX={sheenX} sheenY={sheenY} isMobile={isMobile} />

                                    {/* Content */}
                                    <div className="relative z-30 h-full flex flex-col items-center justify-center text-center p-6 md:p-12">

                                        {/* Close Button (Only visible on back or accessible via outside click) */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); closeContact(); }}
                                            className="absolute top-4 right-4 text-[#d4af37] hover:text-[#b39025] transition-all p-4 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md hover:scale-105 active:scale-95 border border-[#d4af37]/10 cursor-pointer"
                                            aria-label="Sulje"
                                        >
                                            <X size={16} strokeWidth={2.5} />
                                        </button>

                                        <div className="space-y-5 md:space-y-8 w-full max-w-xs mx-auto mt-4">
                                            <ContactItem
                                                href={`mailto:${siteConfig.email}`}
                                                icon={Mail}
                                                text={siteConfig.email}
                                            />
                                            <ContactItem
                                                href={`tel:${siteConfig.phone.replace(/\s/g, '')}`}
                                                icon={Phone}
                                                text={siteConfig.phone}
                                            />
                                            <ContactItem
                                                href={siteConfig.instagramUrl}
                                                icon={Instagram}
                                                text={siteConfig.instagramHandle}
                                            />
                                            <div className="flex items-center justify-center gap-3 text-sm tracking-[0.15em] text-zinc-400 pt-3 border-t border-[#d4af37]/10 w-2/3 mx-auto">
                                                <MapPin size={12} className="text-[#d4af37]/50" />
                                                <span className="uppercase text-[9px] md:text-xs font-medium tracking-[0.2em]">{siteConfig.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

// Helper Components

function CardEffects({ sheenX, sheenY, isMobile }: { sheenX: any, sheenY: any, isMobile: boolean }) {
    const background = useMotionTemplate`radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.9) 0%, transparent 60%)`;

    return (
        <>
            {/* Texture Layer */}
            <div className="absolute inset-0 opacity-[0.35] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply pointer-events-none filter contrast-125" />

            {/* Dynamic Sheen - Only on desktop */}
            {!isMobile && (
                <motion.div
                    style={{ background }}
                    className="absolute inset-0 z-20 pointer-events-none mix-blend-soft-light opacity-50 will-change-[opacity]"
                />
            )}

            {/* Gold Border Accent */}
            <div className="absolute inset-[6px] md:inset-[12px] border border-[#d4af37]/20 z-10 pointer-events-none rounded-[10px]" />
            <div className="absolute inset-[10px] md:inset-[16px] border border-[#d4af37]/10 z-10 pointer-events-none rounded-[8px]" />

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none z-0">
                <div className="font-antonio text-[120px] md:text-[200px] text-black tracking-tighter leading-none select-none">{siteConfig.initials}</div>
            </div>
        </>
    );
}

function ContactItem({ href, icon: Icon, text }: { href: string, icon: any, text: string }) {
    return (
        <a
            href={href}
            target={href.startsWith('http') ? "_blank" : undefined}
            rel={href.startsWith('http') ? "noopener noreferrer" : undefined}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center gap-4 text-sm tracking-[0.15em] text-zinc-600 hover:text-[#d4af37] transition-all duration-300 group"
        >
            <div className="p-2 md:p-2.5 rounded-full bg-[#d4af37]/5 border border-[#d4af37]/20 group-hover:border-[#d4af37]/50 transition-colors">
                <Icon size={14} className="text-[#d4af37]" />
            </div>
            <span className="uppercase text-[10px] md:text-xs font-medium group-hover:tracking-[0.2em] transition-all">{text}</span>
        </a>
    );
}

function Particles() {
    // Generate random particles
    const particles = Array.from({ length: 12 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        duration: 2 + Math.random() * 3,
        delay: Math.random() * 2
    }));

    return (
        <div className="absolute -inset-20 pointer-events-none z-0">
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute w-1 h-1 bg-[#d4af37]/40 rounded-full blur-[1px] will-change-transform"
                    style={{ left: `${p.x}%`, top: `${p.y}%` }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0, 1, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}
        </div>
    );
}
