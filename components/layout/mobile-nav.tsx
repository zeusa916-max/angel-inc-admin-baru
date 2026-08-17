'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '@/components/layout/brand-logo';
import HeaderControls from '@/components/layout/header-controls';
import DatabaseStatusBadge from '@/components/admin/database-status-badge';
import { logoutAction } from '@/server/actions/auth.actions';
import { useToast } from '@/components/ui/toast';
import { useSplash } from '@/components/ui/splash-loader';
import { useTheme } from '@/components/providers/theme-provider';
import {
  Menu,
  X,
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  Info,
  LogOut,
  ShieldCheck,
  Globe,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produk', icon: Package },
  { href: '/admin/categories', label: 'Kategori', icon: Tags },
  { href: '/admin/orders', label: 'Pesanan', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Pelanggan', icon: Users },
  { href: '/admin/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
  { href: '/admin/system-info', label: 'Info & Changelog', icon: Info },
];

export default function MobileNav({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const { success, error } = useToast();
  const { showSplash } = useSplash();
  const { theme } = useTheme();

  const handleNavClick = (href: string, label: string) => {
    setIsOpen(false);
    if (pathname !== href) {
      showSplash(`Membuka ${label}… ✨`);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      showSplash('Keluar dari portal admin… 🕊️');

      // Clear client-side cookie
      document.cookie = 'angel_admin_demo=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT';

      // Execute server-side logout
      await logoutAction();

      success('Berhasil logout dari sistem.', 'Sampai Jumpa');

      // Hard redirect to clear all router & layout session states
      setTimeout(() => {
        window.location.href = '/auth/login/admin';
      }, 300);
    } catch (err: any) {
      error(err?.message || 'Gagal logout.');
      setLoggingOut(false);
    }
  };

  return (
    <>
      {/* Mobile Top Header */}
      <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-neutral-200 dark:border-neutral-800 bg-white/90 dark:bg-[#121316]/90 px-4 backdrop-blur-md md:hidden transition-colors duration-200">
        <BrandLogo size="sm" dark={theme === 'dark'} />
        <div className="flex items-center gap-2">
          <DatabaseStatusBadge showLabel={false} />
          <HeaderControls />
          <button
            onClick={() => setIsOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            aria-label="Buka Menu"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Backdrop & Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-4/5 max-w-xs flex flex-col justify-between bg-neutral-950 p-6 text-white shadow-2xl animate-fade-in">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <BrandLogo size="sm" dark />
                <button
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-neutral-800 text-neutral-400 hover:bg-neutral-900 hover:text-white"
                  aria-label="Tutup Menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Live Database Sync Indicator in Mobile Drawer */}
              <div className="mt-4">
                <DatabaseStatusBadge showLabel={true} className="w-full justify-between py-2 px-3 rounded-2xl" />
              </div>

              <nav className="mt-4 space-y-1.5">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
                  const isActive =
                    pathname === href ||
                    (href !== '/admin' && pathname.startsWith(href));

                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => handleNavClick(href, label)}
                      className={`flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-sm font-medium transition ${
                        isActive
                          ? 'bg-white text-neutral-950 shadow-sm'
                          : 'text-neutral-400 hover:bg-neutral-900 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 pt-3 border-t border-neutral-800">
                <Link
                  href="/"
                  target="_blank"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3.5 py-2.5 text-xs font-semibold text-neutral-300 hover:bg-neutral-800 hover:text-white transition"
                >
                  <Globe className="h-4 w-4 text-neutral-400" />
                  <span>Lihat Website Toko</span>
                </Link>
              </div>
            </div>

            <div className="border-t border-neutral-800 pt-4">
              <div className="flex items-center gap-3 rounded-xl bg-neutral-900/60 p-3 border border-neutral-800/50">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-800 text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-white">
                    {name || 'Administrator'}
                  </div>
                  <div className="truncate text-[11px] text-neutral-400">
                    {email}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/40 px-3 py-2.5 text-xs font-medium text-neutral-400 transition hover:bg-rose-950/40 hover:text-rose-300"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>{loggingOut ? 'Memproses…' : 'Keluar Sesi'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
