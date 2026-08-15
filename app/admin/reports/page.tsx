import { AnalyticsService } from '@/server/services/analytics.service';
import { Price } from '@/components/providers/currency-provider';
import {
  TrendingUp,
  ShoppingBag,
  DollarSign,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export default async function ReportsPage() {
  const data = await AnalyticsService.getReportsData();
  const {
    orders,
    completedOrders,
    paidOrProcessingOrders,
    pendingOrders,
    cancelledOrders,
    totalRevenue,
    potentialRevenue,
    avgOrderValue,
    topProducts,
  } = data;

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase">
          Analitik & Laporan
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Laporan Kinerja Toko
        </h1>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
          Ringkasan pendapatan, performa penjualan produk, dan statistik transaksi
        </p>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Pendapatan Selesai
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            <Price value={totalRevenue} />
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <CheckCircle2 className="h-3 w-3" />
            <span>Dari {completedOrders.length} pesanan sukses</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Pendapatan Diproses/Kirim
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            <Price value={potentialRevenue} />
          </div>
          <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            {paidOrProcessingOrders.length} pesanan sedang berjalan
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Rata-rata Nilai Pesanan (AOV)
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            <Price value={avgOrderValue} />
          </div>
          <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            Per transaksi pesanan selesai
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Semua Pesanan
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            {orders.length}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            Sepanjang masa operasional
          </div>
        </div>
      </div>

      {/* Breakdown & Top Selling Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
            Distribusi Status Pesanan
          </h2>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Selesai / Delivered
                </span>
                <span>
                  {completedOrders.length} (
                  {orders.length > 0
                    ? Math.round((completedOrders.length / orders.length) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{
                    width: `${
                      orders.length > 0
                        ? (completedOrders.length / orders.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Paid / Diproses / Dikirim
                </span>
                <span>
                  {paidOrProcessingOrders.length} (
                  {orders.length > 0
                    ? Math.round(
                        (paidOrProcessingOrders.length / orders.length) * 100
                      )
                    : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full"
                  style={{
                    width: `${
                      orders.length > 0
                        ? (paidOrProcessingOrders.length / orders.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500" />
                  Pending Pembayaran
                </span>
                <span>
                  {pendingOrders.length} (
                  {orders.length > 0
                    ? Math.round((pendingOrders.length / orders.length) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{
                    width: `${
                      orders.length > 0
                        ? (pendingOrders.length / orders.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500" />
                  Dibatalkan
                </span>
                <span>
                  {cancelledOrders.length} (
                  {orders.length > 0
                    ? Math.round((cancelledOrders.length / orders.length) * 100)
                    : 0}
                  %)
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
                <div
                  className="h-full bg-rose-500 rounded-full"
                  style={{
                    width: `${
                      orders.length > 0
                        ? (cancelledOrders.length / orders.length) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
            Produk Paling Banyak Terjual
          </h2>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {topProducts.length > 0 ? (
              topProducts.map((p, idx) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between py-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-700 dark:text-neutral-300">
                      #{idx + 1}
                    </span>
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {p.name}
                      </div>
                      <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                        Terjual: {p.qty} pcs
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold text-neutral-900 dark:text-white">
                    <Price value={p.revenue} />
                  </div>
                </div>
              ))
            ) : (
              <p className="py-6 text-center text-xs text-neutral-400">
                Belum ada data penjualan produk.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
