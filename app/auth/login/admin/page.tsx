'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/layout/brand-logo';
import { useToast } from '@/components/ui/toast';
import { useSplash } from '@/components/ui/splash-loader';
import { loginAdminAction } from '@/server/actions/auth.actions';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Store,
  Clock,
  ShieldCheck,
} from 'lucide-react';

const IDLE_TIMEOUT_SECONDS = 60; // 1 minute idle limit

export default function AdminLoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [timeLeft, setTimeLeft] = useState(IDLE_TIMEOUT_SECONDS);

  const { success, error, info } = useToast();
  const { showSplash } = useSplash();
  const isRedirectingRef = useRef(false);

  // Reset countdown on user interaction (typing/clicking)
  const resetTimer = () => {
    if (!isRedirectingRef.current) {
      setTimeLeft(IDLE_TIMEOUT_SECONDS);
    }
  };

  useEffect(() => {
    // Activity listeners to refresh idle timer if user is actively filling the form
    const handleActivity = () => {
      resetTimer();
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);

    // 1-second countdown ticker
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!isRedirectingRef.current) {
            isRedirectingRef.current = true;
            showSplash('Sesi login tidak aktif. Mengalihkan ke halaman utama butik… 🕊️');
            setTimeout(() => {
              window.location.href = '/';
            }, 500);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    resetTimer();

    const cleanInput = identifier.trim();

    if (!cleanInput) {
      setErrorMessage('Username atau email wajib diisi.');
      return;
    }

    if (!password) {
      setErrorMessage('Kata sandi wajib diisi.');
      return;
    }

    setBusy(true);

    try {
      showSplash('Memverifikasi Sesi Administrator… 🕊️');

      const res = await loginAdminAction({
        identifier: cleanInput,
        password,
      });

      if (!res.success) {
        throw new Error(res.error || 'Username/Email atau kata sandi salah.');
      }

      success(res.message || 'Login berhasil!', 'Selamat Datang');

      // Hard redirect to admin dashboard to ensure clean hydration & fresh session state
      setTimeout(() => {
        window.location.href = '/admin';
      }, 350);
    } catch (err: any) {
      const msg = err?.message || 'Gagal login ke portal admin.';
      setErrorMessage(msg);
      error(msg, 'Gagal Masuk');
      setBusy(false);
      resetTimer();
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fafbfc] dark:bg-[#0c0d0e] p-4 sm:p-6 transition-colors duration-200">
      <div className="w-full max-w-[420px]">
        {/* Minimalist Luxe Card */}
        <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-8 sm:p-10 shadow-card animate-fade-in">
          {/* Top Quick Navigation Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-black dark:text-neutral-400 dark:hover:text-white transition group"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition group-hover:-translate-x-0.5" />
              <span>Kembali ke Toko</span>
            </Link>
            <span className="rounded-full bg-neutral-100 dark:bg-neutral-800 px-2.5 py-0.5 text-[9px] font-bold tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
              PORTAL ADMIN
            </span>
          </div>

          {/* Brand Logo */}
          <div className="text-center mb-6">
            <div className="mx-auto flex justify-center">
              <BrandLogo size="lg" />
            </div>
            <h1 className="mt-4 font-display text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              Admin Portal
            </h1>
            <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">
              Masuk untuk mengelola katalog & operasional toko
            </p>
          </div>

          {/* Idle Timeout Notice */}
          <div className="mb-5 flex items-center justify-between px-3.5 py-2 rounded-2xl bg-neutral-50 dark:bg-neutral-900/70 border border-neutral-200/60 dark:border-neutral-800 text-[11px] text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-amber-500" />
              <span>Kembali ke Toko jika hening:</span>
            </div>
            <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200 bg-white dark:bg-black/60 px-2 py-0.5 rounded-lg border border-neutral-200 dark:border-neutral-800 shadow-sm">
              {timeLeft}s
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300 animate-fade-in font-medium">
                {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Username / Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => {
                    setIdentifier(e.target.value);
                    resetTimer();
                  }}
                  placeholder="admin atau email Anda"
                  autoComplete="username"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 py-2.5 pl-10 pr-4 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white focus:bg-white dark:focus:bg-neutral-900"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Kata Sandi
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-[11px] text-neutral-400 dark:text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition"
                >
                  Lupa password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    resetTimer();
                  }}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 py-2.5 pl-10 pr-10 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white focus:bg-white dark:focus:bg-neutral-900"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition"
                  title={showPassword ? 'Sembunyikan' : 'Lihat password'}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={busy}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 dark:bg-white py-3 text-xs font-semibold text-white dark:text-neutral-950 shadow-sm transition hover:bg-neutral-800 dark:hover:bg-neutral-200 disabled:opacity-50 active:scale-95"
            >
              {busy ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Memverifikasi…</span>
                </>
              ) : (
                <>
                  <span>Masuk ke Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Return to Public Website Storefront Action */}
          <div className="mt-6 pt-5 border-t border-neutral-100 dark:border-neutral-800">
            <Link
              href="/"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 py-2.5 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition shadow-sm"
            >
              <Store className="h-3.5 w-3.5" />
              <span>Lihat Website Toko (Public)</span>
            </Link>
          </div>
        </div>

        {/* Clean Footer */}
        <div className="mt-6 text-center text-[11px] text-neutral-400 dark:text-neutral-500">
          ANGEL INC. &copy; 2026 &middot; Atelier Management Console &middot; Made in Paradise
        </div>
      </div>
    </main>
  );
}
