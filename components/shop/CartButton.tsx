"use client";

import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface CartButtonProps {
    className?: string;
    isDark?: boolean;
}

export default function CartButton({ className = '', isDark = false }: CartButtonProps) {
    const { toggleCart, cartCount } = useCart();

    return (
        <motion.button
            onClick={toggleCart}
            className={`relative p-2 ${isDark ? 'hover:bg-zinc-100' : 'hover:bg-white/10'} rounded-full transition-colors ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={`Ostoskori (${cartCount} tuotetta)`}
        >
            <ShoppingBag size={20} />

            {/* Badge */}
            {cartCount > 0 && (
                <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-amber-500 text-white text-[10px] font-bold rounded-full px-1"
                >
                    {cartCount > 99 ? '99+' : cartCount}
                </motion.span>
            )}
        </motion.button>
    );
}
