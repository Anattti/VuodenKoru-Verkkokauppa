"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Truck, ShieldCheck, ChevronDown, Check } from 'lucide-react';
import { ShopifyProduct } from '@/lib/shopify/types';
import { formatPrice } from '@/lib/shopify';
import { useCart } from '@/context/CartContext';

interface ProductInfoProps {
    product: ShopifyProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
    const { addItem } = useCart();
    const [isAdding, setIsAdding] = useState(false);
    const [openAccordion, setOpenAccordion] = useState<string | null>('details');

    // Initial state for options
    const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
        const defaults: Record<string, string> = {};
        product.options?.forEach(opt => {
            // Skip "Title" option if it's the only one (default variant)
            if (opt.name !== 'Title') {
                defaults[opt.name] = opt.values[0];
            }
        });
        return defaults;
    });

    // Find the selected variant
    const selectedVariant = product.variants.edges.find((edge) => {
        return edge.node.selectedOptions?.every(
            (opt) => selectedOptions[opt.name] === opt.value
        ) ?? false;
    })?.node;

    const handleOptionChange = (name: string, value: string) => {
        setSelectedOptions(prev => ({ ...prev, [name]: value }));
    };

    const handleAddToCart = async () => {
        const variantToAdd = selectedVariant || product.variants.edges[0].node;
        if (!variantToAdd?.availableForSale) return;

        setIsAdding(true);
        await addItem(product, variantToAdd.id);
        setTimeout(() => setIsAdding(false), 2000);
    };

    const toggleAccordion = (id: string) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const price = selectedVariant?.price || product.priceRange.minVariantPrice;
    const isAvailable = selectedVariant?.availableForSale ?? product.availableForSale;

    // Helper to determine if an option should be visual (circles) or text (rectangles)
    // Simplified logic: "Color", "Material", "Metal" -> Circles
    const isVisualOption = (name: string) => {
        const lower = name.toLowerCase();
        return lower.includes('color') || lower.includes('material') || lower.includes('metal') || lower.includes('väri');
    };

    // Mock colors for visual selectors (in a real app this might come from metafields or config)
    const getColorBg = (value: string) => {
        const v = value.toLowerCase();
        if (v.includes('gold') || v.includes('kulta')) return '#E5D0A7'; // Generic goldish
        if (v.includes('silver') || v.includes('hopea')) return '#E3E3E3';
        if (v.includes('rose')) return '#EBC8B2';
        if (v.includes('black') || v.includes('musta')) return '#171717';
        return '#f4f4f5'; // default zinc-100
    };

    // Filter out the default "Title" option
    const visualOptions = product.options?.filter(o => o.name !== 'Title') || [];

    return (
        <div className="flex flex-col text-zinc-900">
            {/* Breadcrumbs */}
            <div className="text-xs uppercase tracking-widest text-zinc-500 mb-6 font-medium flex items-center gap-2">
                <Link href="/" className="hover:text-zinc-900 transition-colors">Etusivu</Link>
                <span>/</span>
                <Link href="/shop" className="hover:text-zinc-900 transition-colors">Mallisto</Link>
                <span>/</span>
                <span className="text-zinc-900 line-clamp-1">{product.title}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-serif text-zinc-900 mb-4 tracking-tight" style={{ fontFamily: 'var(--font-playfair)' }}>
                {product.title}
            </h1>

            {/* Price & Reviews */}
            <div className="flex items-center justify-between mb-8 pb-8 border-b border-zinc-100">
                <div className="text-2xl font-light">
                    {formatPrice(price.amount, price.currencyCode)}
                </div>
            </div>

            {/* Description Snippet */}
            <div
                className="prose prose-zinc prose-sm text-zinc-600 font-light leading-relaxed mb-10"
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} // In real Argentum, this might be shorter, but we'll use full for now
            />

            {/* Options */}
            {visualOptions.length > 0 && (
                <div className="space-y-8 mb-10">
                    {visualOptions.map((option) => (
                        <div key={option.id}>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-4 text-zinc-900">
                                {option.name} {isVisualOption(option.name) ? null : <span className="text-zinc-400 font-normal ml-2 lowercase block sm:inline sm:ml-2">Ole hyvä ja valitse</span>}
                            </label>
                            <div className="flex flex-wrap gap-3">
                                {option.values.map((value) => {
                                    const isSelected = selectedOptions[option.name] === value;

                                    if (isVisualOption(option.name)) {
                                        return (
                                            <button
                                                key={value}
                                                onClick={() => handleOptionChange(option.name, value)}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isSelected ? 'ring-2 ring-offset-2 ring-zinc-900' : 'hover:scale-110'}`}
                                                title={value}
                                            >
                                                <div
                                                    className="w-full h-full rounded-full border border-zinc-200"
                                                    style={{ backgroundColor: getColorBg(value) }}
                                                />
                                            </button>
                                        );
                                    }

                                    return (
                                        <button
                                            key={value}
                                            onClick={() => handleOptionChange(option.name, value)}
                                            className={`
                                        min-w-[4rem] px-6 py-3 text-sm border font-medium transition-all
                                        ${isSelected
                                                    ? 'border-zinc-900 text-zinc-900 bg-zinc-50'
                                                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-400'
                                                }
                                    `}
                                        >
                                            {value}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}

                    {/* Size Guide Link Mock */}
                    <div className="flex justify-end">
                        <span className="text-xs underline cursor-pointer text-zinc-500 hover:text-zinc-900">Koko-opas</span>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 mb-8">
                <button
                    onClick={handleAddToCart}
                    disabled={!isAvailable || isAdding}
                    className={`flex-1 py-4 px-8 font-bold text-sm uppercase tracking-widest transition-all
            ${!isAvailable
                            ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                            : isAdding
                                ? 'bg-zinc-800 text-white'
                                : 'bg-zinc-900 text-white hover:bg-zinc-800' // USING APP COLOR (Zinc-900) instead of Gold
                        }
          `}
                >
                    {isAdding ? 'Lisätty ostoskoriin' : !isAvailable ? 'Loppuunmyyty' : 'Lisää ostoskoriin'}
                </button>

                <button className="w-14 flex items-center justify-center border border-zinc-200 hover:border-zinc-900 transition-colors">
                    <Heart size={20} strokeWidth={1} />
                </button>
            </div>

            {/* Trust Signals */}
            <div className="grid grid-cols-2 gap-4 py-6 border-t border-zinc-100 mb-8">
                <div className="flex items-center gap-3">
                    <Truck size={20} strokeWidth={1} className="text-zinc-900" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide">Ilmainen toimitus</p>
                        <p className="text-[10px] text-zinc-500 uppercase">Kaikille yli 100 € tilauksille</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <ShieldCheck size={20} strokeWidth={1} className="text-zinc-900" />
                    <div>
                        <p className="text-xs font-bold uppercase tracking-wide">Elinikäinen takuu</p>
                        <p className="text-[10px] text-zinc-500 uppercase">Aitoustakuu</p>
                    </div>
                </div>
            </div>


            {/* Accordions */}
            <div className="border-t border-zinc-100">
                {[
                    { id: 'details', title: 'Tiedot & Käsityö', content: 'Käsintehty keskittyen yksityiskohtiin. Tämä koru on suunniteltu moderniksi perintökalleudeksi.' },
                    { id: 'shipping', title: 'Toimitus & Palautus', content: 'Tarjoamme ilmaisen toimituksen yli 100 € tilauksille. Palautukset hyväksytään 30 päivän kuluessa ostosta.' },
                ].map((item) => (
                    <div key={item.id} className="border-b border-zinc-100">
                        <button
                            onClick={() => toggleAccordion(item.id)}
                            className="w-full flex items-center justify-between py-4 group"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest text-zinc-900">
                                {item.title}
                            </span>
                            <ChevronDown
                                size={16}
                                className={`text-zinc-400 transition-transform duration-300 ${openAccordion === item.id ? 'rotate-180' : ''}`}
                            />
                        </button>
                        <AnimatePresence>
                            {openAccordion === item.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="overflow-hidden"
                                >
                                    <p className="pb-6 text-sm text-zinc-600 font-light leading-relaxed">
                                        {item.content}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                ))}
            </div>
        </div>
    );
}
