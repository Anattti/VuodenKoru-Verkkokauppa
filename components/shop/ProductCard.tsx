"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ShopifyProduct } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/shopify';
import Link from 'next/link';

interface ProductCardProps {
    product: ShopifyProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
    const price = product.priceRange.minVariantPrice;
    const image = product.images.edges[0]?.node;
    const secondImage = product.images.edges[1]?.node;

    // Check for new arrival badge
    const isNewArrival = product.tags?.includes('uutuus') || product.tags?.includes('new');

    // Get product type/material as subtitle
    const subtitle = product.productType || null;

    return (
        <Link href={`/shop/${product.handle}`} className="block group">
            <motion.article
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative flex flex-col"
            >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-zinc-100">
                    {image && (
                        <>
                            <Image
                                src={image.url}
                                alt={image.altText || product.title}
                                fill
                                className={`object-cover transition-all duration-700 ease-out group-hover:scale-[1.02] ${secondImage ? 'group-hover:opacity-0' : ''}`}
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                priority={false}
                            />
                            {/* Secondary Image on Hover */}
                            {secondImage && (
                                <Image
                                    src={secondImage.url}
                                    alt={secondImage.altText || product.title}
                                    fill
                                    className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-out group-hover:scale-[1.02]"
                                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                />
                            )}
                        </>
                    )}

                    {!image && (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-300 bg-zinc-50">
                            <span className="text-sm font-serif italic">Ei kuvaa</span>
                        </div>
                    )}

                    {/* New Arrival Badge */}
                    {isNewArrival && (
                        <div className="absolute top-3 left-3">
                            <span className="px-2 py-1 bg-amber-400 text-[10px] font-medium uppercase tracking-widest text-zinc-900">
                                Uutuus
                            </span>
                        </div>
                    )}

                    {/* Sold Out Badge */}
                    {!product.availableForSale && (
                        <div className="absolute top-3 right-3">
                            <span className="px-2 py-1 bg-white text-[10px] font-medium uppercase tracking-widest text-zinc-600 border border-zinc-200">
                                Loppuunmyyty
                            </span>
                        </div>
                    )}
                </div>

                {/* Product Info */}
                <div className="text-center pt-5 pb-2 space-y-1">
                    {/* Product Title - Small Caps Style */}
                    <h3
                        className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-800 group-hover:text-zinc-600 transition-colors"
                        style={{ fontVariant: 'small-caps' }}
                    >
                        {product.title}
                    </h3>

                    {/* Subtitle / Material */}
                    {subtitle && (
                        <p className="text-xs text-zinc-400 tracking-wide">
                            {subtitle}
                        </p>
                    )}

                    {/* Price */}
                    <p className="text-sm text-zinc-600 pt-1">
                        {formatPrice(price.amount, price.currencyCode)}
                    </p>
                </div>
            </motion.article>
        </Link>
    );
}
