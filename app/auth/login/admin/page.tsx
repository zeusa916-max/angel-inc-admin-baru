'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BrandLogo from '@/components/brand-logo';

export default function Login() {
  const [e, setE] = useState('');
  const [p, setP] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);
  const r = useRouter();

  async function go(x: React.FormEvent<HTMLFormElement>) {
    x.preventDefault();
    setErr('');
    if (!e.includes('@')) return setErr('Email wajib valid.');
    if (!p) return setErr('Password wajib diisi.');

    setBusy(true);
    const { error } = await createClient().auth.signInWithPassword({
      email: e,
      password: p,
    });

    if (error) {
      setErr('Email atau password salah.');
    } else {
      r.replace('/admin');
    }
    setBusy(false);
  }

  return (
    <main className="grid min-h-screen place-items-center bg-neutral-50 p-5">
      <form onSubmit={go} className="w-full max-w-md rounded-3xl border bg-white p-8 shadow-sm">
        <div className="mb-8 text-center">
          <BrandLogo className="mx-auto h-28 w-64" />
          <div className="mt-1 text-[9px] tracking-[.25em] text-neutral-400">ADMIN PORTAL</div>
          <h1 className="mt-2 font-display text-4xl">Admin Portal</h1>
          <p className="mt-2 text-sm text-neutral-500">Masuk ke dashboard administrator</p>
        </div>

        <div className="space-y-4">
          <input
            value={e}
            onChange={x => setE(x.target.value)}
            type="email"
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-xl border px-4 py-3 outline-none focus:border-black"
          />

          <div className="relative">
            <input
              value={p}
              onChange={x => setP(x.target.value)}
              type={show ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              className="w-full rounded-xl border px-4 py-3 pr-24 outline-none focus:border-black"
            />
            <button
              type="button"
              onClick={() => setShow(!show)}
              className="absolute right-3 top-3 text-xs text-neutral-500"
            >
              {show ? 'Sembunyikan' : 'Tampilkan'}
            </button>
          </div>

          {err && <p className="text-sm text-red-600">{err}</p>}

          <button
            disabled={busy}
            className="w-full rounded-xl bg-black py-3 text-white transition hover:bg-neutral-800 disabled:opacity-50"
          >
            {busy ? 'Memproses…' : 'Login'}
          </button>

          <Link href="/auth/forgot-password" className="block text-center text-sm text-neutral-500 hover:text-black">
            Lupa password?
          </Link>
        </div>
      </form>
    </main>
  );
}
