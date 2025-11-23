"use client";

import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
import { X, Mail, Phone, Instagram, MapPin, ArrowRight } from "lucide-react";
import { useUI } from "@/context/UIContext";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/lib/config";

export default function BusinessCard() {
    const { isContactOpen, closeContact } = useUI();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isFlipped, setIsFlipped] = useState(false);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    // Adjusted tilt range for a more stable feel
    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-10deg", "10deg"]);

    // Dynamic sheen/lighting
    const sheenX = useTransform(mouseX, [-0.5, 0.5], ["0%", "200%"]);
    const sheenY = useTransform(mouseY, [-0.5, 0.5], ["0%", "200%"]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseXFromCenter = e.clientX - rect.left - width / 2;
        const mouseYFromCenter = e.clientY - rect.top - height / 2;

        x.set(mouseXFromCenter / width);
        y.set(mouseYFromCenter / height);
    };

    const handleMouseLeave = () => {
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
                        className="fixed inset-0 z-[60] bg-zinc-100/60 backdrop-blur-md"
                    />

                    {/* Card Container */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 perspective-2000">
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
                                rotateX,
                                rotateY,
                                transformStyle: "preserve-3d",
                            }}
                            className="relative w-full max-w-[340px] md:max-w-[550px] aspect-[1.7/1] cursor-pointer group"
                            onClick={handleFlip}
                        >
                            {/* Floating Particles (Sparkles) */}
                            <Particles />

                            {/* The Card Itself - Double Sided */}
                            <motion.div
                                className="relative w-full h-full transform-style-3d transition-all duration-700"
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
                            >

                                {/* ================= FRONT SIDE (BRANDING) ================= */}
                                <div className="absolute inset-0 backface-hidden bg-[#faf9f6] rounded-xl overflow-hidden shadow-2xl border border-white/40 z-20">
                                    {/* Texture & Effects */}
                                    <CardEffects sheenX={sheenX} sheenY={sheenY} />

                                    {/* Content */}
                                    <div className="relative z-30 h-full flex flex-col items-center justify-center text-center p-6 md:p-12">
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                        >
                                            <h2 className="font-antonio text-[clamp(2.5rem,8vw,4.5rem)] tracking-[0.15em] text-[#1a1a1a] drop-shadow-sm leading-none uppercase">
                                                {siteConfig.designerName}
                                            </h2>
                                            <div className="h-[1px] w-16 md:w-24 mx-auto mt-4 md:mt-6 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-80" />
                                            <p className="font-serif italic text-[#666] text-[clamp(0.9rem,2vw,1.2rem)] mt-4 md:mt-6 tracking-wider font-light">
                                                {siteConfig.profession}
                                            </p>
                                        </motion.div>

                                        <div className="absolute bottom-6 md:bottom-8 text-[#d4af37]/60 text-xs tracking-[0.2em] uppercase flex items-center gap-2 animate-pulse">
                                            Käännä <ArrowRight size={12} />
                                        </div>
                                    </div>
                                </div>

                                {/* ================= BACK SIDE (CONTACT) ================= */}
                                <div
                                    className="absolute inset-0 backface-hidden bg-[#faf9f6] rounded-xl overflow-hidden shadow-2xl border border-white/40 z-10"
                                    style={{ transform: "rotateY(180deg)" }}
                                >
                                    {/* Texture & Effects */}
                                    <CardEffects sheenX={sheenX} sheenY={sheenY} />

                                    {/* Content */}
                                    <div className="relative z-30 h-full flex flex-col items-center justify-center text-center p-6 md:p-12">

                                        {/* Close Button (Only visible on back or accessible via outside click) */}
                                        <button
                                            onClick={(e) => { e.stopPropagation(); closeContact(); }}
                                            className="absolute top-2 right-2 md:top-4 md:right-4 text-[#d4af37]/60 hover:text-[#d4af37] transition-colors p-4 z-50"
                                            aria-label="Sulje"
                                        >
                                            <X size={24} strokeWidth={1.5} />
                                        </button>

                                        <div className="space-y-6 md:space-y-8 w-full max-w-xs mx-auto mt-2">
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
                                            <div className="flex items-center justify-center gap-4 text-sm tracking-[0.15em] text-zinc-400 pt-2">
                                                <MapPin size={14} className="text-[#d4af37]/50" />
                                                <span className="uppercase text-[10px] md:text-xs font-medium">{siteConfig.location}</span>
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

function CardEffects({ sheenX, sheenY }: { sheenX: any, sheenY: any }) {
    return (
        <>
            {/* Texture Layer */}
            <div className="absolute inset-0 opacity-[0.4] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply pointer-events-none filter contrast-125" />

            {/* Dynamic Sheen */}
            <motion.div
                style={{
                    background: `radial-gradient(circle at ${sheenX} ${sheenY}, rgba(255,255,255,0.8) 0%, transparent 50%)`
                }}
                className="absolute inset-0 z-20 pointer-events-none mix-blend-soft-light opacity-60"
            />

            {/* Gold Border Accent */}
            <div className="absolute inset-[8px] md:inset-[12px] border border-[#d4af37]/20 z-10 pointer-events-none rounded-lg" />
            <div className="absolute inset-[12px] md:inset-[16px] border border-[#d4af37]/10 z-10 pointer-events-none rounded-lg" />

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none z-0">
                <h1 className="font-antonio text-[150px] md:text-[200px] text-black tracking-tighter leading-none select-none">{siteConfig.initials}</h1>
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
            <span className="uppercase text-[11px] md:text-xs font-medium group-hover:tracking-[0.2em] transition-all">{text}</span>
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
                    className="absolute w-1 h-1 bg-[#d4af37]/40 rounded-full blur-[1px]"
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

