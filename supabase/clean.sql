-- ==============================================================================
-- 🕊️ ANGEL INC. — Clean / Reset Dummy Data Script
-- ==============================================================================
-- Petunjuk: Jalankan script ini di Supabase SQL Editor jika Anda ingin
-- MENGHAPUS SEMUA DATA DUMMY (Produk, Kategori, Order, Customer)
-- tetapi TETAP MEMPERTAHANKAN STRUKTUR TABEL & AKUN USER/ADMIN.
-- ==============================================================================

BEGIN;

-- 1. Hapus rincian item pesanan & pesanan
DELETE FROM public.order_items;
DELETE FROM public.orders;

-- 2. Hapus data pelanggan dummy
DELETE FROM public.customers;

-- 3. Hapus foto produk & produk
DELETE FROM public.product_images;
DELETE FROM public.products;

-- 4. Hapus kategori
DELETE FROM public.categories;

COMMIT;

-- Pesan konfirmasi
-- Seluruh dummy data telah dibersihkan. Database Anda sekarang bersih dan siap menerima data riil! ✨
