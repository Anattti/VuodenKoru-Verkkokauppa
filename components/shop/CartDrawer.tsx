"use client";

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { formatPrice } from '@/lib/shopify';
import { X, Plus, Minus, ShoppingBag, AlertCircle, Loader2 } from 'lucide-react';

export default function CartDrawer() {
    const {
        items,
        isOpen,
        closeCart,
        removeItem,
        updateQuantity,
        cartTotal,
        cartCount,
        checkoutUrl,
        isMock,
        isLoading
    } = useCart();

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeCart}
                    />

                    {/* Drawer */}
                    <motion.div
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white z-999 shadow-2xl flex flex-col"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-zinc-200">
                            <h2 className="text-lg font-semibold text-zinc-900 flex items-center gap-2 font-serif">
                                <ShoppingBag size={20} />
                                Ostoskori ({cartCount})
                            </h2>
                            <button
                                onClick={closeCart}
                                className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-900"
                                aria-label="Sulje ostoskori"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Mock mode notice */}
                        {isMock && (
                            <div className="mx-4 mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                                <AlertCircle size={18} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-800">
                                    Testaus-tila: Shopify-integraatio käyttää mock-dataa. Yhdistä Shopify-tili tuotantokäyttöä varten.
                                </p>
                            </div>
                        )}

                        {/* Cart Items */}
                        <div className="flex-1 overflow-y-auto p-4">
                            {items.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <ShoppingBag size={48} className="text-zinc-300 mb-4" />
                                    <p className="text-zinc-500 mb-2">Ostoskorisi on tyhjä</p>
                                    <button
                                        onClick={closeCart}
                                        className="text-zinc-900 underline hover:no-underline"
                                    >
                                        Jatka ostoksia
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, x: -100 }}
                                            className="flex gap-4 bg-zinc-50 rounded-xl p-3"
                                        >
                                            {/* Product Image */}
                                            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-zinc-200 flex-shrink-0">
                                                {item.imageUrl ? (
                                                    <Image
                                                        src={item.imageUrl}
                                                        alt={item.imageAlt || item.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <ShoppingBag size={24} className="text-zinc-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Info */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-zinc-900 text-sm line-clamp-1">
                                                    {item.title}
                                                </h3>
                                                {item.variantTitle && (
                                                    <p className="text-xs text-zinc-500 mt-0.5">
                                                        {item.variantTitle}
                                                    </p>
                                                )}
                                                <p className="font-semibold text-zinc-900 mt-1">
                                                    {formatPrice(item.price, item.currencyCode)}
                                                </p>

                                                {/* Quantity Controls */}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className={`p-1 hover:bg-zinc-200 rounded transition-all ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                                                        disabled={isLoading}
                                                        aria-label="Vähennä määrää"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-medium w-6 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className={`p-1 hover:bg-zinc-200 rounded transition-all ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                                                        disabled={isLoading}
                                                        aria-label="Lisää määrää"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="p-1 h-fit hover:bg-zinc-200 rounded transition-colors"
                                                disabled={isLoading}
                                                aria-label="Poista tuote"
                                            >
                                                <X size={16} className="text-zinc-400" />
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="border-t border-zinc-200 p-4 space-y-4">
                                {/* Total */}
                                <div className="flex items-center justify-between">
                                    <span className="text-zinc-600">Yhteensä</span>
                                    <span className="text-xl font-bold text-zinc-900">{cartTotal}</span>
                                </div>

                                {/* Checkout Button */}
                                <a
                                    href={checkoutUrl || '#'}
                                    className={`block w-full py-3 px-6 text-center text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 ${checkoutUrl && !isMock && !isLoading
                                        ? 'bg-zinc-900 hover:bg-zinc-800'
                                        : 'bg-zinc-400 cursor-not-allowed pointer-events-none'
                                        }`}
                                    onClick={(e) => {
                                        if (isLoading) {
                                            e.preventDefault();
                                            return;
                                        }
                                        if (isMock) {
                                            e.preventDefault();
                                            console.warn('Testaus-tila: Kassatoiminto ei ole käytettävissä');
                                        }
                                    }}
                                    aria-disabled={isLoading || isMock || !checkoutUrl}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Ladataan...
                                        </>
                                    ) : isMock ? (
                                        'Testi-tila: Kassa ei käytettävissä'
                                    ) : (
                                        'Siirry kassalle'
                                    )}
                                </a>

                                <p className="text-xs text-center text-zinc-500">
                                    Verot ja toimituskulut lasketaan kassalla
                                </p>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
