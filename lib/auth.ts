import { createClient } from '@/lib/supabase/server';
import { Profile } from '@/types/database';
import { User } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export interface AdminAuth {
  user: User;
  profile: Profile;
}

export async function getAdmin(): Promise<AdminAuth | null> {
  try {
    const cookieStore = await cookies();
    const isDemoCookie = cookieStore.get('angel_admin_demo')?.value === 'true';

    // Support admin / Admin123! session fallback for local testing
    if (isDemoCookie) {
      return {
        user: {
          id: 'admin-local-id',
          email: 'admin@angelinc.id',
          app_metadata: {},
          user_metadata: { full_name: 'Angel Administrator' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
        } as unknown as User,
        profile: {
          id: 'admin-local-id',
          full_name: 'Angel Administrator',
          phone: '+62 812-3456-7890',
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      };
    }

    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return null;
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile || profile.role !== 'admin') {
      return null;
    }

    return {
      user,
      profile: profile as Profile,
    };
  } catch (error: any) {
    if (error?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw error;
    }
    console.error('Error verifying admin session:', error);
    return null;
  }
}
