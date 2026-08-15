import { z } from 'zod';

export const updateProfileSchema = z.object({
  full_name: z.string().min(2, 'Nama lengkap minimal 2 karakter').max(100, 'Nama lengkap maksimal 100 karakter'),
  phone: z.string().max(25, 'Nomor telepon maksimal 25 karakter').nullable().optional(),
});

export const changePasswordSchema = z
  .object({
    old_password: z.string().optional(),
    new_password: z.string().min(8, 'Password baru minimal 8 karakter'),
    confirm_password: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: 'Konfirmasi kata sandi tidak cocok',
    path: ['confirm_password'],
  });

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
