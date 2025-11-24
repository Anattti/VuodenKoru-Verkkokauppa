"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import TransitionLink from "@/components/TransitionLink";
import { useUI } from "@/context/UIContext";
import { useEffect } from "react";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { openContact } = useUI();

    // Prevent scrolling when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleLinkClick = () => {
        onClose();
    };

    const handleContactClick = () => {
        onClose();
        // Small delay to allow menu to close before opening contact modal
        setTimeout(() => {
            openContact();
        }, 500);
    };

    const ease = [0.76, 0, 0.24, 1] as const;

    const menuVariants = {
        initial: {
            clipPath: "inset(0 0 100% 0)",
        },
        animate: {
            clipPath: "inset(0 0 0% 0)",
            transition: {
                duration: 0.8,
                ease: ease,
            },
        },
        exit: {
            clipPath: "inset(0 0 100% 0)",
            transition: {
                duration: 0.8,
                ease: ease,
            },
        },
    };

    const linkVariants = {
        initial: { opacity: 0, y: 20 },
        animate: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: 0.3 + (i * 0.1),
                ease: ease,
            },
        }),
        exit: {
            opacity: 0,
            y: 20,
            transition: {
                duration: 0.4,
            },
        },
    };

    return (
        <AnimatePresence mode="wait">
            {isOpen && (
                <motion.div
                    variants={menuVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center text-white"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-50"
                        aria-label="Close menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Menu Links */}
                    <div className="flex flex-col items-center gap-8 text-2xl md:text-4xl font-light tracking-widest uppercase font-antonio">
                        <motion.div custom={0} variants={linkVariants}>
                            <Link href="/" onClick={handleLinkClick} className="hover:text-white/70 transition-colors">
                                Etusivu
                            </Link>
                        </motion.div>

                        <motion.div custom={1} variants={linkVariants}>
                            <button
                                onClick={() => {
                                    document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' });
                                    handleLinkClick();
                                }}
                                className="hover:text-white/70 transition-colors uppercase"
                            >
                                Kokoelma
                            </button>
                        </motion.div>

                        <motion.div custom={2} variants={linkVariants}>
                            <TransitionLink href="/tarina" onClick={handleLinkClick} className="hover:text-white/70 transition-colors">
                                Tarina
                            </TransitionLink>
                        </motion.div>

                        <motion.div custom={3} variants={linkVariants}>
                            <button onClick={handleContactClick} className="hover:text-white/70 transition-colors uppercase">
                                Ota Yhteyttä
                            </button>
                        </motion.div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
