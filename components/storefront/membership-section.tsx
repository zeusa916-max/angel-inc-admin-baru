'use client';

import { ArrowRight, Gift, Tag, TrendingUp, Sparkles } from 'lucide-react';

export default function MembershipSection() {
  const benefits = [
    {
      num: '01',
      title: 'Exclusive benefits',
      icon: Gift,
      desc: 'Nikmati berbagai manfaat eksklusif yang dirancang khusus untuk member setia kami, termasuk akses awal ke rilisan produk terbaru.',
    },
    {
      num: '02',
      title: 'Exclusive voucher',
      icon: Tag,
      desc: 'Dapatkan potongan harga istimewa, voucher ulang tahun, dan cashback poin belanja di setiap transaksi Anda.',
    },
    {
      num: '03',
      title: 'Grow together',
      icon: TrendingUp,
      desc: 'Dapatkan pengalaman eksklusif, undangan acara khusus, dan keistimewaan tak terbatas bersama komunitas Angel Inc.',
    },
  ];

  return (
    <section id="membership" className="py-24 bg-[#141518] text-white transition-colors duration-200 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Intro Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/80 px-3.5 py-1 text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-300">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>WORK WITH US</span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight text-white">
              Membership
            </h2>

            <p className="text-sm sm:text-base text-neutral-400 font-normal leading-relaxed">
              Join the Angel Inc. membership and enjoy exclusive benefits crafted for our inner circle.
            </p>

            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white text-neutral-950 px-8 py-4 text-xs font-semibold tracking-[0.14em] uppercase transition hover:bg-neutral-200 active:scale-95 shadow-md"
              >
                <span>Become a member</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          {/* Right Benefits Grid */}
          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-6">
            {benefits.map((b) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.num}
                  className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 flex flex-col justify-between hover:border-neutral-700 transition-all duration-300 hover:-translate-y-1"
                >
                  <div>
                    <div className="flex items-center justify-between mb-8">
                      <span className="font-mono text-xs text-neutral-500 font-bold">
                        {b.num}
                      </span>
                      <div className="h-9 w-9 rounded-xl bg-neutral-800 text-amber-400 flex items-center justify-center">
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    <h3 className="font-serif text-lg font-semibold text-white mb-2">
                      {b.title}
                    </h3>
                  </div>

                  <p className="text-xs text-neutral-400 leading-relaxed mt-4">
                    {b.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
