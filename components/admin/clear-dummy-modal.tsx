'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, AlertTriangle, Loader2, X, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { useSplash } from '@/components/ui/splash-loader';
import { clearDummyDataAction } from '@/server/actions/admin-utility.actions';

export default function ClearDummyModal({
  buttonVariant = 'default',
}: {
  buttonVariant?: 'default' | 'compact';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();
  const { showSplash, hideSplash } = useSplash();

  const handleClear = async () => {
    try {
      setBusy(true);
      showSplash('Membersihkan seluruh data dummy… 🧹');

      const res = await clearDummyDataAction();
      if (!res.success) {
        throw new Error(res.error || 'Gagal membersihkan data dummy.');
      }

      success('Seluruh data dummy berhasil dibersihkan!', 'Database Bersih');
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      error(err?.message || 'Gagal membersihkan data dummy.', 'Kesalahan');
    } finally {
      setBusy(false);
      hideSplash();
    }
  };

  return (
    <>
      {buttonVariant === 'compact' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 px-3 py-2 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition shadow-sm"
          title="Hapus seluruh data dummy testing"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Hapus Dummy</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/70 dark:bg-rose-950/40 px-4 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition shadow-sm"
        >
          <Trash2 className="h-4 w-4" />
          <span>Hapus Seluruh Data Dummy</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !busy && setIsOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-2xl animate-fade-in z-10 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Bersihkan Seluruh Dummy Data?
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Tindakan ini akan mengosongkan database produk, kategori & pesanan dummy.
                  </p>
                </div>
              </div>
              <button
                onClick={() => !busy && setIsOpen(false)}
                disabled={busy}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 p-4 text-xs text-neutral-600 dark:text-neutral-400 space-y-2 border border-neutral-200/60 dark:border-neutral-800">
              <div className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                <span>Yang akan dibersihkan:</span>
              </div>
              <ul className="list-disc pl-5 space-y-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                <li>Seluruh produk & foto produk sampel</li>
                <li>Seluruh kategori produk sampel</li>
                <li>Seluruh riwayat pesanan dummy</li>
                <li>Seluruh data pelanggan dummy</li>
              </ul>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium pt-1">
                ✓ Akun profil administrator Anda tetap aman dan tidak akan terhapus.
              </p>
            </div>

            <div className="flex justify-end gap-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={busy}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={busy}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-rose-700 transition disabled:opacity-50 shadow-sm"
              >
                {busy ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Membersihkan…</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Ya, Bersihkan Sekarang</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
