"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";
import { useUI } from "@/context/UIContext";

export default function Footer() {
    const { openContact } = useUI();

    const handleContactClick = () => {
        openContact();
    };
    return (
        <footer className="bg-zinc-100 py-12 text-center text-zinc-500">
            <div className="container mx-auto px-4">
                <h3 className="mb-4 text-xl font-serif text-zinc-900">{siteConfig.footerBrand}</h3>
                <p className="mb-8 text-sm">{siteConfig.footerDesigner}</p>
                <div className="flex justify-center gap-6 text-sm">
                    <a href={siteConfig.instagramUrl} className="hover:text-zinc-900 transition-colors block">
                        <AnimatedText text="Instagram" />
                    </a>
                    <a href={siteConfig.facebookUrl} className="hover:text-zinc-900 transition-colors block">
                        <AnimatedText text="Facebook" />
                    </a>
                    <a href={siteConfig.tiktokUrl} className="hover:text-zinc-900 transition-colors block">
                        <AnimatedText text="TikTok" />
                    </a>
                    <button onClick={handleContactClick} className="hover:text-zinc-900 transition-colors block">
                        <AnimatedText text="Ota Yhteyttä" />
                    </button>
                </div>
                <p className="mt-12 text-xs opacity-50">{siteConfig.copyright}</p>
            </div>
        </footer>
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
