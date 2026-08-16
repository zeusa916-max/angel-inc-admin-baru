'use client';

import { useEffect, useRef } from 'react';
import { useStorefront, DEFAULT_STORE_PRODUCTS } from './storefront-context';
import { Price } from '@/components/providers/currency-provider';
import { Search, X, Sparkles, ArrowRight } from 'lucide-react';

export default function SearchModal() {
  const {
    isSearchOpen,
    setIsSearchOpen,
    searchQuery,
    setSearchQuery,
    openQuickView,
  } = useStorefront();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const results = searchQuery.trim()
    ? DEFAULT_STORE_PRODUCTS.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.categoryName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-md animate-fade-in"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#141518] rounded-3xl shadow-2xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 z-10 animate-fade-in space-y-6">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
              SEARCH ANGEL INC.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            className="rounded-full p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search fine fragrances, body care rituals, apparel..."
            className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 py-4 pl-12 pr-4 font-serif text-lg text-neutral-900 dark:text-white outline-none focus:border-neutral-950 dark:focus:border-white focus:bg-white dark:focus:bg-neutral-900 transition"
          />
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto space-y-2">
          {searchQuery.trim() && results.length === 0 ? (
            <div className="text-center py-8 text-neutral-400 text-xs">
              No pieces found matching &ldquo;{searchQuery}&rdquo;.
            </div>
          ) : (
            results.map((product) => (
              <div
                key={product.id}
                onClick={() => {
                  openQuickView(product);
                  setIsSearchOpen(false);
                }}
                className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-neutral-50 dark:hover:bg-neutral-900/80 cursor-pointer transition border border-transparent hover:border-neutral-200/60 dark:hover:border-neutral-800"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-neutral-950 flex items-center justify-center shrink-0 overflow-hidden border border-neutral-200 dark:border-neutral-800">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover object-center grayscale contrast-125 brightness-95"
                      />
                    ) : (
                      <Sparkles className="h-5 w-5 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-[9px] font-bold tracking-widest text-neutral-400 uppercase">
                      {product.categoryName}
                    </span>
                    <h5 className="text-xs font-semibold text-neutral-900 dark:text-white">
                      {product.name}
                    </h5>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    <Price amount={product.discountPrice ?? product.price} />
                  </span>
                  <ArrowRight className="h-4 w-4 text-neutral-400" />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
