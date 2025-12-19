"use client";

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Box } from 'lucide-react';
import { ShopifyMedia } from '@/lib/shopify/types';
import dynamic from 'next/dynamic';

const ModelViewer = dynamic(() => import('./ModelViewer'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-zinc-100 animate-pulse" />
});

interface ProductGalleryProps {
    media: ShopifyMedia[];
}

export default function ProductGallery({ media }: ProductGalleryProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);

    if (!media.length) return null;

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % media.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + media.length) % media.length);
    };

    const currentMedia = media[currentImageIndex];
    const is3DModel = currentMedia.mediaContentType === 'MODEL_3D';


    return (
        <div className="w-full flex flex-col lg:flex-row gap-4">
            {/* Thumbnails (Desktop - Vertical Strip) */}
            <div className="hidden lg:flex flex-col gap-4 w-24 flex-shrink-0">
                {media.map((item, idx) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentImageIndex(idx)}
                        className={`relative aspect-square w-full border transition-all overflow-hidden bg-zinc-50 ${idx === currentImageIndex
                            ? 'border-zinc-900 opacity-100'
                            : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                    >
                        <Image
                            src={item.previewImage?.url || item.image?.url || ''}
                            alt={item.alt || item.previewImage?.altText || `Product thumbnail ${idx + 1}`}
                            fill
                            className="object-cover"
                        />
                        {item.mediaContentType === 'MODEL_3D' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                <Box size={20} className="text-white drop-shadow-md" />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            {/* Main Image Area */}
            <div className="flex-1 relative aspect-square bg-zinc-50 overflow-hidden group">
                {is3DModel ? (
                    <div className="w-full h-full">
                        <ModelViewer
                            src={currentMedia.sources?.find(s => s.format === 'glb')?.url || currentMedia.sources?.[0]?.url || ''}
                            poster={currentMedia.previewImage?.url}
                            alt={currentMedia.alt || '3D Model'}
                        />
                    </div>
                ) : (
                    <div className="relative w-full h-full cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
                        <Image
                            src={currentMedia.image?.url || currentMedia.previewImage?.url || ''}
                            alt={currentMedia.alt || currentMedia.previewImage?.altText || 'Product image'}
                            fill
                            className="object-cover transition-transform duration-500 hover:scale-105"
                            priority
                        />
                    </div>
                )}

                {/* Mobile Navigation Arrows */}
                <div className="lg:hidden">
                    {media.length > 1 && (
                        <>
                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-sm"
                                aria-label="Previous image"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-sm"
                                aria-label="Next image"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </>
                    )}
                </div>

                {/* Zoom Icon (only for images) */}
                {!is3DModel && (
                    <button
                        onClick={() => setIsLightboxOpen(true)}
                        className="absolute top-4 right-4 bg-white/90 p-2 text-zinc-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                        <Maximize2 size={20} strokeWidth={1.5} />
                    </button>
                )}
            </div>

            {/* Lightbox */}
            <AnimatePresence>
                {isLightboxOpen && !is3DModel && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setIsLightboxOpen(false)}
                            className="absolute top-6 right-6 text-zinc-900 hover:text-zinc-600 p-2"
                        >
                            <X size={32} strokeWidth={1} />
                        </button>

                        <div className="relative w-full h-full max-w-7xl flex items-center justify-center">
                            <Image
                                src={currentMedia.image?.url || currentMedia.previewImage?.url || ''}
                                alt={currentMedia.alt || currentMedia.previewImage?.altText || 'Fullscreen product image'}
                                fill
                                className="object-contain"
                                quality={100}
                            />

                            <button
                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-900 hover:bg-zinc-100 p-4 rounded-full transition-colors"
                            >
                                <ChevronLeft size={48} strokeWidth={1} />
                            </button>

                            <button
                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-900 hover:bg-zinc-100 p-4 rounded-full transition-colors"
                            >
                                <ChevronRight size={48} strokeWidth={1} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
