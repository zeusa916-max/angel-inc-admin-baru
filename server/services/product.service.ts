import { createClient } from '@/lib/supabase/server';
import { Product, ProductImage } from '@/types/database';
import { ProductInput } from '@/server/schemas/product.schema';
import { AppError, NotFoundError } from '@/server/errors/app-error';
import { MOCK_PRODUCTS } from '@/server/data/mock-data';
import { cookies } from 'next/headers';

export class ProductService {
  private static async isDemoMode(): Promise<boolean> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get('angel_admin_demo')?.value === 'true';
    } catch {
      return false;
    }
  }

  static async getAll(options?: { categoryId?: string; status?: string; search?: string }) {
    if (await this.isDemoMode()) {
      let list = [...MOCK_PRODUCTS];
      if (options?.categoryId && options.categoryId !== 'ALL') {
        list = list.filter((p) => p.category_id === options.categoryId);
      }
      if (options?.status && options.status !== 'ALL') {
        list = list.filter((p) => p.status === options.status);
      }
      if (options?.search) {
        const s = options.search.toLowerCase();
        list = list.filter(
          (p) => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s)
        );
      }
      return list;
    }

    try {
      const supabase = await createClient();
      let query = supabase
        .from('products')
        .select('*, categories(id, name), product_images(*)')
        .order('created_at', { ascending: false });

      if (options?.categoryId && options.categoryId !== 'ALL') {
        query = query.eq('category_id', options.categoryId);
      }

      if (options?.status && options.status !== 'ALL') {
        query = query.eq('status', options.status);
      }

      // Timeout protection against slow/offline remote Supabase
      const queryPromise = query;
      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 600)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error || !data) {
        let list = [...MOCK_PRODUCTS];
        if (options?.categoryId && options.categoryId !== 'ALL') {
          list = list.filter((p) => p.category_id === options.categoryId);
        }
        if (options?.status && options.status !== 'ALL') {
          list = list.filter((p) => p.status === options.status);
        }
        if (options?.search) {
          const s = options.search.toLowerCase();
          list = list.filter(
            (p) => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s)
          );
        }
        return list;
      }

      let results = (data as Product[]) || [];
      if (options?.search) {
        const s = options.search.toLowerCase();
        results = results.filter(
          (p) => p.name.toLowerCase().includes(s) || p.sku.toLowerCase().includes(s)
        );
      }

      return results.length > 0 ? results : MOCK_PRODUCTS;
    } catch (err: any) {
      if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
      return MOCK_PRODUCTS;
    }
  }

  static async getById(id: string): Promise<(Product & { product_images?: ProductImage[] }) | null> {
    if (await this.isDemoMode()) {
      const found = MOCK_PRODUCTS.find((p) => p.id === id);
      return (found as any) || MOCK_PRODUCTS[0];
    }

    try {
      const supabase = await createClient();
      const queryPromise = supabase
        .from('products')
        .select('*, categories(id, name), product_images(*)')
        .eq('id', id)
        .single();

      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 600)
      );

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error || !data) {
        const found = MOCK_PRODUCTS.find((p) => p.id === id);
        return (found as any) || MOCK_PRODUCTS[0];
      }

      return data as Product & { product_images?: ProductImage[] };
    } catch (err: any) {
      if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
      const found = MOCK_PRODUCTS.find((p) => p.id === id);
      return (found as any) || MOCK_PRODUCTS[0];
    }
  }

  static async create(input: ProductInput): Promise<Product> {
    const isDemo = await this.isDemoMode();
    if (isDemo) {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        category_id: input.category_id || null,
        name: input.name.trim(),
        sku: input.sku.trim().toUpperCase(),
        description: input.description?.trim() || null,
        price: input.price,
        discount_price: input.discount_price ?? null,
        stock: input.stock,
        weight_grams: input.weight_grams,
        status: input.status,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      MOCK_PRODUCTS.unshift(newProd as any);
      return newProd;
    }

    const supabase = await createClient();
    const payload = {
      name: input.name.trim(),
      sku: input.sku.trim().toUpperCase(),
      description: input.description?.trim() || null,
      price: input.price,
      discount_price: input.discount_price ?? null,
      stock: input.stock,
      weight_grams: input.weight_grams,
      category_id: input.category_id || null,
      status: input.status,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .insert(payload)
      .select('id, name, sku, price, stock, status, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new AppError(`SKU "${input.sku}" sudah terdaftar pada produk lain.`, 409);
      }
      throw new AppError(error.message, 500);
    }

    if (!data) {
      throw new AppError('Gagal membuat data produk.', 500);
    }

    return data as Product;
  }

  static async update(id: string, input: ProductInput): Promise<Product> {
    const isDemo = await this.isDemoMode();
    if (isDemo) {
      const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) {
        MOCK_PRODUCTS[idx] = {
          ...MOCK_PRODUCTS[idx],
          name: input.name.trim(),
          sku: input.sku.trim().toUpperCase(),
          description: input.description?.trim() || null,
          price: input.price,
          discount_price: input.discount_price ?? null,
          stock: input.stock,
          weight_grams: input.weight_grams,
          category_id: input.category_id || null,
          status: input.status,
          updated_at: new Date().toISOString(),
        };
        return MOCK_PRODUCTS[idx];
      }
    }

    const supabase = await createClient();
    const payload = {
      name: input.name.trim(),
      sku: input.sku.trim().toUpperCase(),
      description: input.description?.trim() || null,
      price: input.price,
      discount_price: input.discount_price ?? null,
      stock: input.stock,
      weight_grams: input.weight_grams,
      category_id: input.category_id || null,
      status: input.status,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('products')
      .update(payload)
      .eq('id', id)
      .select('id, name, sku, price, stock, status, created_at, updated_at')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new AppError(`SKU "${input.sku}" sudah terdaftar pada produk lain.`, 409);
      }
      throw new AppError(error.message, 500);
    }

    if (!data) {
      throw new NotFoundError(`Produk dengan ID ${id} tidak ditemukan.`);
    }

    return data as Product;
  }

  static async delete(id: string): Promise<boolean> {
    const isDemo = await this.isDemoMode();
    if (isDemo) {
      const idx = MOCK_PRODUCTS.findIndex((p) => p.id === id);
      if (idx !== -1) MOCK_PRODUCTS.splice(idx, 1);
      return true;
    }

    const supabase = await createClient();

    const { data: images } = await supabase
      .from('product_images')
      .select('storage_path')
      .eq('product_id', id);

    if (images && images.length > 0) {
      const paths = images.map((img) => img.storage_path);
      await supabase.storage.from('product-images').remove(paths);
    }

    const { error } = await supabase.from('products').delete().eq('id', id);

    if (error) {
      throw new AppError(error.message, 500);
    }

    return true;
  }
}
