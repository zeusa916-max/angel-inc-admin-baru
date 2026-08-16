'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types/api';
import {
  MOCK_PRODUCTS,
  MOCK_CATEGORIES,
  MOCK_ORDERS,
  MOCK_CUSTOMERS,
} from '@/server/data/mock-data';

const SEED_CATEGORIES = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    name: 'T-Shirts & Tops',
    slug: 't-shirts-tops',
    description: 'Koleksi atasan dan t-shirt premium berbahan sutra dan katun lembut.',
    is_active: true,
    created_at: '2026-01-10T10:00:00Z',
    updated_at: '2026-01-10T10:00:00Z',
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    name: 'Outerwear & Jackets',
    slug: 'outerwear-jackets',
    description: 'Jaket, blazer, dan mantel mewah bergaya kontemporer.',
    is_active: true,
    created_at: '2026-01-11T10:00:00Z',
    updated_at: '2026-01-11T10:00:00Z',
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    name: 'Pants & Trousers',
    slug: 'pants-trousers',
    description: 'Celana panjang dan bawahan dengan potongan rapi.',
    is_active: true,
    created_at: '2026-01-12T10:00:00Z',
    updated_at: '2026-01-12T10:00:00Z',
  },
  {
    id: '44444444-4444-4444-a444-444444444444',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Aksesoris eksklusif pelengkap gaya angelic.',
    is_active: true,
    created_at: '2026-01-13T10:00:00Z',
    updated_at: '2026-01-13T10:00:00Z',
  },
];

const SEED_PRODUCTS = [
  {
    id: 'a1111111-1111-4111-a111-111111111111',
    category_id: '11111111-1111-4111-a111-111111111111',
    name: 'Angel Silk Essential Shirt',
    sku: 'ANGEL-SHIRT-01',
    description: 'Kemeja sutra murni dengan sentuhan lembut dan siluet modern yang anggun.',
    price: 450000,
    discount_price: 380000,
    stock: 25,
    weight_grams: 250,
    status: 'active' as const,
    created_at: '2026-01-15T12:00:00Z',
    updated_at: '2026-01-15T12:00:00Z',
    categories: SEED_CATEGORIES[0],
    product_images: [
      {
        id: 'img-1',
        product_id: 'a1111111-1111-4111-a111-111111111111',
        storage_path: 'products/shirt-1.jpg',
        public_url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
        is_primary: true,
        created_at: '2026-01-15T12:00:00Z',
      },
    ],
  },
  {
    id: 'a2222222-2222-4222-a222-222222222222',
    category_id: '22222222-2222-4222-a222-222222222222',
    name: 'Paradise Oversized Blazer',
    sku: 'ANGEL-BLAZER-01',
    description: 'Blazer oversized dengan material wool blend premium dan kancing monogram eksklusif.',
    price: 890000,
    discount_price: null,
    stock: 12,
    weight_grams: 600,
    status: 'active' as const,
    created_at: '2026-01-16T12:00:00Z',
    updated_at: '2026-01-16T12:00:00Z',
    categories: SEED_CATEGORIES[1],
    product_images: [
      {
        id: 'img-2',
        product_id: 'a2222222-2222-4222-a222-222222222222',
        storage_path: 'products/blazer-1.jpg',
        public_url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
        is_primary: true,
        created_at: '2026-01-16T12:00:00Z',
      },
    ],
  },
  {
    id: 'a3333333-3333-4333-a333-333333333333',
    category_id: '33333333-3333-4333-a333-333333333333',
    name: 'Classic Pleated Trousers',
    sku: 'ANGEL-PANTS-01',
    description: 'Celana panjang berpotongan lurus dengan detail lipit depan yang elegan dan nyaman.',
    price: 520000,
    discount_price: 450000,
    stock: 18,
    weight_grams: 400,
    status: 'active' as const,
    created_at: '2026-01-17T12:00:00Z',
    updated_at: '2026-01-17T12:00:00Z',
    categories: SEED_CATEGORIES[2],
    product_images: [
      {
        id: 'img-3',
        product_id: 'a3333333-3333-4333-a333-333333333333',
        storage_path: 'products/pants-1.jpg',
        public_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop',
        is_primary: true,
        created_at: '2026-01-17T12:00:00Z',
      },
    ],
  },
  {
    id: 'a4444444-4444-4444-a444-444444444444',
    category_id: '44444444-4444-4444-a444-444444444444',
    name: 'Angel Monogram Leather Belt',
    sku: 'ANGEL-ACC-01',
    description: 'Ikat pinggang kulit sapi asli dengan buckle logam berlapis emas 18k.',
    price: 320000,
    discount_price: null,
    stock: 4,
    weight_grams: 180,
    status: 'active' as const,
    created_at: '2026-01-18T12:00:00Z',
    updated_at: '2026-01-18T12:00:00Z',
    categories: SEED_CATEGORIES[3],
    product_images: [
      {
        id: 'img-4',
        product_id: 'a4444444-4444-4444-a444-444444444444',
        storage_path: 'products/belt-1.jpg',
        public_url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop',
        is_primary: true,
        created_at: '2026-01-18T12:00:00Z',
      },
    ],
  },
];

const SEED_CUSTOMERS = [
  {
    id: 'c1111111-1111-4111-a111-111111111111',
    auth_user_id: null,
    name: 'Clara Vania',
    email: 'clara.vania@example.com',
    phone: '+6281234567891',
    created_at: '2026-01-20T08:00:00Z',
    updated_at: '2026-01-20T08:00:00Z',
  },
  {
    id: 'c2222222-2222-4222-a222-222222222222',
    auth_user_id: null,
    name: 'Rian Pratama',
    email: 'rian.pratama@example.com',
    phone: '+6281987654321',
    created_at: '2026-01-22T08:00:00Z',
    updated_at: '2026-01-22T08:00:00Z',
  },
  {
    id: 'c3333333-3333-4333-a333-333333333333',
    auth_user_id: null,
    name: 'Stephanie Aurelia',
    email: 'stephanie@example.com',
    phone: '+6285678901234',
    created_at: '2026-01-25T08:00:00Z',
    updated_at: '2026-01-25T08:00:00Z',
  },
];

const SEED_ORDERS = [
  {
    id: 'd1111111-1111-4111-a111-111111111111',
    customer_id: 'c1111111-1111-4111-a111-111111111111',
    status: 'completed' as const,
    shipping_name: 'Clara Vania',
    shipping_phone: '+6281234567891',
    shipping_address: 'Jl. Kemang Raya No. 45, Jakarta Selatan 12730',
    subtotal: 760000,
    shipping_cost: 25000,
    total: 785000,
    created_at: '2026-02-01T14:20:00Z',
    updated_at: '2026-02-01T14:20:00Z',
    customers: SEED_CUSTOMERS[0],
    order_items: [
      {
        id: 'e1111111-1111-4111-a111-111111111111',
        order_id: 'd1111111-1111-4111-a111-111111111111',
        product_id: 'a1111111-1111-4111-a111-111111111111',
        product_name: 'Angel Silk Essential Shirt',
        quantity: 2,
        unit_price: 380000,
        subtotal: 760000,
      },
    ],
  },
  {
    id: 'd2222222-2222-4222-a222-222222222222',
    customer_id: 'c2222222-2222-4222-a222-222222222222',
    status: 'processing' as const,
    shipping_name: 'Rian Pratama',
    shipping_phone: '+6281987654321',
    shipping_address: 'Jl. Senopati No. 88, Kebayoran Baru, Jakarta Selatan',
    subtotal: 890000,
    shipping_cost: 30000,
    total: 920000,
    created_at: '2026-02-03T09:15:00Z',
    updated_at: '2026-02-03T09:15:00Z',
    customers: SEED_CUSTOMERS[1],
    order_items: [
      {
        id: 'e2222222-2222-4222-a222-222222222222',
        order_id: 'd2222222-2222-4222-a222-222222222222',
        product_id: 'a2222222-2222-4222-a222-222222222222',
        product_name: 'Paradise Oversized Blazer',
        quantity: 1,
        unit_price: 890000,
        subtotal: 890000,
      },
    ],
  },
  {
    id: 'd3333333-3333-4333-a333-333333333333',
    customer_id: 'c3333333-3333-4333-a333-333333333333',
    status: 'pending' as const,
    shipping_name: 'Stephanie Aurelia',
    shipping_phone: '+6285678901234',
    shipping_address: 'Apartment Menteng Park Tower A, Jakarta Pusat',
    subtotal: 520000,
    shipping_cost: 20000,
    total: 540000,
    created_at: '2026-02-04T16:45:00Z',
    updated_at: '2026-02-04T16:45:00Z',
    customers: SEED_CUSTOMERS[2],
    order_items: [
      {
        id: 'e3333333-3333-4333-a333-333333333333',
        order_id: 'd3333333-3333-4333-a333-333333333333',
        product_id: 'a3333333-3333-4333-a333-333333333333',
        product_name: 'Classic Pleated Trousers',
        quantity: 1,
        unit_price: 520000,
        subtotal: 520000,
      },
    ],
  },
];

/**
 * Server action to clear all dummy/test data from products, categories, orders, customers.
 */
export async function clearDummyDataAction(): Promise<ActionResponse<{ cleared: boolean }>> {
  try {
    // 1. Clear in-memory mock data
    MOCK_PRODUCTS.length = 0;
    MOCK_CATEGORIES.length = 0;
    MOCK_ORDERS.length = 0;
    MOCK_CUSTOMERS.length = 0;

    // 2. Clear from Supabase if connected
    try {
      const supabase = await createClient();
      await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    } catch {
      // Ignore if Supabase is not reachable
    }

    // 3. Revalidate paths
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/admin/orders');
    revalidatePath('/admin/customers');
    revalidatePath('/admin/reports');

    return {
      success: true,
      data: { cleared: true },
      message: 'Seluruh dummy data berhasil dibersihkan.',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Gagal membersihkan data dummy.',
    };
  }
}

/**
 * Server action to recreate/re-seed dummy products, categories, orders, customers.
 */
export async function recreateDummyDataAction(): Promise<ActionResponse<{ recreated: boolean }>> {
  try {
    // 1. Restore in-memory mock data
    MOCK_CATEGORIES.length = 0;
    MOCK_CATEGORIES.push(...SEED_CATEGORIES);

    MOCK_PRODUCTS.length = 0;
    MOCK_PRODUCTS.push(...SEED_PRODUCTS);

    MOCK_CUSTOMERS.length = 0;
    MOCK_CUSTOMERS.push(...SEED_CUSTOMERS);

    MOCK_ORDERS.length = 0;
    MOCK_ORDERS.push(...SEED_ORDERS);

    // 2. Re-seed to Supabase if connected
    try {
      const supabase = await createClient();
      for (const cat of SEED_CATEGORIES) {
        await supabase.from('categories').upsert({
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description,
          is_active: cat.is_active,
        }, { onConflict: 'id' });
      }

      for (const prod of SEED_PRODUCTS) {
        await supabase.from('products').upsert({
          id: prod.id,
          category_id: prod.category_id,
          name: prod.name,
          sku: prod.sku,
          description: prod.description,
          price: prod.price,
          discount_price: prod.discount_price,
          stock: prod.stock,
          weight_grams: prod.weight_grams,
          status: prod.status,
        }, { onConflict: 'id' });
      }

      for (const cust of SEED_CUSTOMERS) {
        await supabase.from('customers').upsert({
          id: cust.id,
          name: cust.name,
          email: cust.email,
          phone: cust.phone,
        }, { onConflict: 'id' });
      }

      for (const ord of SEED_ORDERS) {
        await supabase.from('orders').upsert({
          id: ord.id,
          customer_id: ord.customer_id,
          status: ord.status,
          shipping_name: ord.shipping_name,
          shipping_phone: ord.shipping_phone,
          shipping_address: ord.shipping_address,
          subtotal: ord.subtotal,
          shipping_cost: ord.shipping_cost,
          total: ord.total,
        }, { onConflict: 'id' });

        for (const item of ord.order_items) {
          await supabase.from('order_items').upsert({
            id: item.id,
            order_id: item.order_id,
            product_id: item.product_id,
            product_name: item.product_name,
            quantity: item.quantity,
            unit_price: item.unit_price,
            subtotal: item.subtotal,
          }, { onConflict: 'id' });
        }
      }
    } catch {
      // Ignore if Supabase is offline or not reachable
    }

    // 3. Revalidate paths
    revalidatePath('/admin');
    revalidatePath('/admin/products');
    revalidatePath('/admin/categories');
    revalidatePath('/admin/orders');
    revalidatePath('/admin/customers');
    revalidatePath('/admin/reports');

    return {
      success: true,
      data: { recreated: true },
      message: 'Data dummy berhasil dibuat ulang dan siap digunakan.',
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Gagal membuat ulang data dummy.',
    };
  }
}
