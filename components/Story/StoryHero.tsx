"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

import Logo from "@/components/Logo";
import AnimatedText from "@/components/AnimatedText";
import TimeDisplay from "@/components/TimeDisplay";
import { useUI } from "@/context/UIContext";
import { siteConfig } from "@/lib/config";
import Link from "next/link";
import TransitionLink from "@/components/TransitionLink";

export default function StoryHero() {
    const { openContact } = useUI();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <section ref={containerRef} className="relative h-[100dvh] w-full overflow-hidden bg-black">
            <motion.div
                style={{ y, scale, opacity }}
                className="absolute inset-0 z-0"
            >
                <Image
                    src="/images/TuoteKuvat/Rannekoru tunnelmakuva laaja kopio.webp"
                    alt="Story Hero Background"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
                <div className="absolute inset-0 bg-black/10" />
            </motion.div>

            {/* Top Navigation */}
            {/* <motion.div
                className="absolute top-0 left-0 right-0 z-20 flex justify-between items-start px-4 pt-4 md:px-12 md:pt-6 text-[10px] md:text-sm font-medium tracking-[0.2em] uppercase text-white/90 font-sans"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            >
                <TransitionLink href="/">
                    <Logo />
                </TransitionLink>
                <div className="hidden md:block"><TransitionLink href="/"><AnimatedText text="Kokoelma" /></TransitionLink></div>
                <div className="hidden md:block"><Link href="/tarina"><AnimatedText text="Tarina" /></Link></div>
                <div onClick={openContact}><AnimatedText text="Ota Yhteyttä" /></div>
            </motion.div> */}

            <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-center"
                >
                    <h1 className="font-antonio text-6xl md:text-9xl uppercase tracking-tighter mb-4">
                        Matka Huipulle
                    </h1>
                    <p className="font-sans text-lg md:text-xl tracking-[0.2em] uppercase opacity-80 max-w-2xl mx-auto">
                        Vuoden Koru -kilpailun finalistin tarina
                    </p>
                </motion.div>

            </div>

            {/* Bottom Info */}
            <motion.div
                className="absolute bottom-0 left-0 right-0 z-20 flex justify-between items-end px-4 pb-6 md:px-12 md:pb-6 text-[10px] md:text-sm font-medium tracking-[0.15em] uppercase text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
        </section>
    );
}
