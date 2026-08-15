'use server';

import { revalidatePath } from 'next/cache';
import { getAdmin } from '@/lib/auth';
import { OrderService } from '@/server/services/order.service';
import { updateOrderStatusSchema } from '@/server/schemas/order.schema';
import { ActionResponse } from '@/types/api';

export async function updateOrderStatusAction(data: unknown): Promise<ActionResponse> {
  const admin = await getAdmin();
  if (!admin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan.' };
  }

  const parsed = updateOrderStatusSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data status pesanan tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const order = await OrderService.updateStatus(parsed.data.id, parsed.data.status);
    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath(`/admin/orders/${parsed.data.id}`);
    revalidatePath('/admin/reports');
    return { success: true, data: order };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal memperbarui status pesanan.' };
  }
}
