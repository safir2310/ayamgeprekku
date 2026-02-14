# ⚠️ Perlu Bantuan Manual Setup Vercel Postgres

## 🔍 Masalah yang Terjadi

Script otomatis mengalami masalah saat mencari project ID di Vercel API. Ini kemungkinan disebabkan oleh:

1. Project belum di-link dengan benar
2. Project ID tidak cocok dengan yang ada
3. API response format berbeda

## ✅ Solusi: Manual Setup di Vercel Dashboard

Karena keterbatasan API Vercel, setup paling andal dan terpercaya adalah via **Vercel Dashboard**.

---

## 📋 Langkah-Langkah Manual Setup

### Step 1: Buka Vercel Dashboard

1. Kunjungi: https://vercel.com/dashboard
2. Pilih project Anda yang sudah di-import
3. Atau import dari GitHub jika belum:
   - Buka: https://vercel.com/new
   - Import: `safir2310/ayamgeprekku`

### Step 2: Buat Vercel Postgres Database

1. Klik **Storage** tab
2. Klik **"Create Database"**
3. Pilih **Postgres**
4. Custom Prefix: `ayamgeprekku`
5. Region: **Singapore** (rekomendasi untuk user Indonesia)
6. Klik **"Create Database"**

Setelah database dibuat, Vercel akan OTOMATIS menambahkan environment variables:
- ✅ `POSTGRES_PRISMA_URL`
- ✅ `POSTGRES_URL_NON_POOLING`
- ✅ `POSTGRES_URL`
- ✅ `POSTGRES_USER`
- ✅ `POSTGRES_PASSWORD`
- ✅ `POSTGRES_HOST`
- ✅ `POSTGRES_DATABASE`

### Step 3: Generate NEXTAUTH_SECRET

Jalankan salah satu command ini:

```bash
openssl rand -base64 32
```

Copy hasil secret tersebut.

### Step 4: Tambah NEXTAUTH_SECRET ke Vercel

1. Masuk ke **Settings** → **Environment Variables**
2. Klik **"Add New"**
3. Isi:
   - Name: `NEXTAUTH_SECRET`
   - Value: (paste hasil dari step 3)
   - Environments: Production, Preview, Development
4. Klik **"Save"**

### Step 5: Deploy

1. Masuk ke tab **Deployments**
2. Klik **"Redeploy"**
3. Tunggu deployment selesai (± 2-3 menit)

### Step 6: Set NEXTAUTH_URL

Setelah deployment selesai:

1. Copy production URL dari Vercel Dashboard
   (contoh: `https://ayamgeprekku.vercel.app`)
2. Edit `NEXTAUTH_URL` di Environment Variables
   - Production: paste production URL
   - Preview: paste preview URL
3. Klik **"Save"**
4. Redeploy lagi

### Step 7: Test

1. Buka production URL
2. Register user baru
3. Coba login
4. Tambah produk (admin)
5. Test fitur lainnya

---

## 🎯 Checklist

- [ ] Project di-import ke Vercel
- [ ] Vercel Postgres database dibuat (prefix: ayamgeprekku)
- [ ] Database environment variables otomatis di Vercel
- [ ] NEXTAUTH_SECRET digenerate dan ditambahkan ke Vercel
- [ ] NEXTAUTH_URL di-set ke production URL
- [ ] Pertama deployment berhasil
- [ ] Production URL dapat diakses
- [ ] Register user berhasil
- [ ] Login berhasil
- [ ] Database terkoneksi

---

## 📝 NEXTAUTH_SECRET yang Perlu Anda

Generate dengan:
```bash
openssl rand -base64 32
```

Atau kunjungi:
https://generate-secret.vercel.app/32

---

## 🔍 Troubleshooting

### Error: "NEXTAUTH_URL is not configured"

**Solution:**
- NEXTAUTH_URL belum di-set di Vercel Environment Variables
- Setelah deploy, update NEXTAUTH_URL dengan production URL

### Error: "Database connection failed"

**Solution:**
- Cek database variables di Vercel Dashboard
- Pastikan semua ada dan benar
- Cek database aktif di Storage tab

### Error: "Project not found"

**Solution:**
- Pastikan project di-import ke Vercel
- Check project name di Vercel Dashboard

---

## 💡 Tips

### Setelah Database Siap:

Untuk development lokal dengan Vercel Postgres:

```bash
# Pull environment variables dari Vercel
npx vercel env pull .env.local

# Install dependencies
bun install

# Generate Prisma Client
bun run db:generate

# Sync schema ke database
bun run db:push
```

### Update Schema:

```bash
# 1. Edit prisma/schema.prisma

# 2. Push schema
bun run db:push

# 3. Commit dan push
git add .
git commit -m "db: update schema"
git push origin master

# 4. Vercel auto-deploy
```

---

## 🎯 Ringkasan

### Setup via Vercel Dashboard:
- ✅ Lebih andal
- ✅ Tidak ada masalah API/CLI
- ✅ Tidak butuh interaksi script
- ✅ Lebih kontrol
- ✅ Visual interface

### Total Waktu:
- Import: 2 menit
- Create database: 2 menit
- Add env vars: 3 menit
- Deploy: 3 menit
- **Total: 10 menit**

---

## 🚀 Quick Start

1. Buka: https://vercel.com/dashboard
2. Import/pilih project
3. Storage → Create Database → Postgres
4. Settings → Environment Variables → Add NEXTAUTH_SECRET
5. Deploy
6. Update NEXTAUTH_URL
7. Redeploy
8. Test

**Database Vercel Postgres siap dalam 10 menit!** 🎉

---

**Ada pertanyaan atau butuh bantuan lebih lanjut?** 😊
