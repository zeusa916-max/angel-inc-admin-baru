'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2, AlertTriangle, X } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { deleteProductAction } from '@/server/actions/product.actions';

interface DeleteProductProps {
  id: string;
  name: string;
}

export default function DeleteProduct({ id, name }: DeleteProductProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const { success, error } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await deleteProductAction(id);
      if (!res.success) {
        throw new Error(res.error || 'Gagal menghapus produk.');
      }

      success(`Produk "${name}" berhasil dihapus.`, 'Berhasil');
      setIsOpen(false);
      router.refresh();
    } catch (err: any) {
      error(err?.message || 'Gagal menghapus produk.', 'Kesalahan');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/50 px-2.5 py-1.5 text-xs font-medium text-rose-600 transition hover:bg-rose-100 hover:text-rose-700"
        title="Hapus Produk"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Hapus</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setIsOpen(false)}
          />

          <div className="relative w-full max-w-md rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-2xl animate-fade-in z-10 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Hapus Produk?
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Tindakan ini tidak dapat dibatalkan.
                  </p>
                </div>
              </div>
              <button
                onClick={() => !isDeleting && setIsOpen(false)}
                disabled={isDeleting}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
              Apakah Anda yakin ingin menghapus produk{' '}
              <strong className="font-semibold text-neutral-900 dark:text-white">"{name}"</strong> beserta seluruh foto produk terkait?
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isDeleting}
                className="rounded-xl border border-neutral-200 dark:border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-50 shadow-sm"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Menghapus…</span>
                  </>
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
