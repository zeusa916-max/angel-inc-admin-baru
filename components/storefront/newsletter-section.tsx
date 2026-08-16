'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import { ArrowRight, Send } from 'lucide-react';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from '@/components/ui/social-icons';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const { success, error } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      error('Please enter a valid email address.');
      return;
    }

    setSubscribed(true);
    success('You are now subscribed to the Angel Inc. Private Archive.', 'Subscribed');
    setEmail('');
  };

  return (
    <section id="contact" className="py-24 bg-[#f8f7f4] dark:bg-[#121316] transition-colors duration-200">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
          THE INNER CIRCLE
        </p>

        <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-neutral-950 dark:text-white">
          Be the first to know.
        </h2>

        <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
          Subscribe for privileged previews of new fragrance creations, private atelier events, and limited collection releases.
        </p>

        <form
          onSubmit={handleSubmit}
          className="max-w-md mx-auto flex items-center border-b-2 border-neutral-950 dark:border-white py-2"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address..."
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
            ✓ You have been welcomed to the Angel Inc. private guest list.
          </p>
        )}

        {/* Refined Luxury Social Icons */}
        <div className="pt-8 flex flex-wrap justify-center items-center gap-3 sm:gap-4">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 px-4 py-2 text-xs font-semibold tracking-wider text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm"
          >
            <InstagramIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[11px] uppercase tracking-widest font-bold">Instagram</span>
          </a>

          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 px-4 py-2 text-xs font-semibold tracking-wider text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm"
          >
            <TikTokIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[11px] uppercase tracking-widest font-bold">TikTok</span>
          </a>

          <a
            href="https://wa.me/6281234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 rounded-full border border-neutral-200/80 dark:border-neutral-800 bg-white/90 dark:bg-neutral-900/90 px-4 py-2 text-xs font-semibold tracking-wider text-neutral-700 dark:text-neutral-300 hover:border-black dark:hover:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 shadow-sm"
          >
            <WhatsAppIcon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
            <span className="text-[11px] uppercase tracking-widest font-bold">WhatsApp Care</span>
          </a>
        </div>
      </div>
    </section>
  );
}
