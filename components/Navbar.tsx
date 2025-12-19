"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { useUI } from "@/context/UIContext";
import { siteConfig } from "@/lib/config";
import Link from "next/link";

import Logo from "@/components/Logo";
import MobileMenu from "@/components/MobileMenu";
import CartButton from "@/components/shop/CartButton";

import AnimatedText from "@/components/AnimatedText";
import TransitionLink from "@/components/TransitionLink";

import { usePathname } from "next/navigation";

interface NavbarProps {
    variant?: 'light' | 'dark';
}

export default function Navbar({ variant = 'light' }: NavbarProps) {
    const { openContact } = useUI();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const isDark = variant === 'dark';
    const textColor = isDark ? 'text-zinc-900' : 'text-white/90';

    return (
        <>
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
            <motion.nav
                className={`absolute top-0 left-0 right-0 z-50 flex justify-between items-start px-4 pt-4 md:px-12 md:pt-6 text-[10px] md:text-sm font-medium tracking-[0.2em] uppercase ${textColor} font-sans`}
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
                <div className="hidden md:block"><TransitionLink href="/tarina-taplat-korusarja"><AnimatedText text="Tarina" /></TransitionLink></div>
                <div className="hidden md:block"><TransitionLink href="/shop"><AnimatedText text="Kauppa" /></TransitionLink></div>
                <div className="hidden md:block" onClick={openContact}><AnimatedText text="Ota Yhteyttä" /></div>

                <div className="hidden md:block ml-4">
                    <CartButton isDark={isDark} />
                </div>

                <div className="flex items-center gap-4 md:hidden">
                    <CartButton isDark={isDark} />
                    <button onClick={() => setIsMenuOpen(true)} className="text-inherit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                </div>
            </motion.nav>
        </>
    );
}
