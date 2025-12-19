"use client";

import { useEffect, useState, useMemo } from 'react';
import { getProducts, getCollections, isMockMode } from '@/lib/shopify';
import { ShopifyProduct, ShopifyCollection } from '@/lib/shopify/types';
import ProductGrid from '@/components/shop/ProductGrid';
import ProductFilters, { SortOption } from '@/components/shop/ProductFilters';
import Pagination from '@/components/shop/Pagination';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import Image from 'next/image';

const ITEMS_PER_PAGE = 12;

export default function ShopPage() {
    const [products, setProducts] = useState<ShopifyProduct[]>([]);
    const [collections, setCollections] = useState<ShopifyCollection[]>([]);
    const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
    const [sortBy, setSortBy] = useState<SortOption>('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const [productsData, collectionsData] = await Promise.all([
                    getProducts(),
                    getCollections()
                ]);
                setProducts(productsData);
                setCollections(collectionsData);
            } catch (err) {
                console.error('Failed to fetch data:', err);
                setError(err instanceof Error ? err.message : 'Tuntematon virhe');
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, []);

    // Filter products based on selected collection
    const filteredProducts = useMemo(() => {
        if (selectedCollectionId === 'all') return products;

        const collection = collections.find(c => c.id === selectedCollectionId);
        return products.filter(product =>
            collection?.products.edges.some(edge => edge.node.handle === product.handle) ?? false
        );
    }, [products, collections, selectedCollectionId]);

    // Sort products
    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];

        switch (sortBy) {
            case 'price-asc':
                return sorted.sort((a, b) =>
                    parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
                );
            case 'price-desc':
                return sorted.sort((a, b) =>
                    parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
                );
            case 'title-asc':
                return sorted.sort((a, b) => a.title.localeCompare(b.title, 'fi'));
            case 'title-desc':
                return sorted.sort((a, b) => b.title.localeCompare(a.title, 'fi'));
            case 'newest':
                // Assuming products are fetched in newest-first order, or we could sort by updatedAt if available
                return sorted;
            case 'featured':
            default:
                return sorted;
        }
    }, [filteredProducts, sortBy]);

    // Pagination
    const totalPages = Math.ceil(sortedProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedProducts.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedProducts, currentPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedCollectionId, sortBy]);

    const handleCollectionChange = (collectionId: string) => {
        setSelectedCollectionId(collectionId);
    };

    const handleSortChange = (sort: SortOption) => {
        setSortBy(sort);
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        // Scroll to top of grid
        window.scrollTo({ top: 400, behavior: 'smooth' });
    };

    return (
        <main className="min-h-screen bg-white">

            {/* Hero Section */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                <Image
                    src="/images/IMG_2320.webp"
                    alt="Vuoden Koru Collection"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-black/30" />

                <div className="absolute inset-0 flex items-center justify-center text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="text-white max-w-4xl"
                    >
                        <h1 className="text-5xl md:text-7xl font-serif mb-6" style={{ fontFamily: 'var(--font-playfair)' }}>
                            Kokoelma
                        </h1>
                        <p className="text-lg md:text-xl font-light tracking-wide max-w-2xl mx-auto opacity-90">
                            Tutustu uniikkeihin käsintehtyihin koruihin. Jokainen koru kertoo oman tarinansa.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="py-16 px-4 md:px-12 max-w-7xl mx-auto">

                {isMockMode && (
                    <div className="flex justify-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-800 rounded-full text-sm border border-amber-200">
                            <AlertTriangle size={16} />
                            <span>Testitila: Näytetään esimerkkidataa</span>
                        </div>
                    </div>
                )}

                {/* Content */}
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin mb-4" />
                        <p className="text-zinc-400 text-sm tracking-wide uppercase animate-pulse">Ladataan tuotteita...</p>
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
                            <AlertTriangle size={32} />
                        </div>
                        <h2 className="text-2xl font-serif text-zinc-900 mb-4">Virhe ladattaessa tuotteita</h2>
                        <p className="text-zinc-600 max-w-md mx-auto mb-8 font-mono text-sm bg-zinc-100 p-4 rounded text-left">
                            {error}
                        </p>
                        <p className="text-zinc-500">
                            Tarkista, että API-avaimet ovat oikein tiedostossa .env.local
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Filter Bar */}
                        <ProductFilters
                            collections={collections}
                            selectedCollectionId={selectedCollectionId}
                            onCollectionChange={handleCollectionChange}
                            sortBy={sortBy}
                            onSortChange={handleSortChange}
                            totalCount={sortedProducts.length}
                        />

                        {/* Product Grid */}
                        {paginatedProducts.length === 0 ? (
                            <div className="text-center py-20">
                                <h2 className="text-xl font-serif text-zinc-900 mb-2">Tuotteita ei löytynyt</h2>
                                <p className="text-zinc-500 text-sm">Tässä kategoriassa ei ole vielä tuotteita.</p>
                                {selectedCollectionId !== 'all' && (
                                    <button
                                        onClick={() => setSelectedCollectionId('all')}
                                        className="mt-4 text-sm text-zinc-900 underline underline-offset-4 hover:text-zinc-600 transition-colors"
                                    >
                                        Näytä kaikki tuotteet
                                    </button>
                                )}
                            </div>
                        ) : (
                            <>
                                <ProductGrid products={paginatedProducts} />

                                {/* Pagination */}
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                />
                            </>
                        )}
                    </>
                )}
            </div>

            <Footer />
        </main>
    );
}
