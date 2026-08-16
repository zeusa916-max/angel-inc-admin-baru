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

  static async create(payload: {
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    shippingAddress: string;
    shippingCity?: string;
    shippingCourier?: string;
    shippingCost?: number;
    paymentMethod?: string;
    notes?: string;
    items: {
      productId?: string;
      name: string;
      quantity: number;
      price: number;
    }[];
  }): Promise<Order> {
    const isDemo = await this.isDemoMode();
    const orderId = `ORD-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const subtotal = payload.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingCost = payload.shippingCost || 0;
    const total = subtotal + shippingCost;

    const mockOrder: Order = {
      id: orderId,
      customer_id: 'cust-demo-' + Date.now().toString().slice(-4),
      status: 'pending',
      shipping_name: payload.customerName,
      shipping_phone: payload.customerPhone,
      shipping_address: `${payload.shippingAddress}${payload.shippingCity ? `, ${payload.shippingCity}` : ''}`,
      subtotal,
      shipping_cost: shippingCost,
      total,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      customers: {
        id: 'cust-demo-' + Date.now().toString().slice(-4),
        auth_user_id: null,
        name: payload.customerName,
        email: payload.customerEmail || `${payload.customerPhone.replace(/[^0-9]/g, '')}@customer.angelinc.id`,
        phone: payload.customerPhone,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      order_items: payload.items.map((item, idx) => ({
        id: `item-${orderId}-${idx + 1}`,
        order_id: orderId,
        product_id: item.productId || null,
        product_name: item.name,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      })),
    };

    if (isDemo) {
      MOCK_ORDERS.unshift(mockOrder);
      return mockOrder;
    }

    try {
      const supabase = await createClient();

      // 1. Create or find customer
      let customerId = mockOrder.customer_id;
      const { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', payload.customerPhone)
        .maybeSingle();

      if (existingCustomer?.id) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer } = await supabase
          .from('customers')
          .insert({
            name: payload.customerName,
            email: payload.customerEmail || `${payload.customerPhone.replace(/[^0-9]/g, '')}@customer.angelinc.id`,
            phone: payload.customerPhone,
          })
          .select('id')
          .single();

        if (newCustomer?.id) {
          customerId = newCustomer.id;
        }
      }

      // 2. Insert order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          id: orderId,
          customer_id: customerId,
          status: 'pending',
          shipping_name: payload.customerName,
          shipping_phone: payload.customerPhone,
          shipping_address: `${payload.shippingAddress}${payload.shippingCity ? `, ${payload.shippingCity}` : ''}`,
          subtotal,
          shipping_cost: shippingCost,
          total,
        })
        .select()
        .single();

      if (orderError || !orderData) {
        MOCK_ORDERS.unshift(mockOrder);
        return mockOrder;
      }

      // 3. Insert order items
      if (payload.items.length > 0) {
        const orderItemsPayload = payload.items.map((item) => ({
          order_id: orderId,
          product_id: item.productId || null,
          product_name: item.name,
          quantity: item.quantity,
          unit_price: item.price,
          subtotal: item.price * item.quantity,
        }));

        await supabase.from('order_items').insert(orderItemsPayload);
      }

      MOCK_ORDERS.unshift(mockOrder);
      return mockOrder;
    } catch {
      MOCK_ORDERS.unshift(mockOrder);
      return mockOrder;
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
