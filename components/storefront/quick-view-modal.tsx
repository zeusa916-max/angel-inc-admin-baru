'use client';

import { useState } from 'react';
import { useStorefront } from './storefront-context';
import { Price } from '@/components/providers/currency-provider';
import { X, ShoppingBag, Plus, Minus, Check, Sparkles } from 'lucide-react';

export default function QuickViewModal() {
  const { quickViewProduct, closeQuickView, addToCart } = useStorefront();
  const [qty, setQty] = useState(1);

  if (!quickViewProduct) return null;

  const handleAdd = () => {
    addToCart(quickViewProduct, qty);
    setQty(1);
    closeQuickView();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
        onClick={closeQuickView}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141518] shadow-2xl p-6 sm:p-8 animate-fade-in z-10 overflow-hidden">
        {/* Close Button */}
        <button
          type="button"
          onClick={closeQuickView}
          className="absolute right-4 top-4 sm:right-6 sm:top-6 rounded-full p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          aria-label="Close quick view"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 items-center">
          {/* Visual Container */}
          <div className="aspect-square w-full rounded-2xl bg-neutral-950 flex flex-col items-center justify-center overflow-hidden border border-neutral-200/80 dark:border-neutral-700/80 relative">
            {quickViewProduct.imageUrl ? (
              <img
                src={quickViewProduct.imageUrl}
                alt={quickViewProduct.name}
                className="h-full w-full object-cover object-center grayscale contrast-125 brightness-95"
              />
            ) : (
              <div className="p-6 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-white/90 dark:bg-neutral-900/90 text-neutral-900 dark:text-white shadow-lg mb-3 mx-auto">
                  <Sparkles className="h-8 w-8 text-amber-500" />
                </div>
                <span className="text-xs font-bold tracking-[0.2em] text-neutral-400 uppercase">
                  {quickViewProduct.categoryName}
                </span>
              </div>
            )}
          </div>

          {/* Details & Action */}
          <div className="space-y-4">
            <div className="space-y-1">
              <span className="inline-block text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-400">
                {quickViewProduct.categoryName}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-semibold text-neutral-950 dark:text-white leading-snug">
                {quickViewProduct.name}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {quickViewProduct.discountPrice ? (
                <>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                    <Price amount={quickViewProduct.discountPrice} />
                  </span>
                  <span className="text-xs text-neutral-400 line-through">
                    <Price amount={quickViewProduct.price} />
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  <Price amount={quickViewProduct.price} />
                </span>
              )}
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
              {quickViewProduct.description}
            </p>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
              {/* Quantity Selector */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                  Quantity
                </span>
                <div className="flex items-center gap-3 rounded-xl border border-neutral-200 dark:border-neutral-700 px-3 py-1.5">
                  <button
                    type="button"
                    onClick={() => setQty((prev) => Math.max(1, prev - 1))}
                    className="text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="text-xs font-bold text-neutral-900 dark:text-white w-4 text-center">
                    {qty}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQty((prev) => prev + 1)}
                    className="text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Add to Bag Button */}
              <button
                type="button"
                onClick={handleAdd}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 py-3.5 text-xs font-bold tracking-wider uppercase transition hover:opacity-90 active:scale-95 shadow-md"
              >
                <ShoppingBag className="h-4 w-4" />
                <span>Add to Shopping Bag</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
