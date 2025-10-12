# Setup Supabase Database

Panduan setup Supabase untuk project ini.

## 1. Buat Project Supabase

1. Buka [Supabase Dashboard](https://supabase.com/dashboard)
2. Klik **New Project**
3. Isi:
   - **Project Name**: Nama project kamu
   - **Database Password**: Password database (simpan baik-baik)
   - **Region**: Pilih region terdekat
4. Tunggu sampai project selesai dibuat (~2 menit)

## 2. Ambil API Keys

1. Di dashboard project, buka **Settings** → **API**
2. Copy 3 values ini:
   - **Project URL** → untuk `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → untuk `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → untuk `SUPABASE_SERVICE_ROLE_KEY`

## 3. Update File `.env`

Paste values yang sudah dicopy ke file `.env`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ADMIN_PASSWORD=password_kuat_kamu
```

## 4. Jalankan Database Migrations

1. Di Supabase Dashboard, buka **SQL Editor**
2. Klik **New query**
3. Copy isi file dari folder `supabase/migrations/` satu per satu
4. Jalankan migrations sesuai urutan:

### Migration 1: `20250717134952_damp_spire.sql`
```sql
-- Copy isi file ini dan paste di SQL Editor
-- Klik RUN
```

### Migration 2: `20251012131454_create_products_table.sql`
```sql
-- Copy isi file ini dan paste di SQL Editor
-- Klik RUN
```

### Migration 3: `20251012135439_update_products_rls_policy.sql`
```sql
-- Copy isi file ini dan paste di SQL Editor
-- Klik RUN
```

## 5. Verifikasi Database

1. Buka **Table Editor** di Supabase Dashboard
2. Cek ada table `products`
3. Coba insert data test untuk verifikasi RLS policies berjalan

## 6. Jalankan Project

```bash
npm install
npm run dev
```

Project siap digunakan dengan Supabase kamu sendiri!

## Troubleshooting

### Error: "Invalid API key"
- Pastikan API keys sudah benar dicopy
- Jangan ada spasi atau newline di `.env`

### Error: "relation does not exist"
- Migrations belum dijalankan
- Jalankan migrations di SQL Editor sesuai urutan

### Error: "permission denied"
- RLS policies belum aktif
- Pastikan migration ke-3 sudah dijalankan
