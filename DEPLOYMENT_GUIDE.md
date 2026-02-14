# Deployment Guide - Otomatis ke Vercel

## 🎯 Cara Cepat Deploy ke Vercel (Dengan Prisma Cloud)

### Prasyarat:
- [x] Database Prisma Cloud sudah terkoneksi
- [x] Project sudah di GitHub
- [ ] Vercel account

---

## 🚀 Method 1: Script Otomatis (RECOMMENDED)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login ke Vercel

```bash
vercel login
```

Ikuti instruksi di browser untuk login.

### Step 3: Jalankan Deployment Script

```bash
bash deploy-vercel.sh
```

Script ini akan OTOMATIS:
- ✅ Cek Vercel CLI
- ✅ Login ke Vercel
- ✅ Link project
- ✅ Add semua environment variables:
  - `POSTGRES_PRISMA_URL`
  - `POSTGRES_URL_NON_POOLING`
  - `POSTGRES_URL`
  - `NEXTAUTH_SECRET` (generate baru)
- ✅ Deploy ke production

### Step 4: Update NEXTAUTH_URL

Setelah deployment selesai:

1. Buka Vercel Dashboard: https://vercel.com/dashboard
2. Pilih project `ayamgeprekku`
3. Masuk ke **Settings** → **Environment Variables**
4. Edit `NEXTAUTH_URL`:
   - Production: Masukkan URL deployment Anda
   - Contoh: `https://ayamgeprekku.vercel.app`
5. Save

### Step 5: Redeploy

1. Masuk ke tab **Deployments**
2. Klik **"Redeploy"**
3. Tunggu deployment selesai

---

## 🚀 Method 2: Manual via Vercel Dashboard

### Step 1: Import Project di Vercel

1. Buka https://vercel.com/new
2. Pilih repository `safir2310/ayamgeprekku`
3. Klik **"Import"**

### Step 2: Add Environment Variables

1. Masuk ke **Settings** → **Environment Variables**
2. Klik **"Add New"** untuk setiap variabel:

#### Environment Variables yang Dibutuhkan:

| Variable Name | Value | Environment |
|--------------|-------|-------------|
| `POSTGRES_PRISMA_URL` | `postgres://df1f6bb92f9f575ea1d870a67fb2c19f2b50cd9dfb9056cb1561c2f46c721122:sk_OxeMNEvg4SxBP76Kwv6zt@db.prisma.io:5432/postgres?sslmode=require&pgbouncer=true&connect_timeout=15` | Production, Preview, Development |
| `POSTGRES_URL_NON_POOLING` | `postgres://df1f6bb92f9f575ea1d870a67fb2c19f2b50cd9dfb9056cb1561c2f46c721122:sk_OxeMNEvg4SxBP76Kwv6zt@db.prisma.io:5432/postgres?sslmode=require` | Production, Preview, Development |
| `POSTGRES_URL` | `postgres://df1f6bb92f9f575ea1d870a67fb2c19f2b50cd9dfb9056cb1561c2f46c721122:sk_OxeMNEvg4SxBP76Kwv6zt@db.prisma.io:5432/postgres?sslmode=require&pgbouncer=true` | Production, Preview, Development |
| `NEXTAUTH_SECRET` | Generate baru dengan `openssl rand -base64 32` | Production, Preview, Development |
| `NEXTAUTH_URL` | Kosong dulu, isi setelah deploy | Production |

### Step 3: Deploy

1. Masuk ke tab **Deployments**
2. Klik **"Redeploy"** atau tunggu deployment otomatis
3. Tunggu ±2-3 menit

### Step 4: Update NEXTAUTH_URL

1. Copy URL deployment dari Vercel (contoh: `https://ayamgeprekku.vercel.app`)
2. Masuk ke **Settings** → **Environment Variables**
3. Edit `NEXTAUTH_URL`:
   - Production: `https://ayamgeprekku.vercel.app`
4. Save dan **Redeploy**

---

## ✅ Checklist Deployment

### Sebelum Deployment:
- [ ] Vercel CLI terinstall
- [ ] Login ke Vercel
- [ ] Project terhubung ke GitHub
- [ ] Database Prisma Cloud terkoneksi

### Environment Variables:
- [ ] POSTGRES_PRISMA_URL ditambahkan
- [ ] POSTGRES_URL_NON_POOLING ditambahkan
- [ ] POSTGRES_URL ditambahkan
- [ ] NEXTAUTH_SECRET digenerate dan ditambahkan
- [ ] NEXTAUTH_URL diupdate setelah deploy

### Setelah Deployment:
- [ ] Deployment berhasil (green check)
- [ ] App bisa diakses di production URL
- [ ] Login/register berfungsi
- [ ] Database terkoneksi (coba register user)
- [ ] Fitur lain berfungsi (products, orders, point redemption)

---

## 🧪 Testing Production

### Test Database Connection:
1. Buka URL deployment Anda
2. Register new user
3. Login dengan user tersebut
4. Coba:
   - Tambah produk (admin)
   - Buat order
   - Tukar poin
   - Cek wallet

### Check Logs:
1. Masuk ke Vercel Dashboard
2. Klik deployment terakhir
3. Tab **Build Logs** - untuk build errors
4. Tab **Function Logs** - untuk runtime errors

---

## 🔧 Troubleshooting

### Error: "Database connection failed"

**Solution:**
1. Cek environment variables di Vercel Dashboard
2. Pastikan semua 3 POSTGRES variables ada dan benar
3. Cek database aktif di Prisma Cloud Dashboard

### Error: "NEXTAUTH_URL is not configured"

**Solution:**
1. Set NEXTAUTH_URL di Vercel Environment Variables
2. Redeploy
3. Pastikan URL menggunakan HTTPS

### Error: "Build failed"

**Solution:**
1. Cek build logs di Vercel Dashboard
2. Pastikan `prisma generate` berjalan (ada di postinstall script)
3. Cek dependencies di package.json

### Deployment berhasil tapi fitur tidak berfungsi

**Solution:**
1. Cek function logs untuk database queries
2. Pastikan Prisma Client ter-generate dengan benar
3. Restart deployment (click "Redeploy")

---

## 📊 Monitoring Production

### Vercel Dashboard:
- **Deployments**: Lihat history deployment
- **Analytics**: Traffic dan performance
- **Logs**: Build dan function logs
- **Settings**: Environment variables dan project config

### Prisma Cloud Dashboard:
- **Database metrics**: Query performance
- **Database usage**: Storage dan query limits
- **Connection pool**: Status koneksi

### Prisma Studio:
```bash
bunx prisma studio
```
Untuk melihat data di production database.

---

## 🔄 Update Production

### Code Update:
```bash
# Make changes
git add .
git commit -m "feat: new feature"
git push origin master

# Deployment otomatis di Vercel (jika auto-deploy enabled)
```

### Schema Update:
```bash
# 1. Update prisma/schema.prisma
# 2. Create migration
bun run db:migrate --name update_schema

# 3. Push to GitHub
git add .
git commit -m "db: update schema"
git push origin master

# 4. Redeploy di Vercel jika tidak auto-deploy
```

### Environment Variable Update:
1. Masuk ke Vercel Dashboard
2. Settings → Environment Variables
3. Edit atau tambah variable
4. Save dan Redeploy

---

## 📝 Summary

### Method 1 (Script Otomatis):
- ✅ Lebih cepat
- ✅ Otomatis add env vars
- ✅ Generate NEXTAUTH_SECRET otomatis
- ❌ Memerlukan Vercel CLI

### Method 2 (Manual):
- ✅ Tidak perlu CLI
- ✅ Lebih kontrol
- ✅ Bisa cek sebelum save
- ❌ Lebih manual

---

## 🎯 Rekomendasi Saya:

**Gunakan Method 1 (Script Otomatis)** karena:
- ✅ Semua otomatis
- ✅ Kurang risk human error
- ✅ NEXTAUTH_SECRET otomatis digenerate
- ✅ Hanya satu command: `bash deploy-vercel.sh`

---

**Siap untuk deploy?** 🚀

Jalankan script dan aplikasi Anda akan live dalam 5 menit!

```bash
bash deploy-vercel.sh
```
