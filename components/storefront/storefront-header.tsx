'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BrandLogo from '@/components/layout/brand-logo';
import { useStorefront } from './storefront-context';
import { useCurrency } from '@/components/providers/currency-provider';
import { useTheme } from '@/components/providers/theme-provider';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Shield,
  Sun,
  Moon,
  DollarSign,
  Crown,
  User,
} from 'lucide-react';
import MemberAuthModal from './member-auth-modal';
import { getMemberSessionAction, MemberSession } from '@/server/actions/member.actions';

export default function StorefrontHeader() {
  const { cartCount, setIsCartOpen, setIsSearchOpen } = useStorefront();
  const { currency, setCurrency } = useCurrency();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [member, setMember] = useState<MemberSession | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    getMemberSessionAction().then((res) => {
      if (res.success && res.data) setMember(res.data);
    });
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Shop', href: '#shop' },
    { label: 'About', href: '#about' },
    { label: 'Membership', href: '#membership' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#141518] text-white py-1.5 px-4 text-center text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase transition-colors duration-200">
        FREE SHIPPING • DISCOVER THE ANGEL INC COLLECTION
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 dark:bg-[#0f1013]/95 backdrop-blur-md shadow-sm border-b border-neutral-200/80 dark:border-neutral-800'
            : 'bg-white/90 dark:bg-[#0f1013]/90 backdrop-blur-sm border-b border-neutral-100 dark:border-neutral-800/80'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="Angel Inc Home">
            <BrandLogo size="md" dark={theme === 'dark'} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-700 dark:text-neutral-300">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="hover:text-black dark:hover:text-white transition duration-200 py-1 border-b border-transparent hover:border-black dark:hover:border-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* Member Profile / Auth Button */}
            <button
              type="button"
              onClick={() => setMemberModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-2.5 sm:px-3 py-1.5 text-[11px] font-bold text-neutral-800 dark:text-neutral-200 hover:border-black dark:hover:border-white transition shadow-sm"
              title={member ? `Akun Member: ${member.name}` : 'Login Member / Daftar'}
            >
              <Crown className="h-3.5 w-3.5 text-amber-500" />
              <span className="hidden sm:inline">{member ? member.name.split(' ')[0] : 'Member'}</span>
            </button>

            {/* Currency Switcher */}
            <button
              type="button"
              onClick={() => setCurrency(currency === 'IDR' ? 'USD' : 'IDR')}
              className="hidden sm:inline-flex items-center gap-1 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 px-2.5 py-1.5 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              title="Ganti mata uang (IDR / USD)"
            >
              <DollarSign className="h-3.5 w-3.5 text-neutral-500" />
              <span>{currency}</span>
            </button>

            {/* Theme Switcher */}
            <button
              type="button"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              title="Toggle Light / Dark mode"
              aria-label="Toggle tema"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-neutral-700" />
              )}
            </button>

            {/* Search Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200/80 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              title="Cari produk"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Shopping Bag Button */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative flex h-9 items-center gap-1.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-3 text-xs font-semibold shadow-sm hover:opacity-90 transition active:scale-95"
              aria-label="Shopping bag"
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span className="text-[11px] font-bold">{cartCount}</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300"
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Member Phone + OTP Auth Modal */}
      <MemberAuthModal
        isOpen={memberModalOpen}
        onClose={() => {
          setMemberModalOpen(false);
          getMemberSessionAction().then((res) => {
            if (res.success) setMember(res.data);
          });
        }}
        onSuccess={(m) => {
          setMember(m);
          setMemberModalOpen(false);
        }}
      />

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-4/5 max-w-sm bg-white dark:bg-[#121316] p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-5">
                <BrandLogo size="md" dark={theme === 'dark'} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-8 space-y-4 font-serif text-2xl">
                {navLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-neutral-900 dark:text-white hover:opacity-60 transition"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </div>

            <div className="border-t border-neutral-100 dark:border-neutral-800 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  Mata Uang ({currency})
                </span>
                <button
                  onClick={() => setCurrency(currency === 'IDR' ? 'USD' : 'IDR')}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-xs font-bold"
                >
                  Ganti ke {currency === 'IDR' ? 'USD' : 'IDR'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
