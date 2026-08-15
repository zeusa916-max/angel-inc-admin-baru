import { createClient } from '@/lib/supabase/server';
import { Category } from '@/types/database';
import { CategoryInput } from '@/server/schemas/category.schema';
import { AppError, NotFoundError } from '@/server/errors/app-error';
import { MOCK_CATEGORIES } from '@/server/data/mock-data';
import { cookies } from 'next/headers';

export class CategoryService {
  private static async isDemoMode(): Promise<boolean> {
    try {
      const cookieStore = await cookies();
      return cookieStore.get('angel_admin_demo')?.value === 'true';
    } catch {
      return false;
    }
  }

  static async getAll(options?: { activeOnly?: boolean }): Promise<Category[]> {
    if (await this.isDemoMode()) {
      return options?.activeOnly ? MOCK_CATEGORIES.filter((c) => c.is_active) : MOCK_CATEGORIES;
    }

    try {
      const supabase = await createClient();
      let query = supabase.from('categories').select('*').order('name', { ascending: true });

      if (options?.activeOnly) {
        query = query.eq('is_active', true);
      }

      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 600)
      );

      const { data, error } = await Promise.race([query, timeoutPromise]);

      if (error || !data || data.length === 0) {
        return options?.activeOnly ? MOCK_CATEGORIES.filter((c) => c.is_active) : MOCK_CATEGORIES;
      }

      return data as Category[];
    } catch (err: any) {
      if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
      return options?.activeOnly ? MOCK_CATEGORIES.filter((c) => c.is_active) : MOCK_CATEGORIES;
    }
  }

  static async getById(id: string): Promise<Category | null> {
    if (await this.isDemoMode()) {
      return MOCK_CATEGORIES.find((c) => c.id === id) || null;
    }

    try {
      const supabase = await createClient();
      const query = supabase.from('categories').select('*').eq('id', id).single();
      const timeoutPromise = new Promise<{ data: null; error: any }>((resolve) =>
        setTimeout(() => resolve({ data: null, error: { message: 'Timeout' } }), 600)
      );

      const { data, error } = await Promise.race([query, timeoutPromise]);
      if (error || !data) return MOCK_CATEGORIES.find((c) => c.id === id) || null;
      return data as Category;
    } catch (err: any) {
      if (err?.digest === 'DYNAMIC_SERVER_USAGE') throw err;
      return MOCK_CATEGORIES.find((c) => c.id === id) || null;
    }
  }

  static async create(input: CategoryInput): Promise<Category> {
    const isDemo = await this.isDemoMode();
    if (isDemo) {
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        name: input.name.trim(),
        slug: input.slug.trim().toLowerCase(),
        description: input.description?.trim() || null,
        is_active: input.is_active,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      MOCK_CATEGORIES.push(newCat);
      return newCat;
    }

    const supabase = await createClient();
    const payload = {
      name: input.name.trim(),
      slug: input.slug.trim().toLowerCase(),
      description: input.description?.trim() || null,
      is_active: input.is_active,
    };

    const { data, error } = await supabase
      .from('categories')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new AppError('Nama atau slug kategori sudah digunakan.', 409);
      }
      throw new AppError(error.message, 500);
    }

    return data as Category;
  }

  static async update(id: string, input: CategoryInput): Promise<Category> {
    const isDemo = await this.isDemoMode();
    if (isDemo) {
      const idx = MOCK_CATEGORIES.findIndex((c) => c.id === id);
      if (idx !== -1) {
        MOCK_CATEGORIES[idx] = {
          ...MOCK_CATEGORIES[idx],
          name: input.name.trim(),
          slug: input.slug.trim().toLowerCase(),
          description: input.description?.trim() || null,
          is_active: input.is_active,
          updated_at: new Date().toISOString(),
        };
        return MOCK_CATEGORIES[idx];
      }
    }

    const supabase = await createClient();
    const payload = {
      name: input.name.trim(),
      slug: input.slug.trim().toLowerCase(),
      description: input.description?.trim() || null,
      is_active: input.is_active,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('categories')
      .update(payload)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new AppError('Nama atau slug kategori sudah digunakan.', 409);
      }
      throw new AppError(error.message, 500);
    }

    if (!data) {
      throw new NotFoundError(`Kategori dengan ID ${id} tidak ditemukan.`);
    }

    return data as Category;
  }

  static async delete(id: string): Promise<boolean> {
    const isDemo = await this.isDemoMode();
    if (isDemo) {
      const idx = MOCK_CATEGORIES.findIndex((c) => c.id === id);
      if (idx !== -1) MOCK_CATEGORIES.splice(idx, 1);
      return true;
    }

    const supabase = await createClient();
    const { error } = await supabase.from('categories').delete().eq('id', id);

    if (error) {
      throw new AppError(
        'Gagal menghapus kategori. Pastikan tidak ada produk yang terikat pada kategori ini.',
        500
      );
    }

    return true;
  }
}
