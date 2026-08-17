'use client';

import { useState, useEffect } from 'react';
import { getDatabaseHealthAction, DatabaseHealthResult } from '@/server/actions/health.actions';
import { useToast } from '@/components/ui/toast';
import {
  Database,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Zap,
  Clock,
  ShieldCheck,
  ExternalLink,
  X,
} from 'lucide-react';

interface DatabaseStatusBadgeProps {
  showLabel?: boolean;
  compact?: boolean;
  className?: string;
}

export default function DatabaseStatusBadge({
  showLabel = true,
  compact = false,
  className = '',
}: DatabaseStatusBadgeProps) {
  const [health, setHealth] = useState<DatabaseHealthResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { info, success, error } = useToast();

  const fetchHealth = async (isManual = false) => {
    try {
      setLoading(true);
      const res = await getDatabaseHealthAction();
      setHealth(res);

      if (isManual) {
        if (res.status === 'online') {
          success(res.message, 'Database Online');
        } else if (res.status === 'warning') {
          info(res.message, 'Database Warning');
        } else {
          error(res.message, 'Database Offline');
        }
      }
    } catch (err: any) {
      setHealth({
        status: 'error',
        color: 'red',
        mode: 'disconnected',
        latencyMs: 0,
        message: 'Gagal menghubungi server health check endpoint.',
        tables: { products: false, categories: false, orders: false, members: false },
        timestamp: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => fetchHealth(), 60000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColorClasses = () => {
    if (loading && !health) {
      return {
        bg: 'bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700',
        text: 'text-neutral-500',
        dot: 'bg-neutral-400',
        ping: 'bg-neutral-400',
        label: 'Checking DB…',
      };
    }

    if (!health || health.status === 'error') {
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60',
        text: 'text-rose-700 dark:text-rose-300',
        dot: 'bg-rose-500',
        ping: 'bg-rose-400',
        label: 'Database Offline',
      };
    }

    if (health.status === 'warning') {
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60',
        text: 'text-amber-700 dark:text-amber-300',
        dot: 'bg-amber-500',
        ping: 'bg-amber-400',
        label: health.mode === 'mock_fallback' ? 'Demo Fallback' : 'DB Warning',
      };
    }

    return {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60',
      text: 'text-emerald-700 dark:text-emerald-300',
      dot: 'bg-emerald-500',
      ping: 'bg-emerald-400',
      label: 'Supabase Synced',
    };
  };

  const statusStyles = getStatusColorClasses();

  return (
    <>
      {/* Interactive Status Pill Button */}
      <button
        type="button"
        onClick={() => setIsModalOpen(true)}
        className={`group relative inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-xs font-semibold shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 ${statusStyles.bg} ${statusStyles.text} ${className}`}
        title="Klik untuk membuka diagnostik koneksi database Supabase"
      >
        {/* Pulsing Dot Indicator */}
        <span className="relative flex h-2.5 w-2.5 shrink-0">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping ${statusStyles.ping}`}
          />
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${statusStyles.dot}`} />
        </span>

        {showLabel && (
          <span className="truncate tracking-wide text-[11px] font-bold">
            {statusStyles.label}
          </span>
        )}

        {loading ? (
          <RefreshCw className="h-3 w-3 animate-spin opacity-70" />
        ) : (
          <Database className="h-3 w-3 opacity-60 group-hover:opacity-100 transition" />
        )}
      </button>

      {/* Diagnostics Modal / Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div
            className="fixed inset-0"
            onClick={() => setIsModalOpen(false)}
          />

          <div className="relative w-full max-w-lg rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-2xl space-y-5 text-neutral-900 dark:text-white z-10 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl border ${statusStyles.bg}`}
                >
                  <Database className={`h-5 w-5 ${statusStyles.text}`} />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold">
                    Diagnostik Koneksi Basis Data
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Status Sinkronisasi Supabase PostgreSQL & Layered Fallback
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-black dark:hover:text-white transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Status Summary Banner */}
            <div
              className={`rounded-2xl border p-4 space-y-2 text-xs ${statusStyles.bg} ${statusStyles.text}`}
            >
              <div className="flex items-center justify-between font-bold">
                <div className="flex items-center gap-2">
                  {health?.status === 'online' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  {health?.status === 'warning' && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  {health?.status === 'error' && <XCircle className="h-4 w-4 text-rose-500" />}
                  <span className="uppercase tracking-wider">
                    {health?.status === 'online'
                      ? '🟢 KONEKSI ONLINE & STABIL'
                      : health?.status === 'warning'
                      ? '🟡 MODE CADANGAN / PERINGATAN'
                      : '🔴 KONEKSI TERPUTUS'}
                  </span>
                </div>

                <span className="font-mono font-bold">
                  {health?.latencyMs ? `${health.latencyMs} ms` : 'N/A'}
                </span>
              </div>

              <p className="text-[11px] leading-relaxed">
                {health?.message || 'Memeriksa status koneksi…'}
              </p>

              {health?.details && (
                <div className="text-[10px] opacity-80 pt-1 border-t border-current/10">
                  {health.details}
                </div>
              )}
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase text-neutral-400">
                  Engine Aktif
                </span>
                <div className="font-semibold text-neutral-900 dark:text-white flex items-center gap-1.5">
                  <Server className="h-3.5 w-3.5 text-neutral-400" />
                  <span>
                    {health?.mode === 'supabase'
                      ? 'Supabase Cloud'
                      : health?.mode === 'mock_fallback'
                      ? 'In-Memory Cache'
                      : 'Disconnected'}
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 p-3 space-y-1">
                <span className="text-[10px] font-bold uppercase text-neutral-400">
                  Endpoint Host
                </span>
                <div className="font-mono text-[11px] truncate text-neutral-700 dark:text-neutral-300">
                  {health?.urlHost || 'Local Fallback'}
                </div>
              </div>
            </div>

            {/* Table Health Checklist */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
                Pemeriksaan Skema Tabel
              </span>

              <div className="grid grid-cols-2 gap-2">
                {Object.entries(health?.tables || { products: false, categories: false, orders: false, members: false }).map(
                  ([table, isReady]) => (
                    <div
                      key={table}
                      className="flex items-center justify-between rounded-xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50/60 dark:bg-neutral-900/40 px-3 py-2 text-xs"
                    >
                      <span className="font-mono text-[11px] text-neutral-700 dark:text-neutral-300">
                        {table}
                      </span>
                      {isReady ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                          <CheckCircle2 className="h-3 w-3" />
                          <span>OK</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-500 font-bold text-[10px]">
                          <XCircle className="h-3 w-3" />
                          <span>Missing</span>
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] text-neutral-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>
                  {health?.timestamp
                    ? new Date(health.timestamp).toLocaleTimeString('id-ID')
                    : 'Baru saja'}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fetchHealth(true)}
                  disabled={loading}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-neutral-950 dark:bg-white text-white dark:text-neutral-950 px-4 py-2 text-xs font-bold uppercase tracking-wider hover:opacity-90 transition active:scale-95 disabled:opacity-50 shadow-sm"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Menguji…' : 'Uji Koneksi Ulang'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
