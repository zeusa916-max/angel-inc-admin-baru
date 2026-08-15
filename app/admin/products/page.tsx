import Link from 'next/link';
import { ProductService } from '@/server/services/product.service';
import { CategoryService } from '@/server/services/category.service';
import { Plus } from 'lucide-react';
import ProductsClientView from './products-client';
import ClearDummyModal from '@/components/admin/clear-dummy-modal';
import RecreateDummyModal from '@/components/admin/recreate-dummy-modal';

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    ProductService.getAll(),
    CategoryService.getAll({ activeOnly: true }),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 dark:text-neutral-500 uppercase">
            Manajemen Katalog
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-neutral-900 dark:text-white">
            Daftar Produk
          </h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Total {products.length} produk terdaftar dalam katalog
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <RecreateDummyModal />
          <ClearDummyModal />
          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-950 dark:bg-white px-4 py-2.5 text-xs font-semibold text-white dark:text-neutral-950 shadow-sm transition hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Produk</span>
          </Link>
        </div>
      </div>

      <ProductsClientView initialProducts={products} categories={categories} />
    </div>
  );
}
