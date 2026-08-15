'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import BrandLogo from '@/components/layout/brand-logo';
import HeaderControls from '@/components/layout/header-controls';
import { logoutAction } from '@/server/actions/auth.actions';
import { useToast } from '@/components/ui/toast';
import { useSplash } from '@/components/ui/splash-loader';
import { useTheme } from '@/components/providers/theme-provider';
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingBag,
  Users,
  BarChart3,
  Settings,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Produk', icon: Package },
  { href: '/admin/categories', label: 'Kategori', icon: Tags },
  { href: '/admin/orders', label: 'Pesanan', icon: ShoppingBag },
  { href: '/admin/customers', label: 'Pelanggan', icon: Users },
  { href: '/admin/reports', label: 'Laporan', icon: BarChart3 },
  { href: '/admin/settings', label: 'Pengaturan', icon: Settings },
];

export default function Nav({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();
  const { success, error } = useToast();
  const { showSplash } = useSplash();
  const { theme } = useTheme();

  const handleNavClick = (href: string, label: string) => {
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
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:flex md:w-64 md:flex-col md:justify-between md:border-r md:border-neutral-200 dark:md:border-neutral-800 md:bg-white dark:md:bg-[#121316] md:p-5 shadow-subtle z-30 transition-colors duration-200">
      <div>
        <div className="flex items-center justify-center border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <BrandLogo size="md" dark={theme === 'dark'} />
        </div>

        {/* Quick Theme & Currency Controls */}
        <div className="mt-4 flex items-center justify-between px-1 py-2 border-b border-neutral-100 dark:border-neutral-800/80">
          <span className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            Pengaturan
          </span>
          <HeaderControls />
        </div>

        <nav className="mt-5 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== '/admin' && pathname.startsWith(href));

            return (
              <Link
                key={href}
                href={href}
                onClick={() => handleNavClick(href, label)}
                className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 shadow-sm scale-[1.02]'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800/80 hover:text-neutral-900 dark:hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4">
        <div className="flex items-center gap-3 rounded-xl bg-neutral-50 dark:bg-neutral-900/80 p-3 border border-neutral-200/60 dark:border-neutral-800">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-neutral-900 dark:bg-neutral-800 text-white shadow-sm">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-neutral-900 dark:text-neutral-100">
              {name || 'Administrator'}
            </div>
            <div className="truncate text-[11px] text-neutral-400 dark:text-neutral-500">
              {email}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 shadow-sm transition hover:border-rose-200 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 disabled:opacity-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>{loggingOut ? 'Memproses…' : 'Keluar Sesi'}</span>
        </button>
      </div>
    </aside>
  );
}
