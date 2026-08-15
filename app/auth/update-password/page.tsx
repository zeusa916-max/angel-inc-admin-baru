'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/layout/brand-logo';
import { useToast } from '@/components/ui/toast';
import { Lock, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

export default function UpdatePasswordPage() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const router = useRouter();
  const { success, error } = useToast();

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (newPassword.length < 8) {
      setErrorMessage('Kata sandi baru minimal harus 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    setBusy(true);

    try {
      const supabase = createClient();

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateError) throw updateError;

      success('Kata sandi Anda telah berhasil diperbarui.', 'Berhasil');
      router.replace('/admin');
    } catch (err: any) {
      const msg = err?.message || 'Gagal memperbarui kata sandi.';
      setErrorMessage(msg);
      error(msg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-8 shadow-dropdown sm:p-10 animate-fade-in">
          <div className="mb-8 text-center">
            <BrandLogo className="mx-auto h-16 w-40" />
            <h1 className="mt-4 font-display text-2xl font-bold tracking-tight text-neutral-900">
              Buat Kata Sandi Baru
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              Masukkan kata sandi baru untuk akun administrator Anda
            </p>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            {errorMessage && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 leading-relaxed animate-fade-in">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Kata Sandi Baru (Min. 8 Karakter)
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-10 text-xs outline-none transition focus:border-neutral-950 focus:bg-white focus:ring-1 focus:ring-neutral-950"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 transition"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50/50 py-2.5 pl-10 pr-4 text-xs outline-none transition focus:border-neutral-950 focus:bg-white focus:ring-1 focus:ring-neutral-950"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 py-3 text-xs font-semibold text-white shadow-sm transition hover:bg-neutral-800 disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Menyimpan Kata Sandi…</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  <span>Simpan & Masuk ke Dashboard</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
