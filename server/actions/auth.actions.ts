'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types/api';
import { ActivityLogService } from '@/server/services/activity-log.service';

/**
 * Server action to handle admin authentication cleanly from server side.
 */
export async function loginAdminAction(input: {
  identifier: string;
  password: string;
}): Promise<ActionResponse<{ role: string }>> {
  try {
    const cleanId = (input.identifier || '').trim().toLowerCase();
    const password = input.password;

    if (!cleanId || !password) {
      return {
        success: false,
        error: 'Username/Email dan kata sandi wajib diisi.',
      };
    }

    const cookieStore = await cookies();

    // 1. Check local admin / Admin123! credentials
    if (
      (cleanId === 'admin' || cleanId === 'admin@angelinc.id') &&
      (password === 'Admin123!' || password === 'admin')
    ) {
      cookieStore.set('angel_admin_demo', 'true', {
        path: '/',
        httpOnly: false,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      await ActivityLogService.record({
        actor_type: 'admin',
        identifier: cleanId,
        name: 'Administrator (Demo Session)',
        event_type: 'LOGIN',
      });

      revalidatePath('/admin');
      return {
        success: true,
        data: { role: 'admin' },
        message: 'Login Administrator berhasil.',
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

      await ActivityLogService.record({
        actor_type: 'admin',
        identifier: cleanId,
        name: profile.full_name || 'Administrator',
        event_type: 'LOGIN',
      });

      revalidatePath('/admin');

      return {
        success: true,
        data: { role: profile.role },
        message: `Selamat datang kembali, ${profile.full_name || 'Administrator'}!`,
      };
    } catch {
      // Fallback if network is unreachable
      if (
        (cleanId === 'admin' || cleanId.includes('admin')) &&
        (password === 'Admin123!' || password === 'admin')
      ) {
        cookieStore.set('angel_admin_demo', 'true', {
          path: '/',
          httpOnly: false,
          maxAge: 60 * 60 * 24 * 7,
          sameSite: 'lax',
        });

        await ActivityLogService.record({
          actor_type: 'admin',
          identifier: cleanId,
          name: 'Administrator',
          event_type: 'LOGIN',
        });

        revalidatePath('/admin');
        return {
          success: true,
          message: 'Login Administrator berhasil (Mode Offline).',
          data: { role: 'admin' },
        };
      }
      return {
        success: false,
        error: 'Gagal terhubung ke server autentikasi Supabase.',
      };
    }
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Terjadi kesalahan sistem saat proses login.',
    };
  }
}

/**
 * Server action to completely clear admin session & cookies.
 */
export async function logoutAction(): Promise<ActionResponse<{ loggedOut: boolean }>> {
  try {
    const cookieStore = await cookies();

    // Log admin logout event
    await ActivityLogService.record({
      actor_type: 'admin',
      identifier: 'admin',
      name: 'Administrator',
      event_type: 'LOGOUT',
    });

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
      message: 'Berhasil logout.',
    };
  } catch (err: any) {
    console.error('Error during logout:', err);
    return {
      success: false,
      error: err?.message || 'Gagal logout.',
    };
  }
}
