import { notFound } from 'next/navigation';
import { ProductService } from '@/server/services/product.service';
import { CategoryService } from '@/server/services/category.service';
import ProductForm from '@/components/admin/products/product-form';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    ProductService.getById(id),
    CategoryService.getAll({ activeOnly: true }),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.2em] text-neutral-400 uppercase">
          Katalog Produk / Edit
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight text-neutral-900">
          Edit Produk: {product.name}
        </h1>
      </div>

      <ProductForm categories={categories} product={product} />
    </div>
  );
}
