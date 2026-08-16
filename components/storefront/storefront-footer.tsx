'use client';

import Link from 'next/link';
import BrandLogo from '@/components/layout/brand-logo';
import { Shield, Sparkles, Heart } from 'lucide-react';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from '@/components/ui/social-icons';

export default function StorefrontFooter() {
  return (
    <footer className="bg-[#141518] text-white pt-20 pb-12 border-t border-neutral-800 transition-colors duration-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 pb-16 border-b border-neutral-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <BrandLogo size="md" dark />
            </Link>
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-sans">
              Fragrance, beauty & fashion for your everyday expression. Crafted with pure ingredients and contemporary luxury standard.
            </p>
            <div className="pt-2 flex items-center gap-2 text-[11px] text-neutral-400">
              <Sparkles className="h-3.5 w-3.5 text-amber-400" />
              <span>Made in Paradise &bull; Official Storefront</span>
            </div>
          </div>

          {/* Shop Column */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
              COLLECTIONS
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Eau de Parfum
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Body Mist
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Body Care Rituals
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Exfoliating Polish
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Haute Tees & Tops
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Runway Outerwear
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Footwear & Sneakers
                </a>
              </li>
            </ul>
          </div>

          {/* Information Column */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
              ATELIER
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <a href="#about" className="hover:text-white transition">
                  Philosophy & Heritage
                </a>
              </li>
              <li>
                <a href="#membership" className="hover:text-white transition">
                  Private Membership
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  Concierge & Care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Complimentary Shipping
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Portals & Connect Column */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
              CONNECT & CARE
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-400 font-medium">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-white transition"
                >
                  <InstagramIcon className="h-3.5 w-3.5 text-neutral-400 group-hover:text-white transition" />
                  <span>Instagram</span>
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-white transition"
                >
                  <TikTokIcon className="h-3.5 w-3.5 text-neutral-400 group-hover:text-white transition" />
                  <span>TikTok</span>
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-2 hover:text-white transition"
                >
                  <WhatsAppIcon className="h-3.5 w-3.5 text-neutral-400 group-hover:text-white transition" />
                  <span>WhatsApp Concierge</span>
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  rel="nofollow"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-[11px] font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                >
                  <Shield className="h-3 w-3" />
                  <span>Admin Portal</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright & Credit */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            &copy; 2026 ANGEL INC. All Rights Reserved. &bull; <span className="text-neutral-400">Crafted by DummVinci</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Made with</span>
            <Heart className="h-3 w-3 text-neutral-400 fill-neutral-400 inline" />
            <span>in Paradise</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
