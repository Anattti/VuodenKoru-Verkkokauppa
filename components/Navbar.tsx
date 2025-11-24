"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useUI } from "@/context/UIContext";
import { siteConfig } from "@/lib/config";
import Link from "next/link";

import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";

import AnimatedText from "@/components/AnimatedText";
import TransitionLink from "@/components/TransitionLink";

import { usePathname } from "next/navigation";

export default function Navbar() {
    const { openContact } = useUI();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <motion.nav
                className="absolute top-0 left-0 right-0 z-50 flex justify-between items-start px-4 pt-4 md:px-12 md:pt-6 text-[10px] md:text-sm font-medium tracking-[0.2em] uppercase text-white/90 font-sans"
            >
                <div>
                    <TransitionLink href="/">
                        <Logo />
                    </TransitionLink>
                </div>
                {pathname === "/" ? (
                    <div className="hidden md:block cursor-pointer" onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}>
                        <AnimatedText text="Kokoelma" />
                    </div>
                ) : (
                    <div className="hidden md:block">
                        <TransitionLink href="/#gallery">
                            <AnimatedText text="Kokoelma" />
                        </TransitionLink>
                    </div>
                )}
                <div className="hidden md:block"><TransitionLink href="/tarina"><AnimatedText text="Tarina" /></TransitionLink></div>
                <div className="hidden md:block" onClick={openContact}><AnimatedText text="Ota Yhteyttä" /></div>

                <button onClick={() => setIsMenuOpen(true)} className="md:hidden text-inherit">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                </button>
            </motion.nav>
        </>
    );
}
