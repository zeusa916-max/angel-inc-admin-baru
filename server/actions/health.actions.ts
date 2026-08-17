'use server';

import { createClient } from '@/lib/supabase/server';

export interface DatabaseHealthResult {
  status: 'online' | 'warning' | 'error';
  color: 'green' | 'yellow' | 'red';
  mode: 'supabase' | 'mock_fallback' | 'disconnected';
  latencyMs: number;
  message: string;
  urlHost?: string;
  tables: {
    products: boolean;
    categories: boolean;
    orders: boolean;
    members: boolean;
  };
  timestamp: string;
  details?: string;
}

export async function getDatabaseHealthAction(): Promise<DatabaseHealthResult> {
  const timestamp = new Date().toISOString();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // 1. Check if environment credentials exist
  if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
    return {
      status: 'warning',
      color: 'yellow',
      mode: 'mock_fallback',
      latencyMs: 12,
      message: 'Berjalan dalam Mode Mock Fallback (Kredensial Supabase belum dikonfigurasi di .env.local).',
      tables: {
        products: true,
        categories: true,
        orders: true,
        members: true,
      },
      timestamp,
      details: 'Sistem menggunakan in-memory cache cadangan. Data aman untuk keperluan demo/testing.',
    };
  }

  let urlHost = '';
  try {
    const parsed = new URL(supabaseUrl);
    urlHost = parsed.host;
  } catch {
    urlHost = 'Invalid URL';
  }

  const startTime = Date.now();

  try {
    const supabase = await createClient();

    // 2. Perform concurrent table checks with a 4-second timeout promise
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Koneksi ke Supabase timeout (>4000ms)')), 4000)
    );

    const checkQueries = async () => {
      const [prodRes, catRes, ordRes, memRes] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id', { count: 'exact', head: true }),
        supabase.from('members').select('id', { count: 'exact', head: true }),
      ]);

      return {
        products: !prodRes.error,
        categories: !catRes.error,
        orders: !ordRes.error,
        members: !memRes.error,
        prodError: prodRes.error,
      };
    };

    const result = await Promise.race([checkQueries(), timeoutPromise]);
    const latencyMs = Date.now() - startTime;

    const allTablesOk = result.products && result.categories && result.orders && result.members;
    const partialOk = result.products || result.categories || result.orders || result.members;

    if (allTablesOk) {
      if (latencyMs > 2500) {
        return {
          status: 'warning',
          color: 'yellow',
          mode: 'supabase',
          latencyMs,
          urlHost,
          message: `Koneksi Supabase aktif namun latensi tinggi (${latencyMs}ms).`,
          tables: {
            products: result.products,
            categories: result.categories,
            orders: result.orders,
            members: result.members,
          },
          timestamp,
          details: 'Seluruh tabel merespons normal. Kecepatan jaringan atau server Supabase sedang lambat.',
        };
      }

      return {
        status: 'online',
        color: 'green',
        mode: 'supabase',
        latencyMs,
        urlHost,
        message: `Terhubung & Tersinkronisasi Penuh ke Supabase PostgreSQL (${latencyMs}ms).`,
        tables: {
          products: result.products,
          categories: result.categories,
          orders: result.orders,
          members: result.members,
        },
        timestamp,
        details: 'Semua tabel (products, categories, orders, members) aktif dan siap melayani transaksi.',
      };
    }

    if (partialOk) {
      return {
        status: 'warning',
        color: 'yellow',
        mode: 'supabase',
        latencyMs,
        urlHost,
        message: 'Koneksi sebagian: Beberapa skema tabel belum dibuat di Supabase.',
        tables: {
          products: result.products,
          categories: result.categories,
          orders: result.orders,
          members: result.members,
        },
        timestamp,
        details: 'Jalankan skrip sql-setup untuk melengkapi seluruh tabel basis data.',
      };
    }

    // If query returned authentication error
    return {
      status: 'error',
      color: 'red',
      mode: 'disconnected',
      latencyMs,
      urlHost,
      message: `Gagal query ke Supabase: ${result.prodError?.message || 'Autentikasi gagal atau tabel tidak ditemukan.'}`,
      tables: {
        products: false,
        categories: false,
        orders: false,
        members: false,
      },
      timestamp,
      details: 'Periksa API Key atau permission RLS pada project Supabase Anda.',
    };
  } catch (err: any) {
    const latencyMs = Date.now() - startTime;
    return {
      status: 'error',
      color: 'red',
      mode: 'disconnected',
      latencyMs,
      urlHost,
      message: `Koneksi Database Terputus: ${err?.message || 'Network error / host unreachable'}`,
      tables: {
        products: false,
        categories: false,
        orders: false,
        members: false,
      },
      timestamp,
      details: 'Pastikan koneksi internet aktif dan database Supabase tidak dalam status paused.',
    };
  }
}
