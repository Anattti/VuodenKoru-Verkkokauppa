"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import Logo from "@/components/Logo";

export default function PageTransition() {
    const { isTransitioning } = useUI();

    return (
        <AnimatePresence mode="wait">
            {isTransitioning && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black pointer-events-none"
                    initial={{ clipPath: "inset(100% 0 0 0)" }}
                    animate={{ clipPath: "inset(0% 0 0 0)" }}
                    exit={{ clipPath: "inset(0 0 100% 0)" }}
                    transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className="text-white scale-150"
                    >
                        <Logo />
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
