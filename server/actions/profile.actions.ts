'use server';

import { revalidatePath } from 'next/cache';
import { getAdmin } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { updateProfileSchema, changePasswordSchema } from '@/server/schemas/profile.schema';
import { ActionResponse } from '@/types/api';

export async function updateAdminProfileAction(data: unknown): Promise<ActionResponse> {
  const admin = await getAdmin();
  if (!admin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan.' };
  }

  const parsed = updateProfileSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data profil tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from('profiles')
      .update({
        full_name: parsed.data.full_name.trim(),
        phone: parsed.data.phone?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', admin.user.id);

    if (error) throw error;

    revalidatePath('/admin');
    revalidatePath('/admin/settings');
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal memperbarui profil admin.' };
  }
}

export async function changeAdminPasswordAction(data: unknown): Promise<ActionResponse> {
  const admin = await getAdmin();
  if (!admin) {
    return { success: false, error: 'Akses ditolak: Hanya admin yang diizinkan.' };
  }

  const parsed = changePasswordSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: 'Data kata sandi tidak valid.',
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  try {
    const supabase = await createClient();

    // Verify old password if provided
    if (parsed.data.old_password && admin.user.email) {
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: admin.user.email,
        password: parsed.data.old_password,
      });

      if (signInErr) {
        return { success: false, error: 'Password lama yang Anda masukkan salah.' };
      }
    }

    const { error: updateErr } = await supabase.auth.updateUser({
      password: parsed.data.new_password,
    });

    if (updateErr) throw updateErr;

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal mengubah kata sandi.' };
  }
}
