import { CategoryService } from '@/server/services/category.service';
import ProductForm from '@/components/admin/products/product-form';

export default async function NewProductPage() {
  const categories = await CategoryService.getAll({ activeOnly: true });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase">
          Katalog Produk
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-neutral-900">
          Tambah Produk Baru
        </h1>
      </div>

      <ProductForm categories={categories} />
    </div>
  );
}
