"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { getCollectionProducts } from '@/lib/shopify';
import { formatPrice } from '@/lib/shopify';
import { ShopifyProduct } from '@/lib/shopify/types';

export default function RelatedProducts({ currentHandle }: { currentHandle: string }) {
    const [related, setRelated] = useState<ShopifyProduct[]>([]);

    useEffect(() => {
        async function fetchRelated() {
            try {
                const products = await getCollectionProducts({ collection: 'frontpage' });
                if (products && products.length > 0) {
                    // Filter out current product and limit to 4
                    const filtered = products
                        .filter((p) => p.handle !== currentHandle)
                        .slice(0, 4);
                    setRelated(filtered);
                }
            } catch (error) {
                console.error('Failed to fetch related products:', error);
            }
        }

        fetchRelated();
    }, [currentHandle]);

    if (related.length === 0) return null;

    return (
        <div className="py-24 border-t border-zinc-100">
            <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl md:text-3xl font-serif text-zinc-900 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                    Curated For You
                </h2>

                <Link
                    href="/shop"
                    className="text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-zinc-900 transition-colors border-b border-transparent hover:border-zinc-900 pb-0.5"
                >
                    View Collection
                </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                {related.map((product) => (
                    <Link key={product.handle} href={`/shop/${product.handle}`} className="group block">
                        <div className="relative aspect-square overflow-hidden bg-zinc-50 mb-4">
                            {product.images.edges[0] && (
                                <Image
                                    src={product.images.edges[0].node.url}
                                    alt={product.images.edges[0].node.altText || product.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                                />
                            )}
                        </div>

                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-sm font-medium text-zinc-900 mb-1 group-hover:underline decoration-zinc-300 underline-offset-4 decoration-1">
                                    {product.title}
                                </h3>
                                <p className="text-xs text-zinc-500">
                                    {/* Mock category or materials if available, else just 'Sterling Silver' as placeholder style */}
                                    Sterling Silver
                                </p>
                            </div>
                            <div className="text-sm font-light text-zinc-900">
                                {formatPrice(product.priceRange.minVariantPrice.amount, product.priceRange.minVariantPrice.currencyCode)}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
