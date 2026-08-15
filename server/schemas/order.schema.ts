import { z } from 'zod';

export const orderStatusSchema = z.enum([
  'pending',
  'paid',
  'processing',
  'shipped',
  'completed',
  'cancelled',
]);

export const updateOrderStatusSchema = z.object({
  id: z.string().uuid('ID Pesanan tidak valid'),
  status: orderStatusSchema,
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
