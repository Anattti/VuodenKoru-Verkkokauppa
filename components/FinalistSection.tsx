"use client";

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
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
