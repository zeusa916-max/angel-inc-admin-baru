/**
 * 🕊️ ANGEL INC. — Supabase Connection & Health Check Script
 * Jalankan via: npm run db:check
 */

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
let env = { ...process.env };

if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const [key, ...val] = trimmed.split('=');
      env[key.trim()] = val.join('=').trim();
    }
  });
}

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('\n============================================================');
console.log('🕊️  ANGEL INC. — SUPABASE DIAGNOSTIC & HEALTH CHECK');
console.log('============================================================\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Variabel Supabase tidak ditemukan di .env.local!');
  console.log('👉 Pastikan file .env.local berisi:');
  console.log('   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co');
  console.log('   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...\n');
  process.exit(1);
}

console.log(`🔗 URL Supabase : ${supabaseUrl}`);
console.log(`🔑 Anon Key     : ${supabaseKey.slice(0, 12)}...${supabaseKey.slice(-6)}\n`);

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

async function checkDatabase() {
  const requiredTables = [
    'profiles',
    'categories',
    'products',
    'product_images',
    'customers',
    'orders',
    'order_items',
  ];

  let hasErrors = false;
  let isNetworkError = false;

  console.log('📋 Memeriksa Ketersediaan Tabel Database:');
  for (const table of requiredTables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });

      if (error) {
        console.log(`   ❌ Tabel "${table}": Gagal (${error.message || error.code})`);
        hasErrors = true;
        if (error.message && error.message.includes('fetch failed')) {
          isNetworkError = true;
        }
      } else {
        console.log(`   ✅ Tabel "${table}": OK (${count ?? 0} data)`);
      }
    } catch (err) {
      console.log(`   ❌ Tabel "${table}": Error koneksi (${err.message})`);
      hasErrors = true;
      isNetworkError = true;
    }
  }

  console.log('\n🗂️  Memeriksa Supabase Storage Bucket:');
  try {
    const { data: buckets, error: bucketError } = await supabase.storage.listBuckets();
    if (bucketError) {
      console.log(`   ⚠️  Storage: ${bucketError.message}`);
    } else if (buckets) {
      const hasProductImages = buckets.some((b) => b.id === 'product-images' || b.name === 'product-images');
      if (hasProductImages) {
        console.log('   ✅ Bucket "product-images": Ditemukan dan siap digunakan.');
      } else {
        console.log('   ⚠️  Bucket "product-images": Belum dibuat.');
      }
    }
  } catch (err) {
    console.log(`   ⚠️  Storage check warning: ${err.message}`);
  }

  console.log('\n============================================================');
  if (isNetworkError) {
    console.log('⚠️  KONEKSI HOST SUPABASE TIDAK TERJANGKAU:');
    console.log('👉 URL pada .env.local (' + supabaseUrl + ') belum aktif atau tidak dapat diakses.');
    console.log('👉 Silakan buat proyek gratis di https://supabase.com/ dan update URL + Key di .env.local.');
  } else if (hasErrors) {
    console.log('💡 SARAN PERBAIKAN:');
    console.log('1. Buka dashboard Supabase -> SQL Editor.');
    console.log('2. Copy & Paste seluruh isi file "supabase/schema.sql".');
    console.log('3. Klik tombol "Run" untuk menginisialisasi seluruh tabel.');
    console.log('4. (Opsional) Jalankan "supabase/seed.sql" untuk sample data.');
  } else {
    console.log('🎉 SEMUA KONEKSI & TABEL SUPABASE SIAP DIGUNAKAN (READY TO CODE)!');
  }
  console.log('============================================================\n');
}

checkDatabase().catch((e) => {
  console.error('Fatal check error:', e);
});
