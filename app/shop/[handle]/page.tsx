"use client";

import { useEffect, useState, use } from 'react';
import { getProductByHandle, isMockMode } from '@/lib/shopify';
import { ShopifyProduct } from '@/lib/shopify/types';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shopify';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowLeft, Check, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import ProductGallery from '@/components/product/ProductGallery';
import ProductInfo from '@/components/product/ProductInfo';
import RelatedProducts from '@/components/product/RelatedProducts';

export default function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
    // Unwrap params using React.use()
    const { handle } = use(params);

    const [product, setProduct] = useState<ShopifyProduct | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const data = await getProductByHandle(handle);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();
    }, [handle]);

    if (isLoading) {
        return (
            <main className="min-h-screen bg-white flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
            </main>
        );
    }

    if (!product) {
        return (
            <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
                <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
                <Link href="/shop" className="text-zinc-600 hover:text-zinc-900 underline">
                    Return to Shop
                </Link>
            </main>
        );
    }

    const media = product.media.edges.map(e => e.node);

    return (
        <main className="min-h-screen bg-white selection:bg-zinc-100">
            <div className="pt-8 pb-16 px-4 md:px-12 max-w-[1400px] mx-auto">
                {/* Main Grid: Gallery (60%) / Info (40%) */}
                <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 mb-24">
                    {/* Gallery Section */}
                    <div className="lg:w-[60%]">
                        <ProductGallery media={media} />
                    </div>

                    {/* Info Section - Sticky on large screens */}
                    <div className="lg:w-[40%]">
                        <div className="sticky top-32">
                            <ProductInfo product={product} />
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                <RelatedProducts currentHandle={product.handle} />
            </div>

            <Footer />
        </main>
    );
}
