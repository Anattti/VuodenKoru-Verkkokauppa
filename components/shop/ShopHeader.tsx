"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, Search, User, X } from "lucide-react";
import { useUI } from "@/context/UIContext";
import Logo from "@/components/Logo";
import CartButton from "@/components/shop/CartButton";
import MobileMenu from "@/components/MobileMenu";
import AnimatedText from "@/components/AnimatedText";
import TransitionLink from "../TransitionLink";

export default function ShopHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const { openContact } = useUI();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <header className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-white'}`}>
                {/* Announcement Bar */}
                <div className="bg-zinc-900 text-white text-[10px] md:text-xs font-medium tracking-widest uppercase text-center py-2.5 px-4">
                    Ilmainen toimitus yli 100€ tilauksiin
                </div>

                {/* Main Header */}
                <div className="flex items-center justify-between px-4 md:px-12 py-4 md:py-6 max-w-[1920px] mx-auto">

                    {/* Left: Mobile Menu & Desktop Nav */}
                    <div className="flex-1 flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(true)}
                            className="md:hidden p-2 -ml-2 hover:bg-zinc-100 rounded-full text-black"
                        >
                            <Menu size={24} strokeWidth={1.5} />
                        </button>

                        <nav className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.2em] uppercase text-zinc-900">
                            <TransitionLink href="/">
                                <AnimatedText text="Etusivu" />
                            </TransitionLink>
                            <TransitionLink href="/shop">
                                <AnimatedText text="Mallisto" />
                            </TransitionLink>
                            <TransitionLink href="/tarina-taplat-korusarja">
                                <AnimatedText text="Tarina" />
                            </TransitionLink>
                        </nav>
                    </div>

                    {/* Center: Logo */}
                    <div className="flex-1 flex justify-center">
                        <Link href="/shop">
                            <Logo className="scale-75 md:scale-90 text-zinc-900" />
                        </Link>
                    </div>

                    {/* Right: Icons */}
                    <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
                        {/* Search placeholder */}
                        {/* <button className="hidden md:flex p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-900">
                            <Search size={20} strokeWidth={1.5} />
                        </button> */}

                        {/* Account */}
                        <Link
                            href="/account"
                            className="hidden md:flex p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-900"
                        >
                            <User size={20} strokeWidth={1.5} />
                        </Link>

                        <CartButton
                            isDark={true}
                            className="text-black"
                        />
                    </div>
                </div>
            </header>
        </>
    );
}
