<div align="center">

# ౨ৎ ₊˚ 🪽 ANGEL INC. 🪽 ₊˚ ౨ৎ
### ✨ *Admin Portal — Made in Paradise* ✨

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-Styling-38BDF8?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zod](https://img.shields.io/badge/Zod-Validation-3E67B1?style=for-the-badge&logo=zod&logoColor=white)](https://zod.dev/)

<p align="center">
  <i>Selamat datang di portal manajemen resmi <b>ANGEL INC.</b> 🕊️<br/>
  Dibangun dengan arsitektur backend berlapis (*Clean Layered Architecture*), validasi Zod, dan Supabase Ready yang sangat ramah developer junior! 🎀</i>
</p>

---

</div>

## 🪽 ₊˚ Keajaiban Fitur (Features)

```text
  ౨ৎ Dashboard Cantik & Ringkasan KPI Toko
  ౨ৎ Katalog Produk & Galeri Multi-Upload
  ౨ৎ Manajemen Kategori dengan Auto-Slug
  ౨ৎ Pemrosesan Pesanan & Cetak Invoice
  ౨ৎ Direktori Pelanggan & Riwayat Belanja
  ౨ৎ Analitik Pendapatan & Grafik Status Pesanan
  ౨ৎ Pengaturan Profil & Keamanan Admin
  ౨ৎ Diagnostik Otomatis Koneksi Supabase (npm run db:check)
```

- 💖 **Dashboard Interaktif**: Pantau revenue selesai, pesanan terbaru, dan peringatan otomatis jika stok produk menipis (*Low Stock Alert*).
- 🎀 **Manajemen Produk Anggun**: Upload foto multi-angle ke Supabase Storage, preview instan, kelola harga diskon otomatis, dan filter katalog lengkap.
- 📦 **Pemrosesan Order Real-time**: Filter pesanan berdasarkan status (*Pending, Paid, Diproses, Dikirim, Selesai*), alamat kirim, serta cetak bukti invoice.
- 💌 **Basis Data Pelanggan**: Lacak riwayat pesanan setiap pelanggan setia beserta total nilai belanja (*Lifetime Spend*).
- 📊 **Laporan & Analitik**: Insight penjualan produk terlaris, rata-rata nilai pesanan (*AOV*), dan rasio sukses pesanan.
- 📱 **Mobile Drawer Navigation**: Tampilan responsif sempurna dengan menu drawer di smartphone & tablet.
- 🪄 **Sweet Toast Notifications**: Feedback aksi yang halus, elegan, dan memanjakan mata.

---

## 🌸 ₊˚ Panduan Memulai Cepat (Junior Quick Start)

> 📖 **Butuh panduan lengkap pemula?** Baca **[Panduan Supabase Lengkap (docs/SUPABASE_GUIDE.md)](./docs/SUPABASE_GUIDE.md)**!

### 1. Pasang Dependensi 📦
```bash
npm install
```

### 2. Konfigurasi Lingkungan (Environment) 🔑
Salin file `.env.example` menjadi `.env.local`:
```bash
cp .env.example .env.local
```
Isi kredensial Supabase milikmu di `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://proyek-supabase-kamu.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key-rahasia-kamu
```

### 3. Inisialisasi Database (1-Click Run) 🕊️
1. Buka dashboard Supabase milikmu > **SQL Editor**.
2. Salin isi [`supabase/schema.sql`](./supabase/schema.sql) lalu klik **RUN**.
3. *(Opsional)* Salin isi [`supabase/seed.sql`](./supabase/seed.sql) lalu klik **RUN** untuk sample data produk & kategori siap pakai.

### 4. Buat Akun Admin Pertama 👑
1. Buka Supabase **Authentication** > **Users**, buat akun email & password.
2. Di **SQL Editor**, jadikan akun tersebut sebagai Administrator:
```sql
UPDATE public.profiles
SET role = 'admin', full_name = 'Angel Administrator'
WHERE id = 'UUID_USER_DARI_SUPABASE';
```

### 5. Cek Koneksi & Jalankan Server ✨
```bash
# Diagnostik koneksi database & storage
npm run db:check

# Jalankan server development
npm run dev
```
Buka browser kesayanganmu di `http://localhost:3000` 🤍

---

## 🏛️ ₊˚ Struktur Folder (Layered Architecture)

```tree
angel-inc-admin/
├── 📁 app/                     # 🌐 Routing Next.js (App Router)
│   ├── 📁 admin/               # Halaman dashboard, produk, pesanan, kategori, laporan, setting
│   ├── 📁 auth/                # Halaman login & reset password
│   ├── layout.tsx              # Root layout & Google Fonts
│   └── globals.css             # Styling & tema
│
├── 📁 server/                  # 🛡️ LAPISAN BACKEND
│   ├── 📁 actions/             # Server Actions (Mutasi data & revalidasi cache)
│   ├── 📁 services/            # Domain Services (Query DB Supabase & Storage)
│   ├── 📁 schemas/             # Validasi Runtime Zod (Product, Order, Category, Auth)
│   └── 📁 errors/              # Custom Error Handler (AppError, ValidationError)
│
├── 📁 components/              # 🎀 KOMPONEN UI
│   ├── 📁 layout/              # Nav, MobileNav, BrandLogo
│   ├── 📁 admin/products/      # ProductForm, DeleteProductDialog
│   └── 📁 ui/toast.tsx         # Toast notification system
│
├── 📁 docs/                    # 📚 Dokumentasi Khusus Developer Junior
│   └── SUPABASE_GUIDE.md       # Panduan lengkap koneksi, auth, dan CRUD
│
├── 📁 scripts/                 # ⚙️ Skrip utilitas CLI
│   └── check-connection.mjs   # Diagnostik koneksi (npm run db:check)
│
├── 📁 supabase/                # 📜 Skrip Database Supabase
│   ├── schema.sql              # Skema lengkap, RLS, Trigger, dan Storage Bucket
│   └── seed.sql                # Sample data awal
│
└── 📁 types/                   # 🏷️ TypeScript Type Definitions
    ├── database.ts             # Entitas database Supabase
    └── api.ts                  # ActionResponse standar
```

---

## 👥 ₊˚ Kontributor & Author

- **Lead Architect & Developer**: **DummVinci**
- **Brand & Production**: **ANGEL INC.** &copy; 2026

---

<div align="center">

### ౨ৎ ₊˚ Made with pure love & angelic grace ₊˚ ౨ৎ
**ANGEL INC. — *Made in Paradise*** 🕊️✨
*Crafted by **DummVinci***

</div>
