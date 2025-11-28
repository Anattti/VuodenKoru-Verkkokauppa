"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

// Static imports for optimization
import img2312 from "@/assets/images/IMG_2312.webp";
import img2313 from "@/assets/images/IMG_2313.webp";
import img2314 from "@/assets/images/IMG_2314.webp";
import img2317 from "@/assets/images/IMG_2317.webp";
import img2318 from "@/assets/images/IMG_2318.webp";
import img2315 from "@/assets/images/IMG_2315.webp";
import img2316 from "@/assets/images/IMG_2316.webp";
import img2320 from "@/assets/images/IMG_2320.webp";
import img2319 from "@/assets/images/IMG_2319.webp";
import img2322 from "@/assets/images/IMG_2322.webp";
import img2323 from "@/assets/images/IMG_2323.webp";
import img2321 from "@/assets/images/IMG_2321.webp";
import img2324 from "@/assets/images/IMG_2324.webp";
import img2325 from "@/assets/images/IMG_2325.webp";
import img2326 from "@/assets/images/IMG_2326.webp";

import { useLenis } from "lenis/react";

const images = [
    { src: img2312, alt: "Koru 2", span: "col-span-1 row-span-2" },
    { src: img2313, alt: "Koru 3", span: "col-span-1 row-span-1" },
    { src: img2314, alt: "Koru 5", span: "col-span-1 row-span-1" },
    { src: img2317, alt: "Koru 4", span: "col-span-2 row-span-2" },
    { src: img2318, alt: "Koru 8", span: "col-span-1 row-span-2" },
    { src: img2315, alt: "Koru 6", span: "col-span-1 row-span-1" },
    { src: img2316, alt: "Koru 7", span: "col-span-1 row-span-1" },
    { src: img2320, alt: "Koru 10", span: "col-span-1 row-span-1" },
    { src: img2319, alt: "Koru 9", span: "col-span-2 row-span-1" },
    { src: img2322, alt: "Koru 11", span: "col-span-1 row-span-1" },
    { src: img2323, alt: "Koru 13", span: "col-span-2 row-span-2" },
    { src: img2321, alt: "Koru 12", span: "col-span-1 row-span-2" },
    { src: img2324, alt: "Koru 14", span: "col-span-1 row-span-1" },
    { src: img2325, alt: "Koru 15", span: "col-span-1 row-span-1" },
    { src: img2326, alt: "Koru 16", span: "col-span-2 row-span-1" },
];

export default function JewelryGallery() {
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const lenis = useLenis();

    const handleNext = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedId === null) return;
        setSelectedId((prev) => (prev === null || prev === images.length - 1 ? 0 : prev + 1));
    }, [selectedId]);

    const handlePrev = useCallback((e?: React.MouseEvent) => {
        e?.stopPropagation();
        if (selectedId === null) return;
        setSelectedId((prev) => (prev === null || prev === 0 ? images.length - 1 : prev - 1));
    }, [selectedId]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (selectedId === null) return;
            if (e.key === "ArrowRight") handleNext();
            if (e.key === "ArrowLeft") handlePrev();
            if (e.key === "Escape") setSelectedId(null);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedId, handleNext, handlePrev]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedId !== null) {
            lenis?.stop();
            document.body.style.overflow = "hidden";
        } else {
            lenis?.start();
            document.body.style.overflow = "";
        }
        return () => {
            lenis?.start();
            document.body.style.overflow = "";
        };
    }, [selectedId, lenis]);

    return (
        <section id="gallery" className="bg-zinc-50 py-24 sm:py-32">
            <div className="container mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl font-serif font-light text-zinc-900 sm:text-4xl">
                        Kokoelma
                    </h2>
                    <p className="mt-4 text-zinc-500">Uniikkeja teoksia, jotka kertovat tarinaa.</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-2 md:gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-[300px] grid-flow-dense">
                    {images.map((img, index) => (
                        <GalleryItem
                            key={index}
                            image={img}
                            index={index}
                            onClick={() => setSelectedId(index)}
                        />
                    ))}
                </div>
            </div>

            <AnimatePresence>
                {selectedId !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 sm:p-8"
                        onClick={() => setSelectedId(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-4 right-4 z-50 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
                            onClick={() => setSelectedId(null)}
                        >
                            <X size={32} />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/70 hover:text-white transition-all hover:scale-110 hidden sm:block"
                            onClick={handlePrev}
                        >
                            <ChevronLeft size={48} strokeWidth={1} />
                        </button>
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 text-white/70 hover:text-white transition-all hover:scale-110 hidden sm:block"
                            onClick={handleNext}
                        >
                            <ChevronRight size={48} strokeWidth={1} />
                        </button>

                        {/* Main Image Container */}
                        <motion.div
                            layoutId={`image-${selectedId}`}
                            className="relative w-full max-w-5xl aspect-[3/4] sm:aspect-[4/3] max-h-[85vh] overflow-hidden rounded-lg shadow-2xl bg-zinc-900"
                            onClick={(e) => e.stopPropagation()}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.2}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = Math.abs(offset.x) * velocity.x;
                                if (swipe < -100) handleNext();
                                else if (swipe > 100) handlePrev();
                            }}
                        >
                            <Image
                                src={images[selectedId].src}
                                alt={images[selectedId].alt}
                                fill
                                className="object-contain"
                                sizes="(max-width: 1024px) 100vw, 80vw"
                                quality={85}
                                priority
                            />

                            {/* Image Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 sm:p-8 pt-24 text-white">
                                {/* <motion.h3
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-2xl font-serif font-light"
                                >
                                    {images[selectedId].alt}
                                </motion.h3>
                                <motion.p
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="text-white/80 mt-2 font-light tracking-wide"
                                >
                                    Uniikki kappale
                                </motion.p> */}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

function GalleryItem({ image, index, onClick }: { image: any; index: number; onClick: () => void }) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            layoutId={`image-${index}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-sm bg-zinc-100 cursor-pointer group ${image.span}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <Image
                src={image.src}
                alt={image.alt}
                fill
                className={`object-cover transition-transform duration-700 ease-out ${isHovered ? "scale-110" : "scale-100"
                    }`}
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                quality={80}
            />
            <div
                className={`absolute inset-0 bg-black/20 transition-opacity duration-500 ${isHovered ? "opacity-0" : "opacity-0 group-hover:opacity-100"
                    }`}
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-full text-white transform scale-75 group-hover:scale-100 transition-transform duration-300">
                    <Maximize2 size={24} strokeWidth={1.5} />
                </div>
            </div>
        </motion.div>
    );
}
