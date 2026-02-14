# 🚀 Panduan Deployment Otomatis ke Vercel Postgres

## ⚠️ JALANKAN DI KOMPUTER LOKAL ANDA!

Script deployment ini **HARUS** dijalankan di komputer lokal Anda.

---

## 📋 Prasyarat

Sebelum memulai, pastikan:

- [ ] Node.js terinstall
- [ ] Bun atau npm terinstall
- [ ] Git terinstall
- [ ] Vercel account (sudah ada)
- [ ] Vercel Token (bisa generate di: https://vercel.com/account/tokens)

---

## 🎯 Langkah 1: Clone Project

```bash
# Clone dari GitHub
git clone https://github.com/safir2310/ayamgeprekku.git

# Masuk ke folder
cd ayamgeprekku
```

---

## 🎯 Langkah 2: Setup Token

### Get Vercel Token:

1. Buka: https://vercel.com/account/tokens
2. Klik **"Create Token"**
3. Beri nama: "Ayam Geprek Deployment"
4. Klik **"Create"**
5. Copy token (format: `vcp_xxxxxxxx`)

### Add Token ke Project:

1. Buat file `.vercel-token.env` di folder project
2. Tambahkan baris ini:

```env
VERCEL_TOKEN=vcp_xxxxxxxx
```

**Ganti `vcp_xxxxxxxx` dengan token Anda!**

3. Save file

---

## 🎯 Langkah 3: Install Dependencies

```bash
# Jika menggunakan Bun
bun install

# Jika menggunakan npm
npm install
```

---

## 🎯 Langkah 4: Jalankan Script Otomatis

**Satu command untuk semuanya:**

```bash
bash deploy-auto.sh
```

**Script ini akan:**

1. ✅ Login ke Vercel menggunakan token
2. ✅ Link project ke Vercel
3. ✅ Create database Vercel Postgres (prefix: ayamgeprekku)
4. ✅ Get environment variables dari Vercel
5. ✅ Generate NEXTAUTH_SECRET baru
6. ✅ Add environment variables ke Vercel
7. ✅ Update .env file lokal
8. ✅ Sync database schema
9. ✅ Deploy ke production
10. ✅ Set NEXTAUTH_URL

**Total waktu: 10-15 menit**

---

## 🎯 Langkah 5: Verifikasi Deployment

Setelah script selesai:

1. Copy deployment URL yang ditampilkan
2. Buka di browser
3. Test aplikasi:
   - Register user baru
   - Login
   - Cek semua fitur

---

## 🔍 Troubleshooting

### Error: ".vercel-token.env file not found"

**Solution:**
1. Pastikan file `.vercel-token.env` ada
2. Buka file tersebut
3. Tambahkan: `VERCEL_TOKEN=your_token_here`
4. Save dan jalankan ulang

### Error: "Database already exists"

**Solution:**
1. Masuk ke Vercel Dashboard → Storage
2. Hapus database "ayamgeprekku" jika sudah ada
3. Jalankan script lagi

### Error: "Deployment failed"

**Solution:**
1. Cek logs di Vercel Dashboard → Deployments
2. Pastikan dependencies terinstall
3. Run `bun run db:generate` manual

---

## 📊 Checklist

Before Running Script:
- [ ] Project cloned
- [ ] Token Vercel didapat
- [ ] File `.vercel-token.env` created
- [ ] Token ditambahkan ke file
- [ ] Dependencies installed

After Script:
- [ ] Database Vercel Postgres created
- [ ] Environment variables added
- [ ] App deployed
- [ ] Production URL accessible
- [ ] Register user works
- [ ] Database connected

---

## 🔐 Security

- ✅ Token hanya di file lokal (`.vercel-token.env`)
- ✅ File di `.gitignore` (tidak push ke GitHub)
- ✅ NEXTAUTH_SECRET digenerate otomatis
- ✅ Credentials database di Vercel Dashboard

---

## 📝 Environment Variables

| Variable | Purpose |
|-----------|---------|
| `POSTGRES_PRISMA_URL` | Database connection |
| `POSTGRES_URL_NON_POOLING` | For migrations |
| `POSTGRES_URL` | Backup connection |
| `NEXTAUTH_SECRET` | Auth security |
| `NEXTAUTH_URL` | Auth callback |

---

## 🚀 Quick Commands

```bash
# View database
bunx prisma studio

# Check logs
npx vercel logs

# Redeploy
npx vercel --prod
```

---

## 📚 Documentation Tambahan

- **DEPLOYMENT_GUIDE.md** - Panduan lengkap
- **DEPLOYMENT_QUICK.txt** - Quick reference
- **VERCEL_SETUP.md** - Setup manual

---

## 🎉 Ready to Deploy?

Di komputer lokal Anda:

```bash
bash deploy-auto.sh
```

**Aplikasi Anda akan live dalam 15 menit!** 🚀
