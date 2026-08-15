'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/database';
import { formatDate, getProductStatusBadge } from '@/lib/utils';
import { Price } from '@/components/providers/currency-provider';
import DeleteProduct from '@/components/admin/products/delete-product';
import {
  Search,
  Package,
  Edit3,
  ImageIcon,
} from 'lucide-react';

interface ProductsClientViewProps {
  initialProducts: Product[];
  categories: { id: string; name: string }[];
}

export default function ProductsClientView({
  initialProducts,
  categories,
}: ProductsClientViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchTerm.toLowerCase());

      const matchCategory =
        selectedCategory === 'ALL' || p.category_id === selectedCategory;

      const matchStatus =
        selectedStatus === 'ALL' || p.status === selectedStatus;

      return matchSearch && matchCategory && matchStatus;
    });
  }, [initialProducts, searchTerm, selectedCategory, selectedStatus]);

  return (
    <div className="space-y-4">
      {/* Search & Filters Toolbar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-4 shadow-subtle sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari berdasarkan nama atau SKU…"
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 py-2.5 pl-10 pr-4 text-xs text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white focus:bg-white dark:focus:bg-neutral-900"
          />
        </div>

        <div className="flex items-center gap-2.5">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 outline-none transition focus:border-neutral-950 dark:focus:border-white"
          >
            <option value="ALL">Semua Kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-3 py-2.5 text-xs text-neutral-700 dark:text-neutral-300 outline-none transition focus:border-neutral-950 dark:focus:border-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="draft">Draft</option>
            <option value="inactive">Nonaktif</option>
            <option value="out_of_stock">Habis</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-hidden rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] shadow-subtle">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-xs">
            <thead className="border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-900/60 text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Produk</th>
                <th className="py-3.5 px-4">SKU</th>
                <th className="py-3.5 px-4">Kategori</th>
                <th className="py-3.5 px-4">Harga</th>
                <th className="py-3.5 px-4">Stok</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const statusBadge = getProductStatusBadge(product.status);
                  const primaryImage =
                    product.product_images?.find((img) => img.is_primary) ||
                    product.product_images?.[0];

                  return (
                    <tr
                      key={product.id}
                      className="transition-colors hover:bg-neutral-50/70 dark:hover:bg-neutral-900/50"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-800">
                            {primaryImage?.public_url ? (
                              <Image
                                src={primaryImage.public_url}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-neutral-400 dark:text-neutral-500">
                                <ImageIcon className="h-4 w-4" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-neutral-900 dark:text-white line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-0.5">
                              Dibuat: {formatDate(product.created_at)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-medium text-neutral-600 dark:text-neutral-400">
                        {product.sku}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-600 dark:text-neutral-400">
                        {product.categories?.name || '—'}
                      </td>

                      <td className="py-3.5 px-4">
                        {product.discount_price ? (
                          <div>
                            <div className="font-semibold text-emerald-600 dark:text-emerald-400">
                              <Price value={product.discount_price} />
                            </div>
                            <div className="text-[10px] text-neutral-400 line-through">
                              <Price value={product.price} />
                            </div>
                          </div>
                        ) : (
                          <div className="font-semibold text-neutral-900 dark:text-white">
                            <Price value={product.price} />
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center rounded-lg px-2 py-0.5 text-[11px] font-medium ${
                            product.stock <= 5
                              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 font-semibold'
                              : 'text-neutral-700 dark:text-neutral-300'
                          }`}
                        >
                          {product.stock} pcs
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/products/${product.id}/edit`}
                            className="inline-flex items-center gap-1 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-2.5 py-1.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 hover:text-neutral-900 dark:hover:text-white transition"
                          >
                            <Edit3 className="h-3 w-3" />
                            <span>Edit</span>
                          </Link>
                          <DeleteProduct id={product.id} name={product.name} />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
                      <Package className="h-6 w-6" />
                    </div>
                    <p className="mt-3 text-sm font-medium text-neutral-900 dark:text-white">
                      Tidak ada produk ditemukan
                    </p>
                    <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                      Coba ganti filter atau tambahkan produk baru.
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
