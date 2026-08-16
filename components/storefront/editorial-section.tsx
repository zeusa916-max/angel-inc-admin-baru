'use client';

import { ArrowRight, Sparkles } from 'lucide-react';

export default function EditorialSection() {
  return (
    <section className="py-24 bg-[#f8f7f4] dark:bg-[#121316] border-y border-neutral-200/60 dark:border-neutral-800 transition-colors duration-200 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Featured Editorial Visual Artwork */}
          <div className="group relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop"
              alt="Angel Inc. Editorial Lookbook"
              className="h-full w-full object-cover object-center grayscale contrast-125 brightness-95 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30" />

            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <span className="rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-[9px] font-bold tracking-[0.2em] uppercase text-white">
                  ANGEL INC. EDIT
                </span>
                <span className="text-[10px] font-mono text-neutral-300">
                  VOL. 01 / 2026
                </span>
              </div>

              <div className="space-y-2">
                <div className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-white">
                  The Paradise Standard
                </div>
                <p className="text-xs text-neutral-300 max-w-xs">
                  Harmoni sempurna antara wewangian aromatik murni dan estetika pakaian berkelas.
                </p>
              </div>

              <div className="text-[9px] tracking-[0.2em] text-neutral-400 uppercase font-semibold">
                EAU DE PARFUM &bull; BODY CARE &bull; ATELIER
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy */}
          <div className="space-y-6 max-w-xl">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
              ANGEL INC. EDIT
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight text-neutral-950 dark:text-white">
              Everyday essentials,<br />
              <span className="italic font-normal">made memorable.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
              From your first spray in the morning to the pieces you wear out, Angel Inc. brings fragrance, beauty, and fashion together in one cohesive collection.
            </p>

            <div className="pt-2">
              <a
                href="#shop"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-neutral-950 dark:text-white border-b-2 border-neutral-950 dark:border-white pb-1 hover:opacity-60 transition"
              >
                <span>Explore collection</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
