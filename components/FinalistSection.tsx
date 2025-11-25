"use client";

import Link from "next/link";

import { motion } from "framer-motion";
import { siteConfig } from "@/lib/config";

export default function FinalistSection() {
    return (
        <section className="relative w-full bg-white py-24 text-zinc-900 sm:py-32">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-3xl"
                    >
                        <h2 className="mb-8 text-3xl font-serif font-light leading-tight text-zinc-900 sm:text-4xl md:text-5xl">
                            "{siteConfig.slogan}"
                        </h2>
                        <div className="mx-auto mb-8 h-[1px] w-24 bg-gradient-to-r from-transparent via-amber-900/30 to-transparent" />
                        <p className="text-lg font-light leading-relaxed text-zinc-600 sm:text-xl">
                            {siteConfig.description}
                        </p>

                        <div className="mt-12 flex flex-col items-center gap-6">
                            <p className="text-lg font-serif italic text-zinc-800">
                                Lue koko artikkeli Vuoden Koru -kisasta
                            </p>
                            <Link
                                href="https://julesandberyl.fi/taplat-heli-lampi-vuoden-koru-2026-finalisti/"
                                target="_blank"
                                className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 hover:scale-105"
                            >
                                <span className="relative z-10">Lue lisää</span>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
