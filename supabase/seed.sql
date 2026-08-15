-- ==============================================================================
-- 🕊️ ANGEL INC. — Supabase Sample Seed Data
-- ==============================================================================
-- Petunjuk: Jalankan di SQL Editor setelah menjalankan schema.sql jika ingin
-- mengisi database lokal/development dengan data awal siap pakai.
-- ==============================================================================

-- 1. SEED KATEGORI
INSERT INTO public.categories (id, name, slug, description, is_active)
VALUES
    ('c1111111-1111-1111-1111-111111111111', 'T-Shirts & Tops', 't-shirts-tops', 'Koleksi atasan dan t-shirt premium berbahan katun lembut.', true),
    ('c2222222-2222-2222-2222-222222222222', 'Outerwear & Jackets', 'outerwear-jackets', 'Jaket, blazer, dan mantel mewah bergaya kontemporer.', true),
    ('c3333333-3333-3333-3333-333333333333', 'Pants & Trousers', 'pants-trousers', 'Celana panjang dan bawahan dengan potongan rapi.', true),
    ('c4444444-4444-4444-4444-444444444444', 'Accessories', 'accessories', 'Aksesoris eksklusif pelengkap gaya angelic.', true)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED PRODUK
INSERT INTO public.products (id, category_id, name, sku, description, price, discount_price, stock, weight_grams, status)
VALUES
    (
        'p1111111-1111-1111-1111-111111111111',
        'c1111111-1111-1111-1111-111111111111',
        'Angel Silk Essential Shirt',
        'ANGEL-SHIRT-01',
        'Kemeja sutra murni dengan sentuhan lembut dan siluet modern yang anggun. Cocok untuk acara formal maupun kasual mewah.',
        450000,
        380000,
        25,
        250,
        'active'
    ),
    (
        'p2222222-2222-2222-2222-222222222222',
        'c2222222-2222-2222-2222-222222222222',
        'Paradise Oversized Blazer',
        'ANGEL-BLAZER-01',
        'Blazer oversized dengan material wool blend premium dan kancing monogram eksklusif.',
        890000,
        NULL,
        12,
        600,
        'active'
    ),
    (
        'p3333333-3333-3333-3333-333333333333',
        'c3333333-3333-3333-3333-333333333333',
        'Classic Pleated Trousers',
        'ANGEL-PANTS-01',
        'Celana panjang berpotongan lurus dengan detail lipit depan yang elegan dan nyaman.',
        520000,
        450000,
        18,
        400,
        'active'
    ),
    (
        'p4444444-4444-4444-4444-444444444444',
        'c4444444-4444-4444-4444-444444444444',
        'Angel Monogram Leather Belt',
        'ANGEL-ACC-01',
        'Ikat pinggang kulit sapi asli dengan buckle logam berlapis emas 18k.',
        320000,
        NULL,
        4,
        180,
        'active'
    )
ON CONFLICT (sku) DO NOTHING;

-- 3. SEED PELANGGAN DUMMY
INSERT INTO public.customers (id, name, email, phone)
VALUES
    ('u1111111-1111-1111-1111-111111111111', 'Clara Vania', 'clara.vania@example.com', '+6281234567891'),
    ('u2222222-2222-2222-2222-222222222222', 'Rian Pratama', 'rian.pratama@example.com', '+6281987654321'),
    ('u3333333-3333-3333-3333-333333333333', 'Stephanie Aurelia', 'stephanie@example.com', '+6285678901234')
ON CONFLICT (email) DO NOTHING;

-- 4. SEED SAMPLE ORDER
INSERT INTO public.orders (id, customer_id, status, shipping_name, shipping_phone, shipping_address, subtotal, shipping_cost, total)
VALUES
    (
        'o1111111-1111-1111-1111-111111111111',
        'u1111111-1111-1111-1111-111111111111',
        'completed',
        'Clara Vania',
        '+6281234567891',
        'Jl. Kemang Raya No. 45, Jakarta Selatan 12730',
        760000,
        25000,
        785000
    )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.order_items (id, order_id, product_id, product_name, quantity, unit_price, subtotal)
VALUES
    (
        gen_random_uuid(),
        'o1111111-1111-1111-1111-111111111111',
        'p1111111-1111-1111-1111-111111111111',
        'Angel Silk Essential Shirt',
        2,
        380000,
        760000
    )
ON CONFLICT (id) DO NOTHING;
