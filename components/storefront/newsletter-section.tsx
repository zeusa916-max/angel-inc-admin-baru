'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { ArrowRight, Send, MessageCircle } from 'lucide-react';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      error('Silakan masukkan alamat email yang valid.');
      return;
    }

    setSubscribed(true);
    success('Terima kasih telah berlangganan newsletter Angel Inc.!', 'Sukses');
    setEmail('');
  };

  return (
    <section id="contact" className="py-24 bg-[#f8f7f4] dark:bg-[#121316] transition-colors duration-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
          STAY CONNECTED
        </p>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-neutral-950 dark:text-white">
          Be the first to know.
        </h2>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
          Daftar untuk mendapatkan informasi koleksi wewangian terbaru, penawaran eksklusif member, dan rilis fashion Angel Inc.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto flex items-center border-b-2 border-neutral-950 dark:border-white py-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Alamat email Anda..."
            required
            className="w-full bg-transparent text-sm text-neutral-900 dark:text-white outline-none placeholder:text-neutral-400 font-sans pr-4"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-[0.14em] text-neutral-950 dark:text-white hover:opacity-70 transition shrink-0"
          >
            <span>Subscribe</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </form>

        {subscribed && (
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 animate-fade-in">
            ✓ Anda telah terdaftar dalam daftar eksklusif kami.
          </p>
        )}

        {/* Social Links */}
        <div className="pt-6 flex justify-center items-center gap-8 text-xs font-bold uppercase tracking-[0.16em] text-neutral-600 dark:text-neutral-400">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-950 dark:hover:text-white transition"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-950 dark:hover:text-white transition"
          >
            TikTok
          </a>
          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 hover:text-neutral-950 dark:hover:text-white transition"
          >
            <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </section>
  );
}
