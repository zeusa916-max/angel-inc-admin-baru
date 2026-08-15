-- ==============================================================================
-- 🕊️ ANGEL INC. — Supabase Complete Database Schema & Security Policies
-- ==============================================================================
-- Petunjuk: Jalankan seluruh script ini di Supabase SQL Editor (1-Click Run).
-- Seluruh tabel, tipe data, fungsi otomatis, dan security rules (RLS) akan terpasang.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. CUSTOM ENUM TYPES
DO $$ BEGIN
    CREATE TYPE public.user_role AS ENUM ('customer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.product_status AS ENUM ('draft', 'active', 'inactive', 'out_of_stock');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.order_status AS ENUM ('pending', 'paid', 'processing', 'shipped', 'completed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ------------------------------------------------------------------------------
-- 3. TABLES DEFINITION
-- ------------------------------------------------------------------------------

-- Tabel: profiles (Data profil pengguna & role administrator)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    role public.user_role NOT NULL DEFAULT 'customer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel: categories (Kategori produk)
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel: products (Katalog produk)
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    sku TEXT UNIQUE NOT NULL,
    description TEXT,
    price NUMERIC(14,2) NOT NULL DEFAULT 0,
    discount_price NUMERIC(14,2),
    stock INTEGER NOT NULL DEFAULT 0,
    weight_grams INTEGER NOT NULL DEFAULT 0,
    status public.product_status NOT NULL DEFAULT 'draft',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel: product_images (Galeri foto produk)
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
    storage_path TEXT NOT NULL,
    public_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel: customers (Data pelanggan)
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel: orders (Transaksi pesanan)
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
    status public.order_status NOT NULL DEFAULT 'pending',
    shipping_name TEXT,
    shipping_phone TEXT,
    shipping_address TEXT,
    subtotal NUMERIC(14,2) DEFAULT 0,
    shipping_cost NUMERIC(14,2) DEFAULT 0,
    total NUMERIC(14,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabel: order_items (Rincian item barang dalam pesanan)
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price NUMERIC(14,2) NOT NULL,
    subtotal NUMERIC(14,2) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 4. HELPER FUNCTIONS & TRIGGERS
-- ------------------------------------------------------------------------------

-- Fungsi untuk mengecek apakah user saat ini memiliki role 'admin'
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Trigger otomatis membuat profile ketika user baru register via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, phone, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'User'),
        COALESCE(new.raw_user_meta_data->>'phone', NULL),
        'customer'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "public active categories" ON public.categories;
DROP POLICY IF EXISTS "public active products" ON public.products;
DROP POLICY IF EXISTS "public product images" ON public.product_images;
DROP POLICY IF EXISTS "admin profiles" ON public.profiles;
DROP POLICY IF EXISTS "admin categories" ON public.categories;
DROP POLICY IF EXISTS "admin products" ON public.products;
DROP POLICY IF EXISTS "admin images" ON public.product_images;
DROP POLICY IF EXISTS "admin customers" ON public.customers;
DROP POLICY IF EXISTS "admin orders" ON public.orders;
DROP POLICY IF EXISTS "admin items" ON public.order_items;

-- Public / Website Read Policies
CREATE POLICY "public active categories" ON public.categories
    FOR SELECT TO anon, authenticated
    USING (is_active = true OR public.is_admin());

CREATE POLICY "public active products" ON public.products
    FOR SELECT TO anon, authenticated
    USING (status = 'active' OR public.is_admin());

CREATE POLICY "public product images" ON public.product_images
    FOR SELECT TO anon, authenticated
    USING (true);

-- Admin Full Access Policies
CREATE POLICY "admin profiles" ON public.profiles
    FOR ALL TO authenticated
    USING (public.is_admin() OR id = auth.uid())
    WITH CHECK (public.is_admin() OR id = auth.uid());

CREATE POLICY "admin categories" ON public.categories
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "admin products" ON public.products
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "admin images" ON public.product_images
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "admin customers" ON public.customers
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "admin orders" ON public.orders
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

CREATE POLICY "admin items" ON public.order_items
    FOR ALL TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- 6. STORAGE BUCKET & POLICIES (product-images)
-- ------------------------------------------------------------------------------

INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "public image read" ON storage.objects;
DROP POLICY IF EXISTS "admin image upload" ON storage.objects;
DROP POLICY IF EXISTS "admin image update" ON storage.objects;
DROP POLICY IF EXISTS "admin image delete" ON storage.objects;

CREATE POLICY "public image read" ON storage.objects
    FOR SELECT TO public
    USING (bucket_id = 'product-images');

CREATE POLICY "admin image upload" ON storage.objects
    FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "admin image update" ON storage.objects
    FOR UPDATE TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());

CREATE POLICY "admin image delete" ON storage.objects
    FOR DELETE TO authenticated
    USING (bucket_id = 'product-images' AND public.is_admin());
