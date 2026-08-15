import { z } from 'zod';

export const productStatusSchema = z.enum(['draft', 'active', 'inactive', 'out_of_stock']);

export const productInputSchema = z
  .object({
    name: z.string().min(2, 'Nama produk minimal 2 karakter').max(200, 'Nama produk maksimal 200 karakter'),
    sku: z
      .string()
      .min(2, 'SKU minimal 2 karakter')
      .max(50, 'SKU maksimal 50 karakter')
      .regex(/^[A-Za-z0-9-_]+$/, 'SKU hanya boleh berisi huruf, angka, tanda strip, atau garis bawah'),
    description: z.string().nullable().optional(),
    price: z.coerce.number().min(0, 'Harga normal tidak boleh negatif'),
    discount_price: z.coerce.number().nullable().optional(),
    stock: z.coerce.number().int().min(0, 'Stok tidak boleh negatif').default(0),
    weight_grams: z.coerce.number().int().min(0, 'Berat tidak boleh negatif').default(0),
    category_id: z.string().uuid('ID Kategori tidak valid').nullable().optional().or(z.literal('')),
    status: productStatusSchema.default('draft'),
  })
  .refine(
    (data) => {
      if (data.discount_price !== null && data.discount_price !== undefined && data.discount_price > 0) {
        return data.discount_price < data.price;
      }
      return true;
    },
    {
      message: 'Harga diskon harus lebih rendah dari harga normal',
      path: ['discount_price'],
    }
  );

export type ProductInput = z.infer<typeof productInputSchema>;
