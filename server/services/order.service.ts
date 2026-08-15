import { createClient } from '@/lib/supabase/server';
import { Order, OrderStatus } from '@/types/database';
import { AppError, NotFoundError } from '@/server/errors/app-error';
import { MOCK_ORDERS } from '@/server/data/mock-data';
import { cookies } from 'next/headers';

export class OrderService {
  private static async isDemoMode(): Promise<boolean> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get('angel_admin_demo')?.value === 'true';
    } catch {
      return false;
    }
  }

  static async getAll(options?: { status?: string; search?: string }): Promise<Order[]> {
    if (await this.isDemoMode()) {
      let list = [...MOCK_ORDERS];
      if (options?.status && options.status !== 'ALL') {
        list = list.filter((o) => o.status === options.status);
      }
      if (options?.search) {
        const s = options.search.toLowerCase();
        list = list.filter(
          (o) =>
            o.id.toLowerCase().includes(s) ||
            o.customers?.name.toLowerCase().includes(s) ||
            o.shipping_name?.toLowerCase().includes(s)
        );
      }
      return list;
    }

    try {
      const supabase = await createClient();
      let query = supabase
        .from('orders')
        .select('*, customers(*), order_items(*)')
        .order('created_at', { ascending: false });

      if (options?.status && options.status !== 'ALL') {
        query = query.eq('status', options.status);
      }

      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 600)
      );

      const { data, error } = await Promise.race([query, timeoutPromise]);

      if (error || !data || data.length === 0) {
        let list = [...MOCK_ORDERS];
        if (options?.status && options.status !== 'ALL') {
          list = list.filter((o) => o.status === options.status);
        }
        return list;
      }

      let results = (data as Order[]) || [];
      if (options?.search) {
        const s = options.search.toLowerCase();
        results = results.filter(
          (o) =>
            o.id.toLowerCase().includes(s) ||
            o.customers?.name.toLowerCase().includes(s) ||
            o.customers?.email.toLowerCase().includes(s) ||
            o.shipping_name?.toLowerCase().includes(s)
        );
      }

      return results;
    } catch (err: any) {
      if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
      return MOCK_ORDERS;
    }
  }

  static async getById(id: string): Promise<Order | null> {
    if (await this.isDemoMode()) {
      return MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[0];
    }

    try {
      const supabase = await createClient();
      const query = supabase
        .from('orders')
        .select('*, customers(*), order_items(*)')
        .eq('id', id)
        .single();

      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 600)
      );

      const { data, error } = await Promise.race([query, timeoutPromise]);
      if (error || !data) return MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[0];
      return data as Order;
    } catch (err: any) {
      if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
      return MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[0];
    }
  }

  static async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const isDemo = await this.isDemoMode();
    if (isDemo) {
      const ord = MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[0];
      ord.status = status;
      return ord;
    }

    const supabase = await createClient();
    const { data, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, customers(*), order_items(*)')
      .single();

    if (error) {
      throw new AppError(error.message, 500);
    }

    if (!data) {
      throw new NotFoundError(`Pesanan dengan ID ${id} tidak ditemukan.`);
    }

    return data as Order;
  }
}
