"use client";

import { ChevronDown } from 'lucide-react';
import { ShopifyCollection } from '@/lib/shopify/types';

export type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'title-asc' | 'title-desc' | 'newest';

interface ProductFiltersProps {
    collections: ShopifyCollection[];
    selectedCollectionId: string;
    onCollectionChange: (collectionId: string) => void;
    sortBy: SortOption;
    onSortChange: (sort: SortOption) => void;
    totalCount: number;
}

export default function ProductFilters({
    collections,
    selectedCollectionId,
    onCollectionChange,
    sortBy,
    onSortChange,
    totalCount
}: ProductFiltersProps) {

    const sortOptions: { value: SortOption; label: string }[] = [
        { value: 'featured', label: 'Suositellut' },
        { value: 'newest', label: 'Uusimmat' },
        { value: 'price-asc', label: 'Hinta: Halvin ensin' },
        { value: 'price-desc', label: 'Hinta: Kallein ensin' },
        { value: 'title-asc', label: 'Nimi: A-Ö' },
        { value: 'title-desc', label: 'Nimi: Ö-A' },
    ];

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b border-zinc-200 mb-8">
            {/* Left: Filters */}
            <div className="flex flex-wrap items-center gap-4">
                {/* Collection Filter */}
                <div className="relative group">
                    <button
                        className="flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-zinc-700 hover:text-zinc-900 transition-colors"
                    >
                        <span>Kokoelma</span>
                        <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                    </button>

                    {/* Dropdown */}
                    <div className="absolute left-0 top-full mt-2 min-w-[180px] bg-white border border-zinc-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <button
                            onClick={() => onCollectionChange('all')}
                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${selectedCollectionId === 'all'
                                    ? 'bg-zinc-100 text-zinc-900 font-medium'
                                    : 'text-zinc-600 hover:bg-zinc-50'
                                }`}
                        >
                            Kaikki tuotteet
                        </button>
                        {collections.map(collection => (
                            <button
                                key={collection.id}
                                onClick={() => onCollectionChange(collection.id)}
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${selectedCollectionId === collection.id
                                        ? 'bg-zinc-100 text-zinc-900 font-medium'
                                        : 'text-zinc-600 hover:bg-zinc-50'
                                    }`}
                            >
                                {collection.title}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Count & Sort */}
            <div className="flex items-center gap-6">
                {/* Item Count */}
                <span className="text-xs tracking-wider text-zinc-500 uppercase">
                    {totalCount} {totalCount === 1 ? 'tuote' : 'tuotetta'}
                </span>

                {/* Sort */}
                <div className="relative group">
                    <button
                        className="flex items-center gap-1.5 text-xs font-medium tracking-widest uppercase text-zinc-700 hover:text-zinc-900 transition-colors"
                    >
                        <span>Lajittele: {sortOptions.find(o => o.value === sortBy)?.label}</span>
                        <ChevronDown size={14} className="transition-transform group-hover:rotate-180" />
                    </button>

                    {/* Sort Dropdown */}
                    <div className="absolute right-0 top-full mt-2 min-w-[200px] bg-white border border-zinc-200 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        {sortOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => onSortChange(option.value)}
                                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${sortBy === option.value
                                        ? 'bg-zinc-100 text-zinc-900 font-medium'
                                        : 'text-zinc-600 hover:bg-zinc-50'
                                    }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
