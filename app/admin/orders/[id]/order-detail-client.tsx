'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Order, OrderStatus } from '@/types/database';
import { formatDateTime, getOrderStatusBadge } from '@/lib/utils';
import { Price } from '@/components/providers/currency-provider';
import { useToast } from '@/components/ui/toast';
import { updateOrderStatusAction } from '@/server/actions/order.actions';
import {
  ArrowLeft,
  ShoppingBag,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  Printer,
} from 'lucide-react';

export default function OrderDetailClientView({
  initialOrder,
}: {
  initialOrder: Order;
}) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [status, setStatus] = useState<OrderStatus>(initialOrder.status);
  const [updating, setUpdating] = useState(false);

  const router = useRouter();
  const { success, error } = useToast();

  const handleUpdateStatus = async () => {
    if (status === order.status) return;

    try {
      setUpdating(true);
      const res = await updateOrderStatusAction({ id: order.id, status });

      if (!res.success) {
        throw new Error(res.error || 'Gagal mengubah status pesanan.');
      }

      setOrder((prev) => ({ ...prev, status }));
      success(`Status pesanan berhasil diubah menjadi "${status}".`);
      router.refresh();
    } catch (err: any) {
      error(err?.message || 'Gagal mengubah status pesanan.');
    } finally {
      setUpdating(false);
    }
  };

  const statusBadge = getOrderStatusBadge(order.status);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/orders"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="font-display text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
                Pesanan #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${statusBadge.className}`}
              >
                {statusBadge.label}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Dibuat pada {formatDateTime(order.created_at)}
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
        >
          <Printer className="h-3.5 w-3.5" />
          <span>Cetak Bukti / Invoice</span>
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <ShoppingBag className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Rincian Produk Dipesan
              </h2>
            </div>

            <div className="divide-y divide-neutral-100 dark:divide-neutral-800 mt-2">
              {order.order_items && order.order_items.length > 0 ? (
                order.order_items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between py-3.5 text-xs"
                  >
                    <div>
                      <div className="font-semibold text-neutral-900 dark:text-white">
                        {item.product_name}
                      </div>
                      <div className="text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {item.quantity} × <Price value={item.unit_price} />
                      </div>
                    </div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                      <Price value={item.subtotal} />
                    </div>
                  </div>
                ))
              ) : (
                <p className="py-6 text-center text-xs text-neutral-400">
                  Tidak ada data item.
                </p>
              )}
            </div>

            <div className="mt-4 border-t border-neutral-100 dark:border-neutral-800 pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Subtotal Produk</span>
                <span><Price value={order.subtotal || 0} /></span>
              </div>
              <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
                <span>Biaya Pengiriman</span>
                <span><Price value={order.shipping_cost || 0} /></span>
              </div>
              <div className="flex justify-between border-t border-neutral-100 dark:border-neutral-800 pt-2 text-sm font-bold text-neutral-900 dark:text-white">
                <span>Total Pembayaran</span>
                <span><Price value={order.total || 0} /></span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <Clock className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Update Status Pesanan
              </h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Status Saat Ini:
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3.5 py-2.5 text-xs font-medium text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
              >
                <option value="pending">Pending (Menunggu Pembayaran)</option>
                <option value="paid">Paid (Sudah Dibayar)</option>
                <option value="processing">Diproses (Packing)</option>
                <option value="shipped">Dikirim (Dalam Perjalanan)</option>
                <option value="completed">Selesai (Pesanan Diterima)</option>
                <option value="cancelled">Dibatalkan</option>
              </select>
            </div>

            <button
              onClick={handleUpdateStatus}
              disabled={updating || status === order.status}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-neutral-950 dark:bg-white py-2.5 text-xs font-medium text-white dark:text-neutral-950 shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-40"
            >
              {updating ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Menyimpan…</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Simpan Perubahan Status</span>
                </>
              )}
            </button>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <User className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Informasi Pembeli
              </h2>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <div className="text-neutral-400 dark:text-neutral-500">Nama Pelanggan:</div>
                <div className="font-semibold text-neutral-900 dark:text-white mt-0.5">
                  {order.customers?.name || order.shipping_name || '—'}
                </div>
              </div>
              <div>
                <div className="text-neutral-400 dark:text-neutral-500">Email:</div>
                <div className="font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
                  {order.customers?.email || '—'}
                </div>
              </div>
              <div>
                <div className="text-neutral-400 dark:text-neutral-500">Nomor Telepon:</div>
                <div className="font-medium text-neutral-700 dark:text-neutral-300 mt-0.5">
                  {order.shipping_phone || order.customers?.phone || '—'}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <MapPin className="h-4 w-4 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Alamat Pengiriman
              </h2>
            </div>

            <div className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {order.shipping_address ? (
                <div>
                  <div className="font-semibold text-neutral-900 dark:text-white mb-1">
                    {order.shipping_name} ({order.shipping_phone})
                  </div>
                  <div>{order.shipping_address}</div>
                </div>
              ) : (
                <p className="text-neutral-400 dark:text-neutral-500">Alamat tidak dicantumkan.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
