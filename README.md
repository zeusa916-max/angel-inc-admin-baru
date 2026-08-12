# ANGEL INC. ADMIN PORTAL

Repository `angel-inc-admin`; customer website `website-angel-inc`. Keduanya menggunakan Supabase yang sama.

## Setup
1. `npm install`
2. Copy `.env.example` ke `.env.local` dan isi URL + anon key Supabase.
3. Jalankan `supabase/schema.sql` di Supabase SQL Editor.
4. Buat user admin pertama melalui Supabase Authentication > Users.
5. Setelah user dibuat, jadikan admin:
   `update public.profiles set role='admin', full_name='Nama Admin' where id='UUID_USER';`
6. `npm run dev` lalu buka `/auth/login/admin`.
7. Deploy project ini ke Vercel sebagai repository `angel-inc-admin`.

Jangan masukkan service-role key ke frontend. Upload foto memakai Supabase Storage bucket `product-images`. Website pelanggan harus membaca tabel `products` dan menampilkan produk berstatus `active`.

Catatan: implementasi ini adalah fondasi aplikasi nyata dengan Supabase Auth, RLS, database CRUD, storage upload, route protection, kategori, pesanan, pelanggan, laporan, settings, forgot-password dan responsive admin UI. Sebelum production, uji RLS dan alur order sesuai schema website pelanggan.


## ANGEL INC. Logo
The supplied ANGEL INC. logo is included at `public/angel-inc-logo.jpg`.
It is used in the admin login, desktop sidebar, mobile header, and browser icon.
The customer website/repository is not modified by this admin project.
