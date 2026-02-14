# Setup Vercel Postgres untuk Ayam Geprek

## 🎯 Cara Paling Cepat (Otomatis)

Gunakan deployment script yang sudah disiapkan:

```bash
bash deploy-auto.sh
```

Script akan:
- ✅ Create Vercel Postgres database (prefix: ayamgeprekku)
- ✅ Add environment variables otomatis
- ✅ Generate NEXTAUTH_SECRET
- ✅ Sync database schema
- ✅ Deploy ke production

---

## 📋 Manual Setup (Jika Script Tidak Bisa)

### Step 1: Buat Database di Vercel

1. Login ke [Vercel Dashboard](https://vercel.com/dashboard)
2. Pilih project Anda
3. Masuk ke **Storage** tab
4. Klik **"Create Database"**
5. Pilih **Postgres**
6. Custom Prefix: `ayamgeprekku`
7. Region: **Singapore** (recommended untuk user Indonesia)
8. Klik **"Create Database"**

### Step 2: Get Environment Variables

Setelah database dibuat, Vercel akan otomatis add environment variables:

- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_URL`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_DATABASE`

### Step 3: Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Atau kunjungi: https://generate-secret.vercel.app/32

### Step 4: Add Environment Variables ke Vercel

1. Masuk ke **Settings** → **Environment Variables**
2. Klik **"Add New"**
3. Tambahkan:

   | Variable | Value |
   |-----------|---------|
   | `NEXTAUTH_SECRET` | Hasil dari step 3 |
   | `NEXTAUTH_URL` | Production URL deployment (nanti diisi) |

Environment variables database sudah otomatis di Vercel!

### Step 5: Deploy

1. Masuk ke tab **Deployments**
2. Klik **"Redeploy"**
3. Tunggu deployment selesai

### Step 6: Update NEXTAUTH_URL

1. Setelah deploy selesai, copy deployment URL
2. Masuk ke **Settings** → **Environment Variables**
3. Edit `NEXTAUTH_URL`:
   - Production: `https://ayamgeprekku.vercel.app`
4. Save
5. Redeploy

---

## 🔧 Local Development dengan Vercel Postgres

Jika ingin menggunakan Vercel Postgres untuk local development:

### Option 1: Pull dari Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Pull environment variables
vercel env pull .env.local

# Ini akan include Vercel Postgres credentials
```

### Option 2: Copy Manual dari Dashboard

1. Buka Vercel Dashboard → Settings → Environment Variables
2. Copy POSTGRES_ variables
3. Paste ke `.env` file lokal
4. Run: `bun run db:push`

---

## 📊 Database Information

| Property | Value |
|----------|--------|
| Provider | Vercel Postgres |
| Region | Singapore (sin1) |
| Database Prefix | ayamgeprekku |
| Connection | SSL Enabled |
| Pooling | Enabled (pgbouncer) |
| Connection Timeout | 15 seconds |

---

## 🔍 Troubleshooting

### Error: "Database connection failed"

**Solution:**
1. Cek environment variables di Vercel Dashboard
2. Pastikan semua POSTGRES_ variables ada
3. Verify database aktif di Storage tab

### Error: "NEXTAUTH_URL not configured"

**Solution:**
1. Add NEXTAUTH_SECRET di Vercel Environment Variables
2. Set NEXTAUTH_URL ke production URL
3. Redeploy

### Error: "Prisma Client error"

**Solution:**
1. Pastikan `prisma generate` berjalan di build
2. Cek postinstall script di package.json
3. Redeploy

---

## ✅ Checklist

### Sebelum Deployment:
- [ ] Vercel Postgres database created
- [ ] POSTGRES_ variables otomatis di Vercel
- [ ] NEXTAUTH_SECRET generated
- [ ] NEXTAUTH_URL set (after deployment)

### Setelah Deployment:
- [ ] Deployment successful
- [ ] Production URL accessible
- [ ] Database connected (test register user)
- [ ] Semua fitur berfungsi

---

## 🚀 Quick Start

### Deploy Otomatis:

```bash
bash deploy-auto.sh
```

### Deploy Manual:

1. Create database di Vercel Postgres
2. Environment variables otomatis di Vercel
3. Generate NEXTAUTH_SECRET
4. Add NEXTAUTH_SECRET dan NEXTAUTH_URL
5. Deploy

---

## 📚 Related Documentation

- **AUTO_DEPLOY_GUIDE.md** - Panduan deployment otomatis
- **DEPLOYMENT_GUIDE.md** - Panduan deployment lengkap
- **DEPLOYMENT_QUICK.txt** - Quick reference
- **.env.example** - Template environment variables

---

## 💡 Tips

### Database Management:

```bash
# View database
bunx prisma studio

# Sync schema changes
bun run db:push

# Create migration
bun run db:migrate --name your_changes
```

### Deployment Management:

```bash
# Check logs
npx vercel logs

# Redeploy
npx vercel --prod

# Open dashboard
npx vercel open
```

---

## 🎯 Summary

Project **AYAM GEPREK** sudah terkonfigurasi untuk:

- ✅ Vercel Postgres database
- ✅ Automatic environment variables setup
- ✅ One-command deployment
- ✅ Production-ready configuration

**Gunakan `bash deploy-auto.sh` untuk deploy cepat!** 🚀
