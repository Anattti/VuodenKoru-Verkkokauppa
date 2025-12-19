"use client";

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];

        if (totalPages <= 5) {
            // Show all pages if 5 or less
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (currentPage > 3) {
                pages.push('ellipsis');
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('ellipsis');
            }

            // Always show last page
            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <nav
            className="flex items-center justify-center gap-1 mt-16"
            aria-label="Sivutus"
        >
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-1 px-4 py-2 text-xs font-medium tracking-wider uppercase text-zinc-600 hover:text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-zinc-200 hover:border-zinc-300 disabled:hover:border-zinc-200"
                aria-label="Edellinen sivu"
            >
                <ChevronLeft size={14} />
                <span>Edellinen</span>
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-1 mx-2">
                {pageNumbers.map((page, index) => (
                    page === 'ellipsis' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="w-10 text-center text-zinc-400"
                        >
                            …
                        </span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            disabled={page === currentPage}
                            className={`w-10 h-10 text-sm font-medium transition-colors ${page === currentPage
                                    ? 'bg-zinc-900 text-white'
                                    : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                                }`}
                            aria-label={`Sivu ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 px-4 py-2 text-xs font-medium tracking-wider uppercase text-zinc-600 hover:text-zinc-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors border border-zinc-200 hover:border-zinc-300 disabled:hover:border-zinc-200"
                aria-label="Seuraava sivu"
            >
                <span>Seuraava</span>
                <ChevronRight size={14} />
            </button>
        </nav>
    );
}
