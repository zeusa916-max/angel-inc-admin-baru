'use client';

import Link from 'next/link';
import BrandLogo from '@/components/layout/brand-logo';
import { Shield, Sparkles, Heart } from 'lucide-react';

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
              SHOP
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Parfume
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Body Mist
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Body Wash
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Body Scrub
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Baju & Apparel
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Jaket & Outerwear
                </a>
              </li>
              <li>
                <a href="#shop" className="hover:text-white transition">
                  Sepatu & Sneakers
                </a>
              </li>
            </ul>
          </div>

          {/* Information Column */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">
              INFORMATION
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <a href="#about" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#membership" className="hover:text-white transition">
                  Membership
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white transition">
                  Contact & Care
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  FAQ & Ordering
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Shipping Policy
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
              PORTAL & SOSIAL
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-medium">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="https://tiktok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  TikTok
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/6281234567890"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition"
                >
                  WhatsApp Care
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/admin"
                  rel="nofollow"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-800 bg-neutral-900/80 px-3 py-1.5 text-[11px] font-bold text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                >
                  <Shield className="h-3 w-3" />
                  <span>Portal Admin</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>&copy; 2026 ANGEL INC. All Rights Reserved. Made in Paradise.</div>
          <div className="flex items-center gap-1">
            <span>Crafted with</span>
            <Heart className="h-3 w-3 text-rose-500 fill-rose-500 inline" />
            <span>for your everyday expression</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
