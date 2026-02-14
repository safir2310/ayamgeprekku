# ✅ Database Vercel Postgres Auto-Fix Ready!

## 🎉 Script Otomatis Sudah Siap!

Script otomatis untuk memperbaiki database Vercel Postgres sudah tersedia di GitHub:

✅ **fix-vercel-db.sh** - Script otomatis via Vercel API
✅ **VERCEL_DB_AUTO_FIX.md** - Panduan lengkap

---

## 📋 Cara Menggunakan (DI KOMPUTER LOKAL)

### Step 1: Clone/Pull Latest Code

```bash
# Clone jika belum ada
git clone https://github.com/safir2310/ayamgeprekku.git
cd ayamgeprekku

# Atau pull jika sudah ada
git pull origin master
```

### Step 2: Setup Token Vercel

Buat file `.vercel-token.env` di root project:

```env
VERCEL_TOKEN=your_vercel_token_here
```

**Get token dari**: https://vercel.com/account/tokens

### Step 3: Install Dependencies

```bash
bun install
```

### Step 4: Jalankan Script

```bash
bash fix-vercel-db.sh
```

---

## 🔍 Apa yang Dilakukan Script?

### Proses Otomatis:

1. ✅ Validasi Token Vercel
2. ✅ Cari Project di Vercel
3. ✅ Create Database via API
4. ✅ Tunggu Database Ready
5. ✅ Ambil Credentials dari API
6. ✅ Update .env File
7. ✅ Generate NEXTAUTH_SECRET Baru
8. ✅ Sync Database Schema

### Hasil Akhir:

- ✅ `.env` diupdate dengan Vercel Postgres credentials
- ✅ NEXTAUTH_SECRET baru digenerate dan ditampilkan
- ✅ Database `ayamgeprekku` dibuat di Vercel
- ✅ Schema ter-sync ke database
- ✅ Semua tabel dibuat
- ✅ Database siap untuk deployment

---

## 🎯 Langkah Selanjutnya

### Setelah Script Berjalan:

#### 1. Copy NEXTAUTH_SECRET

Script akan menampilkan NEXTAUTH_SECRET yang digenerate. Copy secret tersebut.

#### 2. Tambahkan ke Vercel

1. Buka: https://vercel.com/dashboard
2. Pilih project Anda
3. Settings → Environment Variables
4. Add New:
   - Name: `NEXTAUTH_SECRET`
   - Value: Paste NEXTAUTH_SECRET dari script output
   - Environments: Production, Preview, Development
5. Save

#### 3. Deploy

1. Deployments tab → Redeploy
2. Tunggu deployment selesai (± 2-3 menit)

#### 4. Set NEXTAUTH_URL

Setelah deployment selesai:

1. Copy production URL (contoh: `https://ayamgeprekku.vercel.app`)
2. Edit NEXTAUTH_URL di Vercel Environment Variables:
   - Value: Production URL Anda
3. Save
4. Redeploy lagi

---

## 📊 Environment Variables

| Variable | Source | Purpose |
|----------|--------|---------|
| `POSTGRES_PRISMA_URL` | Vercel API (auto) | Database connection |
| `POSTGRES_URL_NON_POOLING` | Dari Prisma URL | For migrations |
| `POSTGRES_URL` | Vercel API (auto) | Backup connection |
| `NEXTAUTH_SECRET` | Generated | Auth security |
| `NEXTAUTH_URL` | Local/Manual | Auth callback |

---

## 🔍 Troubleshooting

### Error: "Invalid Vercel Token"

**Solusi:**
- Generate token baru: https://vercel.com/account/tokens
- Update `.vercel-token.env`
- Jalankan script lagi

### Error: "Project not found"

**Solusi:**
- Import project ke Vercel: https://vercel.com/new
- Pastikan nama project terdaftar

### Error: "Database already exists"

**Info:**
- Tidak ada masalah, database sudah dibuat
- Script akan melanjutkan dengan yang ada

---

## ✅ Checklist

### Prasyarat:
- [ ] Project cloned/pulled dari GitHub
- [ ] Vercel token siap
- [ ] Dependencies terinstall
- [ ] `.vercel-token.env` dibuat

### Eksekusi Script:
- [ ] Token valid
- [ ] Project ditemukan
- [ ] Database created/exists
- [ ] Credentials retrieved
- [ ] .env diupdate
- [ ] Schema synced

### Deployment:
- [ ] NEXTAUTH_SECRET ditambahkan ke Vercel
- [ ] Deployment berhasil
- [ ] NEXTAUTH_URL di-set
- [ ] Redeploy berhasil

---

## 🚀 Quick Start

```bash
# Di komputer lokal:

# 1. Pull latest
git pull origin master

# 2. Setup token
echo "VERCEL_TOKEN=your_vercel_token_here" > .vercel-token.env

# 3. Install
bun install

# 4. Run script
bash fix-vercel-db.sh
```

---

## 📚 File di GitHub

| File | Deskripsi |
|------|----------|
| `fix-vercel-db.sh` | Script otomatis ⭐ |
| `VERCEL_DB_AUTO_FIX.md` | Panduan lengkap |
| `VERCEL_LOGIN_FIX.md` | Troubleshooting login |
| `DEPLOYMENT_FINAL.md` | Deployment guide |

---

## 🎉 Summary

### Keunggulan Script Otomatis:

- ✅ Menggunakan Vercel API
- ✅ Tidak butuh interaksi manual
- ✅ Create database otomatis
- ✅ Setup credentials otomatis
- ✅ Sync schema otomatis
- ✅ Generate secret otomatis
- ✅ Backup .env otomatis

### Total Setup Time:

- Script eksekusi: 2-3 menit
- Add env ke Vercel: 2 menit
- Deploy: 2-3 menit
- Update URL: 2 menit
- **Total: 10-15 menit**

---

## 🚀 Ready!

Script otomatis sudah siap di GitHub!

**Jalankan di komputer lokal:**
```bash
git clone https://github.com/safir2310/ayamgeprekku.git
cd ayamgeprekku
# Setup token
bun install
bash fix-vercel-db.sh
```

**Database Vercel Postgres otomatis diperbaiki!** ✨
