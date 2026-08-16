'use client';

import { Award, Compass, Smile, Zap, Sparkles } from 'lucide-react';

export default function ValuesSection() {
  const values = [
    {
      num: '01',
      title: 'QUALITY',
      icon: Award,
      desc: 'Memprioritaskan kualitas material, bahan baku murni, dan formulasi terbaik dalam setiap produk.',
    },
    {
      num: '02',
      title: 'STYLE',
      icon: Compass,
      desc: 'Desain yang elegan, abadi, dan selalu relevan dengan gaya hidup modern Anda.',
    },
    {
      num: '03',
      title: 'CONFIDENCE',
      icon: Smile,
      desc: 'Sentuhan wewangian dan busana yang membangkitkan rasa percaya diri prima di setiap langkah.',
    },
    {
      num: '04',
      title: 'EXPERIENCE',
      icon: Zap,
      desc: 'Pengalaman belanja yang mulus, responsif, dan menyenangkan dari awal hingga produk tiba di tangan Anda.',
    },
  ];

  return (
    <section className="py-24 bg-[#faf9f6] dark:bg-[#0c0d0e] border-b border-neutral-200/80 dark:border-neutral-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-1.5 text-[11px] font-black tracking-[0.25em] uppercase text-neutral-900 dark:text-white shadow-sm mb-3">
          <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          <span>OUR VALUES</span>
        </div>

        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-neutral-950 dark:text-white max-w-xl mx-auto">
          The principles that shape everything we craft.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mt-16">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <div
                key={v.title}
                className="group relative p-8 rounded-3xl border-2 border-neutral-200/90 dark:border-neutral-800 bg-white dark:bg-[#141518] flex flex-col items-center text-center space-y-4 shadow-md hover:shadow-2xl hover:border-neutral-950 dark:hover:border-white transition-all duration-300 transform hover:-translate-y-1.5"
              >
                {/* Index Number Badge */}
                <div className="absolute top-4 right-5 font-mono text-[10px] font-black tracking-widest text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-950 dark:group-hover:text-white transition">
                  {v.num}
                </div>

                {/* High-Contrast Bold Icon Badge */}
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 shadow-md ring-4 ring-neutral-100 dark:ring-neutral-800/80 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-6 w-6 stroke-[2.2]" />
                </div>

                {/* High-Contrast Title */}
                <h3 className="font-serif text-base font-bold tracking-[0.14em] uppercase text-neutral-950 dark:text-white">
                  {v.title}
                </h3>

                {/* High-Contrast Readable Description */}
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-xs">
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
