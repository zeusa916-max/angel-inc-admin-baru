'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types/api';

/**
 * Server action to handle admin authentication cleanly from server side.
 */
export async function loginAdminAction(formData: {
  identifier: string;
  password: string;
}): Promise<ActionResponse<{ success: boolean; name: string }>> {
  try {
    const { identifier, password } = formData;
    const cleanId = (identifier || '').trim();
    const lower = cleanId.toLowerCase();
    const cookieStore = await cookies();

    if (!cleanId || !password) {
      return {
        success: false,
        error: 'Username/Email dan kata sandi wajib diisi.',
      };
    }

    // 1. Check local admin / Admin123! credentials
    if (
      (lower === 'admin' || lower === 'admin@angelinc.id') &&
      password === 'Admin123!'
    ) {
      cookieStore.set('angel_admin_demo', 'true', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 hours
      });

      revalidatePath('/admin');
      return {
        success: true,
        data: { success: true, name: 'Angel Administrator' },
        message: 'Selamat datang, Angel Administrator!',
      };
    }

    // 2. Authenticate via Supabase Auth
    try {
      const supabase = await createClient();
      const loginEmail = cleanId.includes('@') ? cleanId : `${cleanId}@angelinc.id`;

      const { data: authData, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: loginEmail,
          password,
        });

      if (signInError || !authData.user) {
        return {
          success: false,
          error: 'Username/Email atau kata sandi yang Anda masukkan salah.',
        };
      }

      // Check role in profiles
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile || profile.role !== 'admin') {
        await supabase.auth.signOut();
        return {
          success: false,
          error: 'Akses ditolak: Akun ini tidak memiliki hak akses administrator.',
        };
      }

      // Clear any legacy demo cookie
      cookieStore.delete('angel_admin_demo');
      revalidatePath('/admin');

      return {
        success: true,
        data: { success: true, name: profile.full_name || 'Admin' },
        message: `Selamat datang kembali, ${profile.full_name || 'Admin'}!`,
      };
    } catch {
      return {
        success: false,
        error: 'Gagal terhubung ke server autentikasi Supabase.',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Terjadi kesalahan sistem saat login.',
    };
  }
}

/**
 * Server action to completely clear admin session & cookies.
 */
export async function logoutAction(): Promise<ActionResponse<{ loggedOut: boolean }>> {
  try {
    const cookieStore = await cookies();

    // 1. Delete all demo cookies
    cookieStore.delete('angel_admin_demo');
    cookieStore.set('angel_admin_demo', '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });

    // 2. Sign out from Supabase and clear auth token cookies
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch {
      // Ignore if offline
    }

    // 3. Clear all potential Supabase cookies from cookie store
    const allCookies = cookieStore.getAll();
    for (const c of allCookies) {
      if (c.name.startsWith('sb-') || c.name.includes('auth')) {
        cookieStore.delete(c.name);
        cookieStore.set(c.name, '', {
          path: '/',
          maxAge: 0,
          expires: new Date(0),
        });
      }
    }

    revalidatePath('/admin');
    revalidatePath('/auth/login/admin');

    return {
      success: true,
      data: { loggedOut: true },
      message: 'Berhasil logout dari sistem.',
    };
  } catch (err: any) {
    console.error('Error during logout:', err);
    return {
      success: false,
      error: err?.message || 'Gagal logout.',
    };
  }
}
