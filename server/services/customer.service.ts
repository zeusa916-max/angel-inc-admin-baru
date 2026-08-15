import { createClient } from '@/lib/supabase/server';
import { Customer, Order } from '@/types/database';
import { MOCK_CUSTOMERS, MOCK_ORDERS } from '@/server/data/mock-data';
import { cookies } from 'next/headers';

export class CustomerService {
  private static async isDemoMode(): Promise<boolean> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get('angel_admin_demo')?.value === 'true';
    } catch {
      return false;
    }
  }

  static async getAll(search?: string): Promise<Customer[]> {
    if (await this.isDemoMode()) {
      let list = [...MOCK_CUSTOMERS];
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(
          (c) =>
            c.name.toLowerCase().includes(s) ||
            c.email.toLowerCase().includes(s) ||
            (c.phone && c.phone.includes(s))
        );
      }
      return list;
    }

    try {
      const supabase = await createClient();
      const query = supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 600)
      );

      const { data, error } = await Promise.race([query, timeoutPromise]);

      if (error || !data || data.length === 0) {
        return MOCK_CUSTOMERS;
      }

      let results = (data as Customer[]) || [];
      if (search) {
        const s = search.toLowerCase();
        results = results.filter(
          (c) =>
            c.name.toLowerCase().includes(s) ||
            c.email.toLowerCase().includes(s) ||
            (c.phone && c.phone.includes(s))
        );
      }

      return results;
    } catch (err: any) {
      if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
      return MOCK_CUSTOMERS;
    }
  }

  static async getById(id: string): Promise<{ customer: Customer; orders: Order[] } | null> {
    if (await this.isDemoMode()) {
      const customer = MOCK_CUSTOMERS.find((c) => c.id === id) || MOCK_CUSTOMERS[0];
      const orders = MOCK_ORDERS.filter((o) => o.customer_id === customer.id || o.customer_id === id);
      return { customer, orders };
    }

    try {
      const supabase = await createClient();
      const [customerRes, ordersRes] = await Promise.all([
        supabase.from('customers').select('*').eq('id', id).single(),
        supabase
          .from('orders')
          .select('*, order_items(*)')
          .eq('customer_id', id)
          .order('created_at', { ascending: false }),
      ]);

      if (customerRes.error || !customerRes.data) {
        const customer = MOCK_CUSTOMERS.find((c) => c.id === id) || MOCK_CUSTOMERS[0];
        const orders = MOCK_ORDERS.filter((o) => o.customer_id === customer.id);
        return { customer, orders };
      }

      return {
        customer: customerRes.data as Customer,
        orders: (ordersRes.data as Order[]) || [],
      };
    } catch (err: any) {
      if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
      const customer = MOCK_CUSTOMERS.find((c) => c.id === id) || MOCK_CUSTOMERS[0];
      const orders = MOCK_ORDERS.filter((o) => o.customer_id === customer.id);
      return { customer, orders };
    }
  }
}
