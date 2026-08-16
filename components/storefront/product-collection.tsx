'use client';

import { useState } from 'react';
import { useStorefront, DEFAULT_STORE_PRODUCTS, StorefrontProduct } from './storefront-context';
import { Price } from '@/components/providers/currency-provider';
import { Heart, Eye, ShoppingBag, Sparkles } from 'lucide-react';

interface ProductCollectionProps {
  initialFilter?: string;
}

export default function ProductCollection({ initialFilter = 'all' }: ProductCollectionProps) {
  const [activeFilter, setActiveFilter] = useState(initialFilter);
  const { addToCart, openQuickView, wishlist, toggleWishlist } = useStorefront();

  const filterTabs = [
    { key: 'all', label: 'All' },
    { key: 'fragrance', label: 'Fragrance' },
    { key: 'beauty', label: 'Beauty' },
    { key: 'fashion', label: 'Fashion' },
    { key: 'footwear', label: 'Footwear' },
  ];

  const filteredProducts = DEFAULT_STORE_PRODUCTS.filter((product) => {
    if (activeFilter === 'all') return true;
    return product.category === activeFilter;
  });

  return (
    <section id="shop" className="py-24 bg-[#faf9f6] dark:bg-[#0f1013] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-2">
              THE COLLECTION
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900 dark:text-white">
              Selected for you
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            {filterTabs.map((tab) => {
              const isActive = activeFilter === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveFilter(tab.key)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-200 ${
                    isActive
                      ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm'
                      : 'bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product) => {
            const isWishlisted = wishlist.includes(product.id);

            return (
              <article
                key={product.id}
                className="group relative flex flex-col justify-between rounded-3xl border border-neutral-200/70 dark:border-neutral-800/90 bg-white dark:bg-[#141518] p-4 sm:p-5 shadow-subtle hover:shadow-card transition-all duration-300 hover:-translate-y-1"
              >
                {/* Product Visual Container */}
                <div className="relative aspect-[4/5] w-full rounded-2xl bg-neutral-100 dark:bg-neutral-900 flex flex-col items-center justify-center overflow-hidden mb-4 border border-neutral-200/60 dark:border-neutral-800/80">
                  {/* Real Luxury Mockup Image */}
                  {product.imageUrl ? (
                    <div className="relative h-full w-full overflow-hidden bg-neutral-950">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="h-full w-full object-cover object-center grayscale contrast-125 transition-transform duration-700 ease-out group-hover:scale-110 opacity-95 group-hover:opacity-100"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="my-auto space-y-2 transition-transform duration-500 group-hover:scale-105 p-6 text-center">
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 dark:bg-neutral-900/80 shadow-md text-neutral-900 dark:text-white border border-neutral-200/40 dark:border-neutral-700">
                        <Sparkles className="h-6 w-6 text-amber-500" />
                      </div>
                      <span className="block text-[10px] font-bold tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase">
                        {product.categoryName}
                      </span>
                    </div>
                  )}

                  {/* Badge */}
                  {product.badge && (
                    <div className="absolute left-3 top-3 rounded-full bg-black/80 dark:bg-white/90 backdrop-blur-md px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase text-white dark:text-black z-10 shadow-md">
                      {product.badge}
                    </div>
                  )}

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={() => toggleWishlist(product.id)}
                    className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-600 dark:text-neutral-300 shadow-md hover:scale-110 active:scale-95 transition z-10"
                    aria-label="Wishlist"
                  >
                    <Heart
                      className={`h-4 w-4 transition ${
                        isWishlisted
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-neutral-700 dark:text-neutral-200'
                      }`}
                    />
                  </button>

                  {/* Hover Quick View Button */}
                  <button
                    type="button"
                    onClick={() => openQuickView(product)}
                    className="absolute bottom-3 inset-x-3 rounded-xl bg-white/95 dark:bg-black/90 backdrop-blur-md py-2.5 text-[10px] font-bold tracking-widest uppercase text-neutral-900 dark:text-white shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black flex items-center justify-center gap-1.5 z-10 border border-neutral-200 dark:border-neutral-700"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Quick View</span>
                  </button>
                </div>

                {/* Product Info */}
                <div className="space-y-1.5 mb-4">
                  <div className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-400 dark:text-neutral-500">
                    {product.categoryName}
                  </div>
                  <h3 className="font-serif text-base font-semibold text-neutral-900 dark:text-white line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    {product.discountPrice ? (
                      <>
                        <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                          <Price amount={product.discountPrice} />
                        </span>
                        <span className="text-[11px] text-neutral-400 line-through">
                          <Price amount={product.price} />
                        </span>
                      </>
                    ) : (
                      <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                        <Price amount={product.price} />
                      </span>
                    )}
                  </div>
                </div>

                {/* Add to Bag Action Button */}
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/80 py-2.5 text-xs font-semibold text-neutral-900 dark:text-white hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition-all duration-200 active:scale-95 shadow-sm"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Add to Bag</span>
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
