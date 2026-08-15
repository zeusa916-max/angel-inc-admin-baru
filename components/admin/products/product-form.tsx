'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import { Category, Product, ProductImage, ProductStatus } from '@/types/database';
import { useToast } from '@/components/ui/toast';
import { useCurrency } from '@/components/providers/currency-provider';
import { createProductAction, updateProductAction } from '@/server/actions/product.actions';
import {
  Upload,
  X,
  Trash2,
  CheckCircle,
  Loader2,
  Sparkles,
  DollarSign,
  Package,
  Layers,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface ProductFormProps {
  categories: Category[];
  product?: Product & { product_images?: ProductImage[] };
}

export default function ProductForm({ categories, product }: ProductFormProps) {
  const router = useRouter();
  const { success, error } = useToast();
  const { formatPrice, currency } = useCurrency();

  const isEdit = Boolean(product);

  // Form Fields
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    description: product?.description || '',
    price: product?.price ? String(product.price) : '',
    discount_price: product?.discount_price ? String(product.discount_price) : '',
    stock: product?.stock !== undefined ? String(product.stock) : '0',
    weight_grams: product?.weight_grams !== undefined ? String(product.weight_grams) : '0',
    category_id: product?.category_id || '',
    status: (product?.status || 'draft') as ProductStatus,
  });

  // Images State
  const [existingImages, setExistingImages] = useState<ProductImage[]>(
    product?.product_images || []
  );
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const [newFiles, setNewFiles] = useState<{ file: File; preview: string }[]>([]);

  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);

    const validFiles: { file: File; preview: string }[] = [];
    for (const file of selectedFiles) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        error('Format file harus JPG, PNG, atau WebP.', 'Format Tidak Sesuai');
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        error(`File ${file.name} melebihi batas 5 MB.`, 'Ukuran Terlalu Besar');
        continue;
      }
      validFiles.push({
        file,
        preview: URL.createObjectURL(file),
      });
    }

    setNewFiles((prev) => [...prev, ...validFiles]);
    e.target.value = '';
  };

  const removeNewFile = (index: number) => {
    setNewFiles((prev) => {
      const target = prev[index];
      if (target?.preview) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((_, i) => i !== index);
    });
  };

  const markExistingImageForDelete = (image: ProductImage) => {
    setImagesToDelete((prev) => [...prev, image.storage_path]);
    setExistingImages((prev) => prev.filter((img) => img.id !== image.id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSaving(true);

    try {
      const priceNum = parseFloat(formData.price) || 0;
      const discountNum = formData.discount_price ? parseFloat(formData.discount_price) : null;

      const payload = {
        name: formData.name.trim(),
        sku: formData.sku.trim().toUpperCase(),
        description: formData.description.trim() || null,
        price: priceNum,
        discount_price: discountNum,
        stock: parseInt(formData.stock, 10) || 0,
        weight_grams: parseInt(formData.weight_grams, 10) || 0,
        category_id: formData.category_id || null,
        status: formData.status,
      };

      let productId = product?.id;

      if (isEdit && productId) {
        const res = await updateProductAction(productId, payload);
        if (!res.success) throw new Error(res.error);
      } else {
        const res = await createProductAction(payload);
        if (!res.success || !res.data) throw new Error(res.error);
        productId = res.data.id;
      }

      // Upload / delete images
      try {
        const supabase = createClient();
        if (imagesToDelete.length > 0) {
          await supabase.storage.from('product-images').remove(imagesToDelete);
          await supabase.from('product_images').delete().in('storage_path', imagesToDelete);
        }

        for (let i = 0; i < newFiles.length; i++) {
          const { file } = newFiles[i];
          const cleanName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
          const storagePath = `${productId}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${cleanName}`;

          const { error: uploadError } = await supabase.storage
            .from('product-images')
            .upload(storagePath, file, { cacheControl: '3600', upsert: false });

          if (uploadError) continue;

          const {
            data: { publicUrl },
          } = supabase.storage.from('product-images').getPublicUrl(storagePath);

          const isFirst = existingImages.length === 0 && i === 0;
          await supabase.from('product_images').insert({
            product_id: productId,
            storage_path: storagePath,
            public_url: publicUrl,
            is_primary: isFirst,
          });
        }
      } catch {
        // Continue gracefully
      }

      success(
        isEdit ? 'Produk berhasil diperbarui!' : 'Produk baru berhasil ditambahkan!',
        'Sukses'
      );
      router.push('/admin/products');
      router.refresh();
    } catch (err: any) {
      const msg = err?.message || 'Terjadi kesalahan saat menyimpan produk.';
      setErrorMessage(msg);
      error(msg, 'Gagal Menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const normalPrice = parseFloat(formData.price) || 0;
  const discPrice = parseFloat(formData.discount_price) || 0;
  const discountPercent =
    normalPrice > 0 && discPrice > 0 && discPrice < normalPrice
      ? Math.round(((normalPrice - discPrice) / normalPrice) * 100)
      : 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-5xl">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Daftar Produk</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-neutral-950 dark:bg-white px-5 py-2.5 text-xs font-medium text-white dark:text-neutral-950 shadow-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Menyimpan…</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-3.5 w-3.5" />
                <span>{isEdit ? 'Perbarui Produk' : 'Simpan Produk'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-4 text-sm text-rose-700 dark:text-rose-300 animate-fade-in">
          {errorMessage}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* General Information Card */}
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-5">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <Package className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                Informasi Utama Produk
              </h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Nama Produk <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Contoh: Angel Silk Essential Shirt"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  SKU (Kode Unik) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.sku}
                  onChange={(e) => handleChange('sku', e.target.value)}
                  placeholder="ANGEL-SHIRT-01"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm font-mono uppercase text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Kategori
                </label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleChange('category_id', e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Deskripsi Lengkap
              </label>
              <textarea
                rows={5}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Tuliskan spesifikasi, material, dan detail keunggulan produk…"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
              />
            </div>
          </div>

          {/* Pricing & Stock Card */}
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-5">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <DollarSign className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                Harga & Inventaris
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Harga Normal (IDR) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.price}
                  onChange={(e) => handleChange('price', e.target.value)}
                  placeholder="250000"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                />
                <p className="mt-1 text-[11px] text-neutral-500 dark:text-neutral-400">
                  Preview: {formatPrice(formData.price || 0)} ({currency})
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Harga Diskon (IDR) <span className="text-neutral-400 font-normal">(Opsional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.discount_price}
                  onChange={(e) => handleChange('discount_price', e.target.value)}
                  placeholder="200000"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                />
                {discountPercent > 0 && (
                  <p className="mt-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                    Hemat {discountPercent}% ({formatPrice(formData.discount_price)})
                  </p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Jumlah Stok
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleChange('stock', e.target.value)}
                  placeholder="50"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                  Berat (Gram)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.weight_grams}
                  onChange={(e) => handleChange('weight_grams', e.target.value)}
                  placeholder="300"
                  className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-4">
            <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <Layers className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
              <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                Status Produk
              </h2>
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1.5">
                Visibilitas & Ketersediaan
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm text-neutral-900 dark:text-white outline-none transition focus:border-neutral-950 dark:focus:border-white font-medium"
              >
                <option value="draft">Draft (Disembunyikan)</option>
                <option value="active">Aktif (Tampil di Katalog)</option>
                <option value="inactive">Nonaktif</option>
                <option value="out_of_stock">Habis (Out of Stock)</option>
              </select>
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-[#141518] p-6 shadow-subtle space-y-5">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Foto Produk
                </h2>
              </div>
              <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {existingImages.length + newFiles.length} foto
              </span>
            </div>

            {existingImages.length > 0 && (
              <div>
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Foto Tersimpan:
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {existingImages.map((img) => (
                    <div
                      key={img.id}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"
                    >
                      <Image
                        src={img.public_url}
                        alt="Product photo"
                        fill
                        className="object-cover transition group-hover:scale-105"
                      />
                      <button
                        type="button"
                        onClick={() => markExistingImageForDelete(img)}
                        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-rose-600/90 text-white shadow-sm hover:bg-rose-700 transition opacity-0 group-hover:opacity-100"
                        title="Hapus foto ini"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {newFiles.length > 0 && (
              <div>
                <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Foto Baru (Siap Diupload):
                </p>
                <div className="grid grid-cols-3 gap-2.5">
                  {newFiles.map((item, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-xl overflow-hidden border border-neutral-300 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900"
                    >
                      <img
                        src={item.preview}
                        alt={`Preview ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewFile(idx)}
                        className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-neutral-900/80 text-white hover:bg-neutral-900 transition"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/70 dark:bg-neutral-900/40 p-6 text-center cursor-pointer transition hover:border-neutral-400 dark:hover:border-neutral-600 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/60"
              >
                <Upload className="h-7 w-7 text-neutral-400 dark:text-neutral-500 mb-2" />
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  Pilih atau Drop Foto Produk
                </span>
                <span className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1">
                  JPG, PNG, atau WebP (Maks. 5 MB)
                </span>
                <input
                  id="image-upload"
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
