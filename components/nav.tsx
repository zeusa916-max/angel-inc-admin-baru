'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import BrandLogo from '@/components/brand-logo';

const items = [
  ['/admin', 'Dashboard'],
  ['/admin/products', 'Produk'],
  ['/admin/categories', 'Kategori'],
  ['/admin/orders', 'Pesanan'],
  ['/admin/customers', 'Pelanggan'],
  ['/admin/reports', 'Laporan'],
  ['/admin/settings', 'Pengaturan'],
];

export default function Nav({ email, name }: { email: string; name: string }) {
  const p = usePathname(), r = useRouter();

  return (
    <aside className="fixed inset-y-0 left-0 hidden w-64 bg-neutral-950 p-5 text-white md:block">
      <div className="mb-8">
        <BrandLogo
          dark
          className="mx-auto h-20 w-full"
        />
        <div className="mt-2 text-center text-[9px] tracking-[.25em] text-white/40">ADMIN PORTAL</div>
      </div>

      <nav className="space-y-1">
        {items.map(([h, l]) => (
          <Link
            key={h}
            href={h}
            className={`block rounded-xl px-3 py-3 text-sm ${
              p === h || (h !== '/admin' && p.startsWith(h))
                ? 'bg-white text-black'
                : 'text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {l}
          </Link>
        ))}
      </nav>

      <div className="absolute bottom-5 left-5 right-5 border-t border-white/10 pt-4">
        <div className="truncate text-sm">{name || 'Admin'}</div>
        <div className="truncate text-xs text-white/40">{email}</div>
        <button
          onClick={async () => {
            await createClient().auth.signOut();
            r.replace('/auth/login/admin');
          }}
          className="mt-3 text-sm text-white/60 hover:text-white"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
