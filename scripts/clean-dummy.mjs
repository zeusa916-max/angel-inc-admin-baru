/**
 * 🕊️ ANGEL INC. — Clean Dummy Database Records
 * Jalankan via: npm run db:clean
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
console.log('🧹 ANGEL INC. — PEMBERSIHAN DUMMY DATA DATABASE');
console.log('============================================================\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ ERROR: Variabel Supabase tidak ditemukan di .env.local!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function cleanData() {
  console.log('⏳ Menghapus data order items & orders...');
  await supabase.from('order_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('orders').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('⏳ Menghapus data pelanggan dummy...');
  await supabase.from('customers').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('⏳ Menghapus foto produk & produk...');
  await supabase.from('product_images').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('⏳ Menghapus kategori produk...');
  await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

  console.log('\n✅ BERHASIL: Seluruh data dummy telah dibersihkan dari database Supabase!');
  console.log('============================================================\n');
}

cleanData().catch((e) => {
  console.error('Error saat pembersihan:', e.message);
});
