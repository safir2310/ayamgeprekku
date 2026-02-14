# Opsi 2: Migrasi ke Vercel Postgres

## ⚠️ Catatan Penting

Ini adalah opsi jika Anda ingin menggunakan **Vercel Postgres** bukannya **Prisma Cloud**.

**PERHATIAN:**
- Ini lebih kompleks
- Perlu migrasi data (jika ada data di Prisma Cloud)
- Perlu re-sync schema

**Rekomendasi:** Gunakan Prisma Cloud (Opsi 1) untuk deployment lebih cepat dan mudah.

---

## 🎯 Apa Perbedaan Prisma Cloud vs Vercel Postgres?

| Feature | Prisma Cloud | Vercel Postgres |
|---------|--------------|-----------------|
| Integration | Bekerja dengan Vercel | Native Vercel integration |
| Setup | Sudah siap | Perlu create database |
| Performance | Good | Good (dengan connection pooling) |
| Management | Prisma Dashboard | Vercel Dashboard |
| Pricing | Free tier available | Free tier available |
| Accelerate | Included | Tidak included |

**Kesimpulan:** Keduanya bagus. Gunakan yang sudah ada (Prisma Cloud) untuk deployment lebih cepat.

---

## 🔄 Jika Tetap Ingin Migrasi ke Vercel Postgres

### Step 1: Buat Database di Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Masuk ke tab **Storage**
4. Klik **"Create Database"**
5. Pilih **Postgres**
6. Custom Prefix: `ayamgeprekku`
7. Pilih region (Singapore)
8. Klik **"Create Database"**

### Step 2: Get Environment Variables dari Vercel

Setelah database dibuat, Vercel akan otomatis add environment variables:

- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_URL`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_DATABASE`

**Copy semua ini.**

### Step 3: Update .env File

Ganti semua environment variables di `.env` dengan yang baru dari Vercel:

```env
# Vercel Postgres Connection Strings
POSTGRES_URL_NON_POOLING="YOUR_VERCEL_POSTGRES_NON_POOLING_URL"
POSTGRES_PRISMA_URL="YOUR_VERCEL_POSTGRES_PRISMA_URL"
POSTGRES_URL="YOUR_VERCEL_POSTGRES_URL"

# Prisma Accelerate (jika ingin pakai)
PRISMA_ACCELERATE_URL="YOUR_ACCELERATE_URL"

# Auth
NEXTAUTH_SECRET="YOUR_SECRET_KEY"
NEXTAUTH_URL="http://localhost:3000"
```

### Step 4: Sync Schema ke Vercel Postgres

```bash
# Push schema ke database baru
bun run db:push
```

Ini akan membuat semua tabel di Vercel Postgres.

### Step 5: (Opsional) Migrasi Data dari Prisma Cloud

Jika ada data di Prisma Cloud yang ingin dipindahkan:

#### Option A: Export dari Prisma Cloud, Import ke Vercel Postgres

1. **Export dari Prisma Cloud:**
   ```bash
   # Install pg_dump jika belum ada
   brew install postgresql  # Mac
   # atau
   sudo apt-get install postgresql-client  # Linux

   # Export data
   PGPASSWORD='sk_OxeMNEvg4SxBP76Kwv6zt' pg_dump -h db.prisma.io -U df1f6bb92f9f575ea1d870a67fb2c19f2b50cd9dfb9056cb1561c2f46c721122 -d postgres > prisma_cloud_backup.sql
   ```

2. **Import ke Vercel Postgres:**
   ```bash
   # Import ke Vercel Postgres
   PGPASSWORD='YOUR_VERCEL_POSTGRES_PASSWORD' psql -h YOUR_VERCEL_HOST -U YOUR_VERCEL_USER -d verceldb < prisma_cloud_backup.sql
   ```

#### Option B: Migrasi dengan Script Custom

Buat script migrasi custom di Next.js:
- Read dari Prisma Cloud
- Write ke Vercel Postgres
- Handle data relationships

#### Option C: Fresh Start (RECOMMENDED untuk Testing)

Untuk production pertama kali, cukup mulai fresh:
- Schema ter-sync
- Tidak ada legacy data
- Semua bersih

### Step 6: Test Koneksi

```bash
# Generate Prisma Client
bun run db:generate

# Test connection
bun run db:push

# Buka Prisma Studio
bunx prisma studio
```

Cek apakah semua tabel muncul di Vercel Postgres.

### Step 7: Deploy ke Vercel

Environment variables otomatis ada di Vercel (step 2), tinggal deploy:

```bash
# Push ke GitHub
git add .
git commit -m "feat: migrate to Vercel Postgres"
git push origin master

# Deploy otomatis di Vercel
```

Atau gunakan deployment script:

```bash
bash deploy-vercel.sh
```

---

## 📋 Checklist Migrasi

### Sebelum Migrasi:
- [ ] Backup data di Prisma Cloud (jika ada)
- [ ] Create Vercel Postgres database
- [ ] Copy environment variables dari Vercel

### Selama Migrasi:
- [ ] Update .env dengan Vercel Postgres credentials
- [ ] Run `bun run db:push` untuk sync schema
- [ ] Test connection dengan Prisma Studio
- [ ] (Opsional) Migrasi data

### Setelah Migrasi:
- [ ] Deploy ke Vercel
- [ ] Test semua fitur di production
- [ ] Verifikasi database di Vercel Dashboard
- [ ] Monitor query performance

---

## ⚠️ Risiko Migrasi

### Database Empty
Setelah migrasi, database akan KOSONG (kecuali Anda migrasi data manual).

### Data Loss
Jika salah migrasi data, bisa kehilangan data dari Prisma Cloud.

### Downtime
Saat migrasi, aplikasi akan tidak bisa diakses jika Anda langsung switch.

**Solusi:**
1. Backup data sebelum migrasi
2. Test di environment staging dulu
3. Migrasi di jam sepi user

---

## 🔧 Troubleshooting Migrasi

### Error: "Connection timeout"

**Solution:**
- Cek environment variables benar
- Pastikan database di Vercel aktif
- Cek network connectivity

### Error: "Schema sync failed"

**Solution:**
- Hapus tabel yang ada (reset database)
- Run `bun run db:push` lagi
- Atau `bun run db:reset` (WARNING: delete semua data)

### Error: "Migration data failed"

**Solution:**
- Cek schema sama di kedua database
- Pastikan data relationships valid
- Migrasi bertahap per tabel

---

## 📊 Comparison: Opsi 1 vs Opsi 2

| Aspect | Opsi 1 (Prisma Cloud) | Opsi 2 (Vercel Postgres) |
|--------|------------------------|---------------------------|
| **Setup Time** | 5 menit | 15-30 menit |
| **Complexity** | Mudah | Sedang |
| **Data Migration** | Tidak perlu | Perlu jika ada data |
| **Learning Curve** | Rendah | Sedang |
| **Performance** | Good | Good |
| **Integration** | Bagus | Excellent (native Vercel) |
| **Management** | Prisma Dashboard | Vercel Dashboard |

---

## 🎯 Rekomendasi Saya

### Gunakan Opsi 1 (Prisma Cloud) jika:
- ✅ Database masih kosong/tidak ada data penting
- ✅ Ingin deploy cepat
- ✅ Tidak butuh native Vercel integration
- ✅ Sudah terkoneksi dan jalan

### Gunakan Opsi 2 (Vercel Postgres) jika:
- ✅ Butuh native Vercel integration
- ✅ Ingin semua di satu dashboard (Vercel)
- ✅ Siap untuk migrasi data yang kompleks
- ✅ Database masih fresh/tidak ada data

---

## 🚀 Quick Start: Mana yang Dipilih?

### Lanjut dengan Prisma Cloud (Opsi 1):
```bash
# Jalankan deployment script
bash deploy-vercel.sh
```

### Lanjut dengan Vercel Postgres (Opsi 2):
1. Follow steps di atas (1-7)
2. Create database di Vercel Storage
3. Update .env
4. Migrasi data (opsional)
5. Deploy

---

**Saya sangat merekomendasikan Opsi 1 (Prisma Cloud)** untuk deployment cepat dan mudah! 🚀

Tetapi jika Anda ingin Opsi 2, ikuti panduan di atas dengan hati-hati.

Ada pertanyaan? Silakan tanya! 😊
