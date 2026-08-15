'use client';

import { Sparkles, Droplet, Wind, Bath, Sparkle, Shirt, Layers, Footprints } from 'lucide-react';

interface CategoryItem {
  id: string;
  name: string;
  tag: string;
  icon: any;
  desc: string;
  filterKey: string;
}

const CATEGORIES: CategoryItem[] = [
  { id: 'cat-1', name: 'Parfume', tag: 'PARFUME', icon: Droplet, desc: 'Eau de Parfum', filterKey: 'fragrance' },
  { id: 'cat-2', name: 'Body Mist', tag: 'BODY MIST', icon: Wind, desc: 'Fresh All-Day', filterKey: 'fragrance' },
  { id: 'cat-3', name: 'Body Wash', tag: 'BODY WASH', icon: Bath, desc: 'Gentle Cleanser', filterKey: 'beauty' },
  { id: 'cat-4', name: 'Body Scrub', tag: 'SCRUB', icon: Sparkle, desc: 'Exfoliate & Glow', filterKey: 'beauty' },
  { id: 'cat-5', name: 'Baju', tag: 'FASHION', icon: Shirt, desc: 'Apparel & Tops', filterKey: 'fashion' },
  { id: 'cat-6', name: 'Jaket', tag: 'OUTERWEAR', icon: Layers, desc: 'Jackets & Blazers', filterKey: 'fashion' },
  { id: 'cat-7', name: 'Sepatu', tag: 'FOOTWEAR', icon: Footprints, desc: 'Sneakers & Shoes', filterKey: 'footwear' },
];

export default function CategoryStrip({
  onSelectCategory,
}: {
  onSelectCategory?: (key: string) => void;
}) {
  return (
    <section className="py-20 bg-white dark:bg-[#0c0d0e] border-y border-neutral-100 dark:border-neutral-800/80 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-2">
              EXPLORE
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight text-neutral-900 dark:text-white">
              Shop by category
            </h2>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-xs">
            Jelajahi lini produk wewangian, perawatan tubuh, dan koleksi busana eksklusif Angel Inc.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            return (
              <a
                key={cat.id}
                href="#shop"
                onClick={() => onSelectCategory && onSelectCategory(cat.filterKey)}
                className="group relative flex flex-col items-center text-center p-5 rounded-2xl border border-neutral-200/70 dark:border-neutral-800 bg-[#faf9f6] dark:bg-[#141518] hover:bg-white dark:hover:bg-[#181a1f] transition-all duration-300 hover:-translate-y-1 shadow-subtle hover:shadow-card"
              >
                {/* Visual Icon Container */}
                <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-neutral-200/60 dark:bg-neutral-800/80 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 text-neutral-700 dark:text-neutral-300">
                  <Icon className="h-7 w-7 sm:h-8 sm:w-8 transition duration-300 group-hover:text-black dark:group-hover:text-white" />
                </div>

                <span className="text-[10px] font-bold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-1">
                  {cat.tag}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition">
                  {cat.name}
                </span>
                <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {cat.desc}
                </span>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
