"use client";

import { ShopifyProduct } from '@/lib/shopify/types';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

interface ProductGridProps {
    products: ShopifyProduct[];
}

export default function ProductGrid({ products }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="text-center py-20">
                <p className="text-zinc-400 text-sm tracking-wide uppercase">Ei tuotteita saatavilla.</p>
            </div>
        );
    }

    return (
        <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12"
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.08,
                    },
                },
            }}
        >
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </motion.div>
    );
}
