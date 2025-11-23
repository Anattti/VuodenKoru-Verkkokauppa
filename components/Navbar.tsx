"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { useUI } from "@/context/UIContext";
import { siteConfig } from "@/lib/config";
import Link from "next/link";

import Logo from "@/components/Logo";

export default function Navbar() {
    const { openContact } = useUI();
    const { scrollY } = useScroll();
    const [hidden, setHidden] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        const previous = scrollY.getPrevious() ?? 0;
        // Show navbar only after scrolling down a bit (e.g. 800px or window height)
        // and hide it when scrolling down further, show when scrolling up
        if (latest < 800) {
            setHidden(true);
        } else if (latest > previous && latest > 800) {
            setHidden(true);
        } else {
            setHidden(false);
        }
        setScrolled(latest > 50);
    });

    return (
        <motion.nav
            variants={{
                visible: { y: 0 },
                hidden: { y: "-100%" },
            }}
            animate={hidden ? "hidden" : "visible"}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 transition-colors duration-300 ${scrolled ? "bg-white/80 backdrop-blur-md border-b border-zinc-100" : "bg-transparent"
                }`}
        >
            <div className={`transition-colors ${scrolled ? "text-zinc-900" : "text-zinc-900"}`}>
                <Logo />
            </div>
            <div className={`hidden sm:flex gap-8 text-sm font-medium tracking-widest transition-colors ${scrolled ? "text-zinc-600" : "text-zinc-600"}`}>
                <Link href="/" className="hover:text-zinc-900 transition-colors uppercase">Etusivu</Link>
                <Link href="/#gallery" className="hover:text-zinc-900 transition-colors uppercase">Kokoelma</Link>
                <Link href="/tarina" className="hover:text-zinc-900 transition-colors uppercase">Tarina</Link>
                <button onClick={openContact} className="hover:text-zinc-900 transition-colors uppercase">Yhteystiedot</button>
            </div>
            <button className="sm:hidden text-zinc-900">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
            </button>
        </motion.nav>
    );
}
