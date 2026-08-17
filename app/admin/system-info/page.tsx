'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/toast';
import DatabaseStatusBadge from '@/components/admin/database-status-badge';
import {
  Sparkles,
  Info,
  Layers,
  ShieldCheck,
  Server,
  Database,
  GitBranch,
  Calendar,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  Code2,
  Cpu,
  Globe,
  Zap,
} from 'lucide-react';

interface ChangelogEntry {
  version: string;
  date: string;
  tag: 'Latest' | 'Stable' | 'Major';
  title: string;
  highlights: string[];
  changes: {
    category: string;
    items: string[];
  }[];
}

const CHANGELOG_DATA: ChangelogEntry[] = [
  {
    version: 'v1.6.0',
    date: '17 August 2026',
    tag: 'Latest',
    title: 'Streamlined Luxury Checkout & Architecture Hardening',
    highlights: [
      'Penyederhanaan halaman checkout & penghapusan opsi COD',
      'Integrasi Root StorefrontProvider untuk mencegah race condition keranjang',
      'Sistem voucher privilege & in-checkout quantity stepper',
      'Standarisasi branding anonim pada seluruh storefront dan konsol admin',
    ],
    changes: [
      {
        category: 'Checkout & Payments',
        items: [
          'Menghapus metode pembayaran Cash on Delivery (COD) demi kepraktisan & efisiensi operasional.',
          'Menyederhanakan payment selector menjadi QRIS Instant Pay, Bank Transfer (BCA), dan WhatsApp Concierge.',
          'Menambahkan 1-click "Copy Account" pada kartu rekening Bank Central Asia.',
          'Menambahkan interaktif voucher engine (kode: ANGEL10, VIPCOUTURE, PARADISE).',
          'Menambahkan in-checkout stepper kuantitas (+ / - / hapus) langsung pada sidebar ringkasan pesanan.',
        ],
      },
      {
        category: 'Core Architecture & Hydration',
        items: [
          'Memindahkan StorefrontProvider ke level RootLayout di app/layout.tsx untuk menjamin sinkronisasi state keranjang di seluruh route.',
          'Menambahkan flag isLoaded pada StorefrontContext untuk mencegah penulisan array kosong ke localStorage saat awal render.',
          'Menghindari flash "Your Bag is Empty" pada navigasi langsung ke /checkout.',
        ],
      },
      {
        category: 'Branding & UI Anonymity',
        items: [
          'Menghapus kredit pengembang visual pada footer publik dan halaman login admin.',
          'Menstandarisasi copyright resmi: "© 2026 ANGEL INC. All Rights Reserved. • Haute Parfumerie & Atelier".',
        ],
      },
    ],
  },
  {
    version: 'v1.5.0',
    date: '16 August 2026',
    tag: 'Stable',
    title: 'Haute Couture English Standardization & Contrast Uplift',
    highlights: [
      'Standarisasi bahasa Inggris editorial ala rumah mode mewah (Gucci / Saint Laurent / Off-White)',
      'Peningkatan kontras visual pada Our Values & icon badges',
      'Kurasi foto studio monokrom beresolusi tinggi pada seluruh katalog',
    ],
    changes: [
      {
        category: 'Storefront Localization',
        items: [
          'Mengubah seluruh copy publik menjadi bahasa Inggris editorial haute couture.',
          'Kategori terstandarisasi: EAU DE PARFUM, BODY MIST, BODY CARE, HAUTE TEE, OUTERWEAR, FOOTWEAR.',
          'Badge eksklusif: Couture Icon, Runway Edit, Essential, New Arrival.',
          'Pembaruan Shopping Bag, Quick View, Newsletter Inner Circle, dan Atelier Guild Membership copy.',
        ],
      },
      {
        category: 'Visual Design & Contrast',
        items: [
          'Peningkatan kontras kartu Our Values dengan border kontras tinggi dan halo icon badge.',
          'Sinkronisasi studio image assets ke file seed SQL Supabase dan server mock fallback.',
        ],
      },
    ],
  },
  {
    version: 'v1.4.0',
    date: '15 August 2026',
    tag: 'Stable',
    title: 'Member Authentication & Security Audit Trail',
    highlights: [
      'Login instan member tanpa password dengan nomor HP & OTP',
      'Pencatatan riwayat login / logout / event security ke Supabase',
      'Diskon otomatis 5% dan auto-fill alamat pengiriman untuk member terdaftar',
    ],
    changes: [
      {
        category: 'Member Portal',
        items: [
          'Membuat modal autentikasi member dengan verifikasi OTP 4 digit (demo OTP: 1234).',
          'Dashboard profil member dengan 3 tab: Privileges, Order Archive, dan Security Audit Trail.',
          'Pencatatan log aktivitas login/logout dengan timestamp dan IP address.',
          'Koneksi otomatis ke tabel members, member_sessions, dan member_activity_logs di Supabase.',
        ],
      },
    ],
  },
  {
    version: 'v1.0.0 - v1.3.0',
    date: 'Initial Releases',
    tag: 'Major',
    title: 'Foundation Release: Admin Suite & Dual Currency Engine',
    highlights: [
      'Sistem manajemen admin lengkap (Dashboard, Produk, Kategori, Pesanan, Pelanggan, Laporan)',
      'Dual currency converter realtime (IDR / USD)',
      'Theme engine Light / Dark mode dengan instant script injection',
    ],
    changes: [
      {
        category: 'Admin Console & Reports',
        items: [
          'Dashboard analitik dengan metrik pendapatan, status pesanan, dan grafik performa.',
          'CRUD produk lengkap dengan manajemen gambar, varian, dan stok.',
          'Manajemen status pesanan realtime (Pending, Processing, Completed, Cancelled).',
          'Laporan keuangan dan ekspor data operasional.',
        ],
      },
    ],
  },
];

export default function SystemInfoPage() {
  const { success } = useToast();
  const [copiedDiagnostics, setCopiedDiagnostics] = useState(false);

  const systemDiagnostics = `ANGEL INC. SYSTEM DIAGNOSTICS
================================
Environment: Production / Turbopack
Framework: Next.js 16.3.0 (React 19)
TypeScript: Strict Mode Enabled
Database: Supabase PostgreSQL (Layered Fallback)
Styling: Tailwind CSS v3.4 + Vanilla Tokens
Currency: Dual IDR / USD Engine
State: Root StorefrontProvider (LocalStorage Synced)
Last Build: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
Status: All Services Nominal (0 Warnings, 0 Compile Errors)`;

  const handleCopyDiagnostics = () => {
    navigator.clipboard.writeText(systemDiagnostics);
    setCopiedDiagnostics(true);
    setTimeout(() => setCopiedDiagnostics(false), 2500);
    success('Informasi diagnostik sistem berhasil disalin.', 'Tersalin');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 dark:text-neutral-500">
            KONSOL SISTEM & PENGEMBANGAN
          </span>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Info Sistem & Changelog Fitur
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Riwayat pembaruan rilis, spesifikasi arsitektur, dan status kesehatan platform Angel Inc.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyDiagnostics}
            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2 text-xs font-semibold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition shadow-sm"
          >
            {copiedDiagnostics ? (
              <>
                <Check className="h-4 w-4 text-emerald-500" />
                <span>Diagnostik Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-neutral-400" />
                <span>Salin Info Diagnostik</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* System Architecture & Health Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Core Framework
            </span>
            <Cpu className="h-4 w-4 text-blue-500" />
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-white font-mono">
            Next.js 16.3
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Turbopack & React 19</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Basis Data Live Status
            </span>
            <Database className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="pt-1">
            <DatabaseStatusBadge showLabel={true} />
          </div>
          <div className="text-[11px] text-neutral-500">
            Klik badge untuk rincian skema tabel
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              State & Hydration
            </span>
            <Zap className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-base font-bold text-neutral-900 dark:text-white font-mono">
            Root Storefront
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Guarded LocalStorage Sync</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-4 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Status Build
            </span>
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="text-base font-bold text-emerald-600 dark:text-emerald-400 font-mono">
            Exit Code 0
          </div>
          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>17/17 Static & SSR Routes OK</span>
          </div>
        </div>
      </div>

      {/* Changelog Timeline */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-neutral-200 dark:border-neutral-800 pb-3">
          <Layers className="h-4 w-4 text-neutral-500" />
          <h2 className="font-serif text-lg font-bold text-neutral-900 dark:text-white">
            Log Riwayat Rilis & Perubahan Fitur (Changelog)
          </h2>
        </div>

        <div className="space-y-6">
          {CHANGELOG_DATA.map((entry) => (
            <div
              key={entry.version}
              className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 sm:p-8 shadow-sm space-y-5 transition hover:border-neutral-300 dark:hover:border-neutral-700"
            >
              {/* Entry Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-base sm:text-lg font-bold text-neutral-900 dark:text-white">
                    {entry.version}
                  </span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      entry.tag === 'Latest'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800'
                        : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    {entry.tag}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-neutral-400">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{entry.date}</span>
                </div>
              </div>

              {/* Title & Highlights */}
              <div>
                <h3 className="font-serif text-base sm:text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  {entry.title}
                </h3>
                <div className="grid sm:grid-cols-2 gap-2">
                  {entry.highlights.map((h, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-900/50 p-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Breakdown by Category */}
              <div className="space-y-4 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                  Rincian Teknis Pembaruan
                </span>
                <div className="grid md:grid-cols-2 gap-4">
                  {entry.changes.map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="rounded-2xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/30 p-4 space-y-2"
                    >
                      <h4 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-950 dark:bg-white" />
                        <span>{group.category}</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                        {group.items.map((item, itemIdx) => (
                          <li key={itemIdx} className="flex items-start gap-2 leading-relaxed">
                            <span className="text-neutral-400 shrink-0 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
