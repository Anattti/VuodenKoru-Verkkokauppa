"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useUI } from "@/context/UIContext";
import Logo from "@/components/Logo";

export default function PageTransition() {
    const { isTransitioning } = useUI();

    return (
        <AnimatePresence mode="wait">
            {isTransitioning && (
                <>
                    {/* Background slide animation */}
                    <motion.div
                        className="fixed inset-0 z-[9999] bg-black pointer-events-none"
                        initial={{ y: "100%" }}
                        animate={{ y: "0%" }}
                        exit={{ y: "-100%" }}
                        transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
                        style={{ willChange: "transform" }}
                    />

                    {/* Content (Logo) */}
                    <motion.div
                        className="fixed inset-0 z-[10000] flex items-center justify-center pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                    >
                        <motion.div
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            exit={{ y: -20 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                            className="text-white scale-150"
                        >
                            <Logo />
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
