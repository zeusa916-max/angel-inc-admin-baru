'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Order } from '@/types/database';
import { formatDate, getOrderStatusBadge } from '@/lib/utils';
import { Price } from '@/components/providers/currency-provider';
import {
  Search,
  ShoppingBag,
  ArrowRight,
} from 'lucide-react';

interface OrdersClientViewProps {
  initialOrders: Order[];
}

export default function OrdersClientView({
  initialOrders,
}: OrdersClientViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredOrders = useMemo(() => {
    return initialOrders.filter((order) => {
      const matchSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customers?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.customers?.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order.shipping_name || '').toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus =
        selectedStatus === 'ALL' || order.status === selectedStatus;

      return matchSearch && matchStatus;
    });
  }, [initialOrders, searchTerm, selectedStatus]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-4 shadow-subtle sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari ID pesanan, nama pelanggan, atau alamat…"
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 py-2.5 pl-10 pr-4 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white focus:bg-white dark:focus:bg-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 outline-none transition focus:border-neutral-950 dark:focus:border-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="processing">Diproses</option>
            <option value="shipped">Dikirim</option>
            <option value="completed">Selesai</option>
            <option value="cancelled">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">ID Pesanan</th>
                <th className="py-3.5 px-4">Pelanggan</th>
                <th className="py-3.5 px-4">Tanggal</th>
                <th className="py-3.5 px-4">Jumlah Item</th>
                <th className="py-3.5 px-4">Total</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const statusBadge = getOrderStatusBadge(order.status);
                  const itemCount =
                    order.order_items?.reduce(
                      (acc, cur) => acc + cur.quantity,
                      0
                    ) || 0;

                  return (
                    <tr
                      key={order.id}
                      className="transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50"
                    >
                      <td className="py-3.5 px-4 font-mono font-semibold text-neutral-900 dark:text-neutral-200">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-neutral-900 dark:text-white">
                          {order.customers?.name ||
                            order.shipping_name ||
                            'Guest'}
                        </div>
                        <div className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          {order.customers?.email || order.shipping_phone || '—'}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                        {itemCount > 0 ? `${itemCount} item` : '—'}
                      </td>

                      <td className="py-3.5 px-4 font-bold text-neutral-900 dark:text-white">
                        <Price value={order.total} />
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-950 hover:text-white dark:hover:bg-white dark:hover:text-neutral-950 transition"
                        >
                          <span>Rincian</span>
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-neutral-900 dark:text-white">
                      Tidak ada data pesanan
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Coba ubah kata kunci pencarian atau filter status.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
