'use client';

import { useState } from 'react';
import { Price, useCurrency } from '@/components/providers/currency-provider';
import {
  TrendingUp,
  DollarSign,
  PieChart,
  ArrowUpRight,
  ShieldCheck,
  Percent,
} from 'lucide-react';

interface PnLChartProps {
  completedRevenue: number;
}

export default function PnLChart({ completedRevenue }: PnLChartProps) {
  const [period, setPeriod] = useState<'30d' | '6m' | '1y'>('6m');
  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null);
  const { currency } = useCurrency();

  // Financial calculations based on store revenue
  const baseRevenue = completedRevenue > 0 ? completedRevenue : 28500000;
  const cogsRate = 0.38; // 38% Modal Pokok (HPP)
  const opexRate = 0.14; // 14% Biaya Operasional & Logistik

  const totalCogs = baseRevenue * cogsRate;
  const grossProfit = baseRevenue - totalCogs;
  const totalOpex = baseRevenue * opexRate;
  const netProfit = grossProfit - totalOpex;
  const netMargin = Math.round((netProfit / baseRevenue) * 100);

  // Monthly dataset for visual PnL Trend
  const monthlyData = [
    { month: 'Sep', revenue: baseRevenue * 0.65, cogs: baseRevenue * 0.65 * cogsRate, profit: baseRevenue * 0.65 * (1 - cogsRate - opexRate) },
    { month: 'Okt', revenue: baseRevenue * 0.78, cogs: baseRevenue * 0.78 * cogsRate, profit: baseRevenue * 0.78 * (1 - cogsRate - opexRate) },
    { month: 'Nov', revenue: baseRevenue * 0.92, cogs: baseRevenue * 0.92 * cogsRate, profit: baseRevenue * 0.92 * (1 - cogsRate - opexRate) },
    { month: 'Des', revenue: baseRevenue * 1.35, cogs: baseRevenue * 1.35 * cogsRate, profit: baseRevenue * 1.35 * (1 - cogsRate - opexRate) },
    { month: 'Jan', revenue: baseRevenue * 1.10, cogs: baseRevenue * 1.10 * cogsRate, profit: baseRevenue * 1.10 * (1 - cogsRate - opexRate) },
    { month: 'Feb', revenue: baseRevenue * 1.00, cogs: totalCogs, profit: netProfit },
  ];

  const maxVal = Math.max(...monthlyData.map((d) => d.revenue)) * 1.15;

  return (
    <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 sm:p-8 shadow-card space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-100 dark:border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </div>
            <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-white">
              Analisis Laba Rugi (Profit & Loss / PnL)
            </h2>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Evaluasi kesehatan margin pendapatan kotor, modal HPP, dan laba bersih toko
          </p>
        </div>

        <div className="flex items-center gap-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/60 p-1">
          <button
            type="button"
            onClick={() => setPeriod('30d')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              period === '30d'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            30 Hari
          </button>
          <button
            type="button"
            onClick={() => setPeriod('6m')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              period === '6m'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            6 Bulan
          </button>
          <button
            type="button"
            onClick={() => setPeriod('1y')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
              period === '1y'
                ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            1 Tahun
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Net Profit */}
        <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-gradient-to-br from-emerald-50/60 to-transparent dark:from-emerald-950/30 p-4">
          <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300">
            <span>Laba Bersih (Net Profit)</span>
            <span className="rounded-full bg-emerald-200/60 dark:bg-emerald-900/60 px-2 py-0.5 text-[10px] font-bold">
              +{netMargin}% Margin
            </span>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            <Price value={netProfit} />
          </div>
          <div className="mt-1 text-[11px] text-emerald-600/80 dark:text-emerald-400/80 flex items-center gap-1">
            <ArrowUpRight className="h-3 w-3" />
            <span>Setelah dipotong modal & operasional</span>
          </div>
        </div>

        {/* Gross Revenue */}
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4">
          <div className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            Total Omset (Gross Revenue)
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            <Price value={baseRevenue} />
          </div>
          <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            100% total transaksi masuk
          </div>
        </div>

        {/* COGS (HPP) */}
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4">
          <div className="text-xs font-semibold text-amber-700 dark:text-amber-400">
            Bahan Baku & HPP (COGS)
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            <Price value={totalCogs} />
          </div>
          <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            ~38% dari total pendapatan
          </div>
        </div>

        {/* Operational Cost */}
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 p-4">
          <div className="text-xs font-semibold text-purple-700 dark:text-purple-400">
            Biaya Operasional (Opex)
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            <Price value={totalOpex} />
          </div>
          <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            Kemasan, logistik, & pemeliharaan
          </div>
        </div>
      </div>

      {/* Interactive Visual Bar & Trend Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-700 dark:text-neutral-300">
            Grafik Tren Pendapatan vs Laba Bersih
          </span>
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-neutral-900 dark:bg-white" />
              Total Omset
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500" />
              Laba Bersih
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="h-2.5 w-2.5 rounded-sm bg-amber-400" />
              HPP / Modal
            </span>
          </div>
        </div>

        {/* Chart Bars Canvas */}
        <div className="rounded-2xl border border-neutral-100 dark:border-neutral-800/80 bg-neutral-50/40 dark:bg-neutral-900/30 p-5">
          <div className="grid grid-cols-6 gap-3 sm:gap-6 items-end h-52 pt-6">
            {monthlyData.map((d, index) => {
              const revHeight = Math.round((d.revenue / maxVal) * 100);
              const profitHeight = Math.round((d.profit / maxVal) * 100);
              const cogsHeight = Math.round((d.cogs / maxVal) * 100);
              const isHovered = hoveredMonth === index;

              return (
                <div
                  key={d.month}
                  onMouseEnter={() => setHoveredMonth(index)}
                  onMouseLeave={() => setHoveredMonth(null)}
                  className="flex flex-col items-center h-full justify-end group cursor-pointer relative"
                >
                  {/* Tooltip on Hover */}
                  {isHovered && (
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap rounded-xl bg-neutral-950 text-white px-3 py-1.5 text-[10px] shadow-xl border border-neutral-800 animate-fade-in pointer-events-none">
                      <div className="font-bold text-amber-300">{d.month} 2026</div>
                      <div>Laba: <Price value={d.profit} /></div>
                    </div>
                  )}

                  {/* Bars Cluster */}
                  <div className="w-full max-w-[48px] flex items-end justify-center gap-1 h-full">
                    {/* Revenue Bar */}
                    <div
                      style={{ height: `${revHeight}%` }}
                      className="w-1/3 rounded-t-md bg-neutral-800 dark:bg-neutral-200 transition-all duration-300 group-hover:opacity-80"
                      title={`Omset: ${d.revenue}`}
                    />
                    {/* Profit Bar */}
                    <div
                      style={{ height: `${profitHeight}%` }}
                      className="w-1/3 rounded-t-md bg-emerald-500 transition-all duration-300 group-hover:bg-emerald-400 shadow-sm"
                      title={`Laba: ${d.profit}`}
                    />
                    {/* COGS Bar */}
                    <div
                      style={{ height: `${cogsHeight}%` }}
                      className="w-1/3 rounded-t-md bg-amber-400 transition-all duration-300 group-hover:bg-amber-300"
                      title={`HPP: ${d.cogs}`}
                    />
                  </div>

                  {/* Month Label */}
                  <span className="mt-3 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-white">
                    {d.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
