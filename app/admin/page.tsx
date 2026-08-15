import Link from 'next/link';
import { getAdmin } from '@/lib/auth';
import { AnalyticsService } from '@/server/services/analytics.service';
import { formatDate, getOrderStatusBadge } from '@/lib/utils';
import { Price } from '@/components/providers/currency-provider';
import PnLChart from '@/components/admin/dashboard/pnl-chart';
import RecreateDummyModal from '@/components/admin/recreate-dummy-modal';
import ClearDummyModal from '@/components/admin/clear-dummy-modal';
import {
  Package,
  Tags,
  ShoppingBag,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Plus,
  TrendingUp,
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const adminAuth = await getAdmin();
  const summary = await AnalyticsService.getDashboardSummary();

  const {
    totalProducts,
    totalCategories,
    totalOrders,
    completedRevenue,
    recentOrders,
    lowStockProducts,
  } = summary;

  return (
    <div className="space-y-8">
      {/* Welcome & Top Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase">
            ANGEL INC. / ADMINISTRATOR
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-4xl">
            Selamat Datang, {adminAuth?.profile.full_name || 'Admin'}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Berikut ringkasan performa penjualan, laba rugi (PnL), dan aktivitas katalog toko Anda.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <RecreateDummyModal buttonVariant="compact" />
          <ClearDummyModal buttonVariant="compact" />
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 dark:bg-white px-4 py-2 text-xs font-semibold text-white dark:text-neutral-950 shadow-sm transition hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-5 shadow-subtle transition hover:shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Revenue Selesai
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            <Price value={completedRevenue} />
          </div>
          <div className="mt-1 flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            <TrendingUp className="h-3 w-3" />
            <span>Penjualan Sukses</span>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-5 shadow-subtle transition hover:shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Produk Katalog
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            {totalProducts}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            {totalCategories} kategori aktif
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-5 shadow-subtle transition hover:shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Total Semua Pesanan
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <ShoppingBag className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            {totalOrders}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            Semua status pesanan
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-5 shadow-subtle transition hover:shadow-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
              Kategori Produk
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Tags className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            {totalCategories}
          </div>
          <div className="mt-1 text-[11px] text-neutral-400 dark:text-neutral-500">
            Pengelompokan etalase
          </div>
        </div>
      </div>

      {/* PnL (Profit & Loss) Chart Component */}
      <PnLChart completedRevenue={completedRevenue} />

      {/* Low Stock Alert */}
      {lowStockProducts.length > 0 && (
        <div className="rounded-2xl border border-amber-200/80 dark:border-amber-900/60 bg-amber-50/70 dark:bg-amber-950/20 p-5 shadow-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-semibold text-amber-900 dark:text-amber-300 uppercase tracking-wide">
                Peringatan Stok Menipis ({lowStockProducts.length} produk)
              </h3>
            </div>
            <Link
              href="/admin/products"
              className="text-xs font-semibold text-amber-800 dark:text-amber-400 hover:underline"
            >
              Kelola Stok &rarr;
            </Link>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between rounded-xl bg-white/80 dark:bg-neutral-900/80 p-3 border border-amber-200/60 dark:border-amber-900/40 text-xs"
              >
                <div className="min-w-0 pr-2">
                  <div className="truncate font-medium text-neutral-900 dark:text-neutral-100">
                    {p.name}
                  </div>
                  <div className="text-[10px] font-mono text-neutral-500 dark:text-neutral-400">
                    {p.sku}
                  </div>
                </div>
                <span className="shrink-0 rounded-lg bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 font-bold text-rose-700 dark:text-rose-400">
                  {p.stock} pcs
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Orders & Quick Controls */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] shadow-subtle overflow-hidden">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 p-5">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Pesanan Terbaru
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-1 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition"
            >
              <span>Lihat Semua</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Pelanggan</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {recentOrders.length > 0 ? (
                  recentOrders.map((order) => {
                    const statusBadge = getOrderStatusBadge(order.status);
                    return (
                      <tr
                        key={order.id}
                        className="transition hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50"
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-neutral-900 dark:text-neutral-200">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-neutral-900 dark:text-neutral-200">
                            {order.customers?.name ||
                              order.shipping_name ||
                              'Guest'}
                          </div>
                          <div className="text-[10px] text-neutral-400 dark:text-neutral-500">
                            {formatDate(order.created_at)}
                          </div>
                        </td>
                        <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                          <Price value={order.total} />
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${statusBadge.className}`}
                          >
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-700 px-2 py-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                          >
                            <span>Detail</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-8 text-center text-xs text-neutral-400"
                    >
                      Belum ada transaksi pesanan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions & Shop Info */}
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <Package className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Pusat Kontrol Cepat
              </h2>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <Link
                href="/admin/products/new"
                className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 transition hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 group"
              >
                <div>
                  <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-white dark:group-hover:text-neutral-950">
                    Tambah Produk Baru
                  </div>
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    Unggah produk & foto
                  </div>
                </div>
                <Plus className="h-4 w-4 text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-950" />
              </Link>

              <Link
                href="/admin/categories"
                className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 transition hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 group"
              >
                <div>
                  <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-white dark:group-hover:text-neutral-950">
                    Kelola Kategori
                  </div>
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    Struktur etalase
                  </div>
                </div>
                <Tags className="h-4 w-4 text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-950" />
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 transition hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 group"
              >
                <div>
                  <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-white dark:group-hover:text-neutral-950">
                    Daftar Pesanan
                  </div>
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    Proses order & cetak
                  </div>
                </div>
                <ShoppingBag className="h-4 w-4 text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-950" />
              </Link>

              <Link
                href="/admin/reports"
                className="flex items-center justify-between rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 p-4 transition hover:bg-neutral-900 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 group"
              >
                <div>
                  <div className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 group-hover:text-white dark:group-hover:text-neutral-950">
                    Laporan Lengkap
                  </div>
                  <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                    Grafik & analitik
                  </div>
                </div>
                <TrendingUp className="h-4 w-4 text-neutral-400 group-hover:text-white dark:group-hover:text-neutral-950" />
              </Link>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-neutral-950 dark:bg-[#1a1b1e] border border-neutral-800 p-4 text-white text-xs flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">ANGEL INC. Store Status</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Sistem siap menerima pesanan</div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-1 text-[10px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Online
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
