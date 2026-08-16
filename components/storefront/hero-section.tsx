'use client';

import { Sparkles, ArrowRight, Compass } from 'lucide-react';

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden bg-[#fbfaf8] dark:bg-[#121316] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 min-h-[calc(100vh-120px)] lg:min-h-[640px] items-center gap-12 py-12 lg:py-16">
          {/* Left Column: Hero Copy */}
          <div className="flex flex-col justify-center max-w-xl space-y-6 animate-fade-in">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/80 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 px-3.5 py-1 text-[11px] font-semibold tracking-[0.2em] text-neutral-600 dark:text-neutral-300 uppercase shadow-subtle w-fit">
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>ANGEL INC. / NEW COLLECTION</span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-neutral-950 dark:text-white">
              Find your<br />
              <span className="italic font-normal">signature.</span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed max-w-md">
              Fragrance, beauty, and fashion designed to become part of your everyday story. Crafted in Paradise.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-8 py-4 text-xs font-semibold tracking-[0.14em] uppercase transition hover:opacity-90 active:scale-95 shadow-md"
              >
                <span>Shop now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>

              <a
                href="#about"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-transparent px-7 py-4 text-xs font-semibold tracking-[0.14em] uppercase text-neutral-900 dark:text-white hover:bg-white dark:hover:bg-neutral-800 transition"
              >
                <Compass className="h-3.5 w-3.5" />
                <span>Discover Angel Inc.</span>
              </a>
            </div>

            <div className="pt-6 grid grid-cols-3 gap-6 border-t border-neutral-200/80 dark:border-neutral-800/80">
              <div>
                <div className="font-serif text-2xl font-semibold text-neutral-900 dark:text-white">100%</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Pure Ingredients</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-semibold text-neutral-900 dark:text-white">24h+</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Long-Lasting Scent</div>
              </div>
              <div>
                <div className="font-serif text-2xl font-semibold text-neutral-900 dark:text-white">Paradise</div>
                <div className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">Couture Standard</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Luxury Editorial Showcase */}
          <div className="relative flex items-center justify-center">
            <div className="group relative w-full aspect-[4/5] max-w-md lg:max-w-none rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 shadow-2xl">
              {/* Luxury Editorial Background Photo */}
              <img
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
                alt="Angel Inc. Haute Couture Campaign"
                className="h-full w-full object-cover object-center grayscale contrast-125 brightness-90 transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/40" />

              {/* Decorative Luxury Overlay Content */}
              <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <div className="rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-white shadow-lg">
                    EDITORIAL 2026
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-xs italic text-neutral-300">Made in Paradise</div>
                    <div className="text-[10px] font-semibold text-white uppercase tracking-wider">Angel Inc. Studio</div>
                  </div>
                </div>

                {/* Center Branding Motif */}
                <div className="text-center space-y-2 py-6">
                  <span className="font-serif text-5xl sm:text-6xl text-white/90 italic font-light">
                    A
                  </span>
                  <div className="font-serif text-2xl sm:text-3xl font-medium tracking-tight text-white">
                    Signature Fragrance & Fashion
                  </div>
                  <p className="text-xs text-neutral-300/80 max-w-xs mx-auto">
                    A timeless blend of pure botanicals, silk, and contemporary aesthetics.
                  </p>
                </div>

                {/* Bottom Card Tag */}
                <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20 flex items-center justify-between shadow-2xl">
                  <div>
                    <div className="text-[9px] font-bold text-neutral-300 uppercase tracking-widest">Featured Release</div>
                    <div className="text-xs font-semibold text-white">Angel Inc. Signature Parfum</div>
                  </div>
                  <a
                    href="#shop"
                    className="rounded-xl bg-white text-black px-4 py-2 text-[11px] font-bold uppercase tracking-wider hover:bg-neutral-200 transition shadow-md"
                  >
                    View
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
