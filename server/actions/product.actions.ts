'use server';

import { revalidatePath } from 'next/cache';
import { getAdmin } from '@/lib/auth';
import { ProductService } from '@/server/services/product.service';
import { productInputSchema, ProductInput } from '@/server/schemas/product.schema';
import { ActionResponse } from '@/types/api';

export async function createProductAction(data: unknown): Promise<ActionResponse> {
  const admin = await getAdmin();
  if (!admin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan.' };
  }

  const parsed = productInputSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data produk tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const product = await ProductService.create(parsed.data);
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    return { success: true, data: product };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal menambahkan produk.' };
  }
}

export async function updateProductAction(id: string, data: unknown): Promise<ActionResponse> {
  const admin = await getAdmin();
  if (!admin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan.' };
  }

  const parsed = productInputSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data produk tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const product = await ProductService.update(id, parsed.data);
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    revalidatePath(`/admin/products/${id}/edit`);
    return { success: true, data: product };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal memperbarui produk.' };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResponse> {
  const admin = await getAdmin();
  if (!admin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan.' };
  }

  try {
    await ProductService.delete(id);
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal menghapus produk.' };
  }
}
