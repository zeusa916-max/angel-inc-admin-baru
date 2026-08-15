'use server';

import { revalidatePath } from 'next/cache';
import { getAdmin } from '@/lib/auth';
import { CategoryService } from '@/server/services/category.service';
import { categoryInputSchema } from '@/server/schemas/category.schema';
import { ActionResponse } from '@/types/api';

export async function createCategoryAction(data: unknown): Promise<ActionResponse> {
  const admin = await getAdmin();
  if (!admin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan.' };
  }

  const parsed = categoryInputSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data kategori tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const category = await CategoryService.create(parsed.data);
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    return { success: true, data: category };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal menambahkan kategori.' };
  }
}

export async function updateCategoryAction(id: string, data: unknown): Promise<ActionResponse> {
  const admin = await getAdmin();
  if (!admin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan.' };
  }

  const parsed = categoryInputSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data kategori tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const category = await CategoryService.update(id, parsed.data);
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    return { success: true, data: category };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal memperbarui kategori.' };
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResponse> {
  const admin = await getAdmin();
  if (!admin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan.' };
  }

  try {
    await CategoryService.delete(id);
    revalidatePath('/admin/categories');
    revalidatePath('/admin/products');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal menghapus kategori.' };
  }
}
