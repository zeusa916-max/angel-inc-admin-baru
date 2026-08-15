'use client';

import { useState } from 'react';
import { recreateDummyDataAction } from '@/server/actions/admin-utility.actions';
import { useToast } from '@/components/ui/toast';
import { useSplash } from '@/components/ui/splash-loader';
import { RefreshCw, Loader2, Sparkles, Database, X } from 'lucide-react';

export default function RecreateDummyModal({
  buttonVariant = 'default',
}: {
  buttonVariant?: 'default' | 'compact';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { success, error } = useToast();
  const { showSplash, hideSplash } = useSplash();

  const handleRecreate = async () => {
    try {
      setLoading(true);
      showSplash('Membuat ulang data dummy katalog & pesanan… 🕊️');

      const res = await recreateDummyDataAction();

      if (!res.success) {
        throw new Error(res.error || 'Gagal membuat ulang data dummy.');
      }

      success(res.message || 'Data dummy berhasil dibuat ulang!', 'Sukses');
      setIsOpen(false);

      // Force full clean refresh of page data
      setTimeout(() => {
        window.location.reload();
      }, 400);
    } catch (err: any) {
      error(err?.message || 'Gagal membuat ulang data dummy.', 'Error');
    } finally {
      setLoading(false);
      hideSplash();
    }
  };

  return (
    <>
      {buttonVariant === 'compact' ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/40 px-3 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition shadow-sm"
          title="Isi ulang data dummy testing"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Isi Ulang Dummy</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/40 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shadow-sm transition hover:bg-emerald-100 dark:hover:bg-emerald-900/60 active:scale-[0.99]"
        >
          <Database className="h-4 w-4" />
          <span>Recreate Data Dummy</span>
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => !loading && setIsOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-2xl animate-fade-in z-10 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Buat Ulang Data Dummy?
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Isi ulang katalog, pesanan, dan grafik dashboard
                  </p>
                </div>
              </div>
              <button
                onClick={() => !loading && setIsOpen(false)}
                disabled={loading}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Tindakan ini akan mengisikan kembali sampel produk, kategori, pelanggan, dan transaksi pesanan dummy agar dashboard dan grafik PnL toko kembali terisi penuh.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={loading}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleRecreate}
                disabled={loading}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 shadow-sm transition"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Memproses…</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>Ya, Buat Ulang</span>
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
