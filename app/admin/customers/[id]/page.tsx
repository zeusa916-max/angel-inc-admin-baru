import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CustomerService } from '@/server/services/customer.service';
import { formatDate, formatDateTime, getOrderStatusBadge } from '@/lib/utils';
import { Price } from '@/components/providers/currency-provider';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  ShoppingBag,
  ArrowRight,
  CreditCard,
} from 'lucide-react';

interface CustomerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({
  params,
}: CustomerDetailPageProps) {
  const { id } = await params;
  const result = await CustomerService.getById(id);

  if (!result) {
    notFound();
  }

  const { customer, orders } = result;

  const totalOrders = orders.length;
  const completedOrders = orders.filter((o) => o.status === 'completed');
  const totalSpent = completedOrders.reduce(
    (sum, o) => sum + Number(o.total || 0),
    0
  );

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/customers"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
            {customer.name}
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
            Pelanggan sejak {formatDate(customer.created_at)}
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-5 shadow-subtle">
          <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
            <CreditCard className="h-4 w-4" />
            <span>Total Belanja Selesai</span>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            <Price value={totalSpent} />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-5 shadow-subtle">
          <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
            <ShoppingBag className="h-4 w-4" />
            <span>Total Pesanan</span>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-neutral-900 dark:text-white">
            {totalOrders}
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-5 shadow-subtle">
          <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
            <User className="h-4 w-4" />
            <span>Pesanan Sukses</span>
          </div>
          <div className="mt-2 font-display text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {completedOrders.length}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4 lg:col-span-1">
          <h2 className="text-sm font-semibold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3">
            Informasi Kontak
          </h2>

          <div className="space-y-3 text-xs">
            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Nama Lengkap:</div>
              <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                {customer.name}
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Email:</div>
              <div className="font-medium text-neutral-700 dark:text-neutral-300 mt-0.5 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-neutral-400" />
                <span>{customer.email}</span>
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Nomor Telepon:</div>
              <div className="font-medium text-neutral-700 dark:text-neutral-300 mt-0.5 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-neutral-400" />
                <span>{customer.phone || 'Belum diisi'}</span>
              </div>
            </div>

            <div>
              <div className="text-neutral-400 dark:text-neutral-500">Tanggal Registrasi:</div>
              <div className="font-medium text-neutral-700 dark:text-neutral-300 mt-0.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                <span>{formatDateTime(customer.created_at)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] shadow-subtle lg:col-span-2 overflow-hidden">
          <div className="border-b border-neutral-100 dark:border-neutral-800 p-5">
            <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Riwayat Pesanan Pelanggan
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">ID Pesanan</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Total</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {orders.length > 0 ? (
                  orders.map((o) => {
                    const badge = getOrderStatusBadge(o.status);
                    return (
                      <tr
                        key={o.id}
                        className="transition hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50"
                      >
                        <td className="py-3 px-4 font-mono font-semibold text-neutral-900 dark:text-neutral-200">
                          #{o.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3 px-4 text-neutral-600 dark:text-neutral-400">
                          {formatDate(o.created_at)}
                        </td>
                        <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-white">
                          <Price value={o.total} />
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/admin/orders/${o.id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2 py-1 text-[11px] font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition"
                          >
                            <span>Lihat</span>
                            <ArrowRight className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-10 text-center text-xs text-neutral-400"
                    >
                      Pelanggan ini belum melakukan transaksi pesanan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
