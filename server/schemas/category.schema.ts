import { z } from 'zod';

export const categoryInputSchema = z.object({
  name: z.string().min(2, 'Nama kategori minimal 2 karakter').max(100, 'Nama kategori maksimal 100 karakter'),
  slug: z
    .string()
    .min(2, 'Slug minimal 2 karakter')
    .max(100, 'Slug maksimal 100 karakter')
    .regex(/^[a-z0-9-]+$/, 'Slug hanya boleh berisi huruf kecil, angka, dan tanda strip'),
  description: z.string().nullable().optional(),
  is_active: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categoryInputSchema>;
