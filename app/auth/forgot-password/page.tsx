'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import BrandLogo from '@/components/layout/brand-logo';
import { useToast } from '@/components/ui/toast';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [busy, setBusy] = useState(false);

  const { success, error } = useToast();

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.includes('@')) {
      setErrorMessage('Masukkan email yang valid.');
      return;
    }

    setBusy(true);

    try {
      const supabase = createClient();
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_SITE_URL || '';

      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: `${origin}/auth/update-password`,
        });

      if (resetError) throw resetError;

      setSentSuccess(true);
      success(
        'Tautan instruksi reset kata sandi telah dikirim ke email Anda.',
        'Email Terkirim'
      );
    } catch (err: any) {
      const msg = err?.message || 'Gagal mengirim email reset kata sandi.';
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
              Reset Kata Sandi
            </h1>
            <p className="mt-1 text-xs text-neutral-500">
              Masukkan alamat email akun administrator Anda
            </p>
          </div>

          {sentSuccess ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-neutral-900">
                  Email Terkirim!
                </h2>
                <p className="mt-1 text-xs text-neutral-600 leading-relaxed">
                  Kami telah mengirimkan tautan reset kata sandi ke{' '}
                  <strong className="text-neutral-900">{email}</strong>. Silakan periksa kotak masuk atau folder spam Anda.
                </p>
              </div>
              <Link
                href="/auth/login/admin"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-900 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Kembali ke Halaman Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {errorMessage && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 leading-relaxed animate-fade-in">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1.5">
                  Email Administrator
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@angelinc.id"
                    autoComplete="email"
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
                    <span>Mengirim Tautan…</span>
                  </>
                ) : (
                  <span>Kirim Tautan Reset</span>
                )}
              </button>

              <div className="pt-2 text-center">
                <Link
                  href="/auth/login/admin"
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-950 transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Batal & Kembali ke Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
