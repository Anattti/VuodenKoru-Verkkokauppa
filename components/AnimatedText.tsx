"use client";

import { motion } from "framer-motion";

export default function AnimatedText({ text }: { text: string }) {
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
