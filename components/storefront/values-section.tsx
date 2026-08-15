'use client';

import { Award, Compass, Smile, Zap } from 'lucide-react';

export default function ValuesSection() {
  const values = [
    {
      title: 'QUALITY',
      icon: Award,
      desc: 'Memprioritaskan kualitas material, bahan baku murni, dan formulasi terbaik dalam setiap produk.',
    },
    {
      title: 'STYLE',
      icon: Compass,
      desc: 'Desain yang elegan, abadi, dan selalu relevan dengan gaya hidup modern Anda.',
    },
    {
      title: 'CONFIDENCE',
      icon: Smile,
      desc: 'Sentuhan wewangian dan busana yang membangkitkan rasa percaya diri prima di setiap langkah.',
    },
    {
      title: 'EXPERIENCE',
      icon: Zap,
      desc: 'Pengalaman belanja yang mulus, responsif, dan menyenangkan dari awal hingga produk tiba di tangan Anda.',
    },
  ];

  return (
    <section className="py-24 bg-white dark:bg-[#0c0d0e] border-b border-neutral-100 dark:border-neutral-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500 mb-2">
          OUR VALUES
        </p>
        <h2 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight text-neutral-950 dark:text-white max-w-lg mx-auto">
          The principles that shape everything we craft.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-16">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800/80 bg-[#faf9f6] dark:bg-[#141518] flex flex-col items-center text-center space-y-3 hover:border-neutral-300 dark:hover:border-neutral-700 transition duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-subtle mb-2">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="font-serif text-base font-semibold tracking-wider text-neutral-950 dark:text-white">
                  {v.title}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xs">
                  {v.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
