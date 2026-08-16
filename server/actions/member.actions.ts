'use server';

import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import { ActivityLogService } from '@/server/services/activity-log.service';
import { OrderService } from '@/server/services/order.service';
import { Order } from '@/types/database';

export interface MemberSession {
  phone: string;
  name: string;
  email?: string;
  address?: string;
  memberId: string;
  memberTier: 'Paradise Member' | 'Silver' | 'Gold' | 'VIP';
  discountPercent: number;
  ordersCount: number;
}

const COOKIE_NAME = 'angel_member_session';

export async function requestPhoneOtpAction({ phone }: { phone: string }) {
  try {
    const cleanPhone = phone.trim().replace(/[^0-9+]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      return { success: false, error: 'Nomor telepon tidak valid.' };
    }

    // In demo / instant mode, we use realistic OTP code "1234"
    const otpCode = '1234';

    await ActivityLogService.record({
      actor_type: 'member',
      identifier: cleanPhone,
      event_type: 'OTP_REQUEST',
      metadata: { otpSent: true },
    });

    return {
      success: true,
      message: `Kode OTP verifikasi telah dikirim ke ${cleanPhone}. (Gunakan kode OTP: 1234)`,
      data: {
        phone: cleanPhone,
        otpDemo: otpCode,
      },
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Gagal mengirim kode OTP.',
    };
  }
}

export async function verifyPhoneOtpAction({
  phone,
  otp,
  name,
  address,
}: {
  phone: string;
  otp: string;
  name?: string;
  address?: string;
}) {
  try {
    const cleanPhone = phone.trim().replace(/[^0-9+]/g, '');
    const cleanOtp = otp.trim();

    if (!cleanPhone) {
      return { success: false, error: 'Nomor telepon wajib diisi.' };
    }

    // Accepts 1234 or any 4 digit code for seamless frictionless demo
    if (cleanOtp !== '1234' && cleanOtp.length !== 4) {
      return { success: false, error: 'Kode OTP salah. Masukkan kode 1234.' };
    }

    const cookieStore = await cookies();

    // Check or create customer in Supabase
    let memberName = name?.trim() || `Member ${cleanPhone.slice(-4)}`;
    let memberAddress = address?.trim() || '';
    let memberId = `MBR-${cleanPhone.slice(-4)}-${Math.floor(100 + Math.random() * 900)}`;

    try {
      const supabase = await createClient();
      const { data: customer } = await supabase
        .from('customers')
        .select('*')
        .eq('phone', cleanPhone)
        .maybeSingle();

      if (customer) {
        memberName = customer.name || memberName;
        memberId = `MBR-${customer.id.slice(0, 4).toUpperCase()}`;
      } else {
        await supabase.from('customers').insert({
          name: memberName,
          phone: cleanPhone,
          email: `${cleanPhone.replace(/[^0-9]/g, '')}@member.angelinc.id`,
        });
      }
    } catch {
      // Fallback
    }

    const session: MemberSession = {
      phone: cleanPhone,
      name: memberName,
      email: `${cleanPhone.replace(/[^0-9]/g, '')}@member.angelinc.id`,
      address: memberAddress,
      memberId,
      memberTier: 'Paradise Member',
      discountPercent: 5,
      ordersCount: 2,
    };

    cookieStore.set(COOKIE_NAME, JSON.stringify(session), {
      path: '/',
      httpOnly: false,
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });

    await ActivityLogService.record({
      actor_type: 'member',
      identifier: cleanPhone,
      name: memberName,
      event_type: 'LOGIN',
      metadata: { memberTier: session.memberTier },
    });

    return {
      success: true,
      data: session,
      message: `Selamat datang kembali, ${memberName}!`,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Gagal memverifikasi OTP.',
    };
  }
}

export async function getMemberSessionAction(): Promise<{ success: boolean; data: MemberSession | null }> {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(COOKIE_NAME)?.value;
    if (!raw) {
      return { success: true, data: null };
    }
    const session = JSON.parse(raw) as MemberSession;
    return { success: true, data: session };
  } catch {
    return { success: true, data: null };
  }
}

export async function memberLogoutAction() {
  try {
    const cookieStore = await cookies();
    const raw = cookieStore.get(COOKIE_NAME)?.value;
    if (raw) {
      try {
        const session = JSON.parse(raw) as MemberSession;
        await ActivityLogService.record({
          actor_type: 'member',
          identifier: session.phone,
          name: session.name,
          event_type: 'LOGOUT',
        });
      } catch {
        // Ignore JSON error
      }
    }

    cookieStore.delete(COOKIE_NAME);
    cookieStore.set(COOKIE_NAME, '', {
      path: '/',
      maxAge: 0,
      expires: new Date(0),
    });
    return { success: true, message: 'Berhasil logout member.' };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Gagal logout member.' };
  }
}

/**
 * Get all order history for the current member
 */
export async function getMemberOrdersAction(): Promise<{ success: boolean; data: Order[] }> {
  try {
    const sessionRes = await getMemberSessionAction();
    if (!sessionRes.data) {
      return { success: true, data: [] };
    }

    const phone = sessionRes.data.phone;
    const allOrders = await OrderService.getAll();
    const memberOrders = allOrders.filter(
      (o) =>
        o.shipping_phone === phone ||
        o.customers?.phone === phone ||
        (sessionRes.data?.email && o.customers?.email === sessionRes.data.email)
    );

    return { success: true, data: memberOrders };
  } catch {
    return { success: true, data: [] };
  }
}

/**
 * Get activity logs for the current member
 */
export async function getMemberActivityLogsAction() {
  try {
    const sessionRes = await getMemberSessionAction();
    if (!sessionRes.data) {
      return { success: true, data: [] };
    }
    const logs = await ActivityLogService.getLogs({
      identifier: sessionRes.data.phone,
      actor_type: 'member',
      limit: 20,
    });
    return { success: true, data: logs };
  } catch {
    return { success: true, data: [] };
  }
}

/**
 * Get all activity logs for Administrator
 */
export async function getAllActivityLogsAction() {
  try {
    const logs = await ActivityLogService.getLogs({ limit: 100 });
    return { success: true, data: logs };
  } catch {
    return { success: true, data: [] };
  }
}
