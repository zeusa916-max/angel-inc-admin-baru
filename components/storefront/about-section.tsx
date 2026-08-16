'use client';

import { ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';

export default function AboutSection() {
  return (
    <section id="about" className="py-24 bg-white dark:bg-[#0c0d0e] transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: About Copy */}
          <div className="space-y-6 max-w-xl">
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
              ABOUT ANGEL INC.
            </p>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight text-neutral-950 dark:text-white">
              More than a product.<br />
              <span className="italic font-normal">It's your expression.</span>
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-normal leading-relaxed">
              Angel Inc. hadir untuk menemani gaya hidup sehari-hari melalui produk fragrance, body care, dan fashion yang modern, nyaman, dan mudah dipilih. Setiap formula diracik dengan standar terbaik untuk memancarkan aura percaya diri Anda.
            </p>

            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-8 py-4 text-xs font-semibold tracking-[0.14em] uppercase transition hover:opacity-90 active:scale-95 shadow-md"
              >
                <span>Get to know us</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right Column: Visual Brand Story Card */}
          <div className="group relative aspect-[4/5] sm:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop"
              alt="Angel Inc. Atelier Craftsmanship"
              className="h-full w-full object-cover object-center grayscale contrast-125 brightness-90 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-white">
                  <Sparkles className="h-3 w-3 text-amber-400" />
                  <span>ANGEL PHILOSOPHY</span>
                </div>
                <span className="text-[10px] font-mono text-neutral-300">EST. 2026</span>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 shadow-xl flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-white text-black flex items-center justify-center shrink-0">
                    <Heart className="h-4 w-4 fill-black" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Mindful Craftsmanship
                    </h4>
                    <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                      Setiap tetes wewangian dan jahitan busana diolah dengan dedikasi tinggi terhadap kualitas dan ketahanan.
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 shadow-xl flex items-start gap-3.5">
                  <div className="h-9 w-9 rounded-xl bg-white text-black flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Ethical & Safe Standards
                    </h4>
                    <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                      Formula ramah kulit, bebas dari bahan berbahaya, dan aman digunakan untuk aktivitas sehari-hari.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center text-[10px] font-serif italic text-neutral-400">
                "Made in Paradise &bull; Designed for Your Everyday Expression"
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
