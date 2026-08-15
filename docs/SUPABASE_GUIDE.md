# 🕊️ Panduan Supabase untuk Junior Developer (ANGEL INC.)

Panduan lengkap, praktis, dan ramah pemula (*junior-friendly*) untuk menghubungkan backend **Supabase**, mengelola otentikasi riil, menjalankan query CRUD produk, dan membersihkan data dummy.

---

## ⚡ Ringkasan Perintah Penting (CLI Cheatsheet)

```bash
# 1. Cek kesehatan koneksi tabel & storage Supabase
npm run db:check

# 2. Hapus seluruh data dummy (reset database)
npm run db:clean

# 3. Jalankan development server
npm run dev
```

---

## 🚀 Langkah 1: Mendapatkan Kredensial Supabase

1. Daftar / Masuk ke akun [Supabase](https://supabase.com/).
2. Buat proyek baru (*Create New Project*), misalnya bernama `angel-inc-db`.
3. Buka menu **Project Settings** (ikon gerigi di kiri bawah) > **API**.
4. Salin 2 nilai berikut:
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **Project API Keys (`anon` / `public`)**: `eyJhbGciOi...`
5. Buka file `.env.local` di proyek ini dan tempelkan:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

---

## 📜 Langkah 2: Setup Database & Storage (1-Click Run)

1. Di dashboard Supabase, buka menu **SQL Editor** (ikon terminal di sidebar kiri).
2. Buka file [supabase/schema.sql](file:///c:/Users/user/Downloads/10_Web-Dev-Assets/Antigravity/angel-inc-admin-baru-main/supabase/schema.sql) di VS Code / Antigravity, salin seluruh kodenya.
3. Tempel di SQL Editor Supabase dan klik tombol **RUN** (hijau).
4. *(Opsional)* Salin juga isi [supabase/seed.sql](file:///c:/Users/user/Downloads/10_Web-Dev-Assets/Antigravity/angel-inc-admin-baru-main/supabase/seed.sql) lalu klik **RUN** untuk mengisi produk, kategori, dan transaksi contoh!

---

## 👑 Langkah 3: Membuat Akun Admin Pertama

Portal Admin kini menggunakan otentikasi ketat via **Supabase Auth**:

1. Di dashboard Supabase, buka menu **Authentication** > **Users**.
2. Klik **Add User** > **Create User**.
3. Masukkan Email (misal: `admin@angelinc.id`) dan Password Anda.
4. Salin **User UID** yang baru dibuat.
5. Buka **SQL Editor**, jalankan query berikut untuk memberikan role `admin`:
   ```sql
   UPDATE public.profiles
   SET role = 'admin', full_name = 'Angel Administrator'
   WHERE id = 'TEMPELKAN_USER_UID_DISINI';
   ```
6. Masuk ke portal admin melalui [http://localhost:3000/auth/login/admin](http://localhost:3000/auth/login/admin) menggunakan email dan password yang baru saja Anda buat! ✨

---

## 🧹 Langkah 4: Membersihkan / Reset Data Dummy

Jika Anda ingin mengosongkan semua data sampel (produk, kategori, order) dan memulai memasukkan data riil:

- **Cara 1 (Via Admin UI)**:
  Buka halaman **Produk** atau **Pengaturan** di portal admin, lalu klik tombol merah **"Hapus Seluruh Data Dummy"**.
- **Cara 2 (Via Terminal CLI)**:
  ```bash
  npm run db:clean
  ```
- **Cara 3 (Via Supabase SQL Editor)**:
  Salin dan jalankan skrip [`supabase/clean.sql`](file:///c:/Users/user/Downloads/10_Web-Dev-Assets/Antigravity/angel-inc-admin-baru-main/supabase/clean.sql).

---

## 🛠️ Junior Cheatsheet: Cara Kerja CRUD di Proyek Ini

Arsitektur proyek ini menggunakan pola **Layered Service & Server Action**:

```
UI Component (Form/Button)
         │
         ▼
Server Action (`server/actions/product.actions.ts`)
  - Validasi Zod (`server/schemas/product.schema.ts`)
  - Verifikasi Admin (`lib/auth.ts`)
         │
         ▼
Domain Service (`server/services/product.service.ts`)
  - Query Database Supabase / Storage
```

### 1. Cara Mengambil Data Produk:
```typescript
import { ProductService } from '@/server/services/product.service';

// Ambil semua produk
const products = await ProductService.getAll();

// Ambil detail 1 produk berdasarkan ID
const product = await ProductService.getById('PRODUCT_UUID');
```

### 2. Cara Menambahkan Produk Baru:
```typescript
import { createProductAction } from '@/server/actions/product.actions';

const result = await createProductAction({
  name: 'Angel Silk Dress',
  sku: 'ANGEL-DRESS-01',
  price: 350000,
  stock: 20,
  weight_grams: 300,
  status: 'active',
});

if (result.success) {
  console.log('Produk berhasil dibuat:', result.data);
} else {
  console.error('Gagal:', result.error);
}
```

### 3. Cara Mengupdate Status Pesanan:
```typescript
import { updateOrderStatusAction } from '@/server/actions/order.actions';

await updateOrderStatusAction({
  id: 'ORDER_UUID',
  status: 'shipped', // 'pending' | 'paid' | 'processing' | 'shipped' | 'completed' | 'cancelled'
});
```

---

## 💡 Cheatsheet: Menambahkan Kolom Baru di Database

Contoh: Anda ingin menambahkan kolom `size` (Ukuran) pada tabel `products`:

1. **Jalankan SQL di Supabase**:
   ```sql
   ALTER TABLE public.products ADD COLUMN size TEXT DEFAULT 'All Size';
   ```
2. **Update Type TypeScript** di `types/database.ts`:
   ```typescript
   export interface Product {
     // ...
     size?: string | null;
   }
   ```
3. **Update Validasi Zod** di `server/schemas/product.schema.ts`:
   ```typescript
   export const productInputSchema = z.object({
     // ...
     size: z.string().optional(),
   });
   ```
4. **Update Form & Tampilan** di `components/admin/products/product-form.tsx`. Selesai! 🎉
