# 🔍 Troubleshooting: Masalah Login di Vercel

## ❌ Problem: Login Gagal di Vercel Deployment

Jika Anda mengalami error saat login di deployment Vercel, kemungkinan besar masalahnya adalah:

### **NEXTAUTH_SECRET dan NEXTAUTH_URL belum dikonfigurasi dengan benar!**

---

## 🔍 Cek Masalah

### Issue 1: NEXTAUTH_SECRET

**Masalah:**
- NEXTAUTH_SECRET masih menggunakan default: `ayamgeprek-secret-key-change-in-production-2024`
- Secret terlalu pendek dan default
- Ini tidak aman dan bisa menyebabkan masalah auth

**Solusi:**
Gunakan NEXTAUTH_SECRET yang sudah digenerate:

```
PFuSppda5HDzQo4CpXADiViRWtCXSY/s4nqh3Xv2cWU=
```

### Issue 2: NEXTAUTH_URL

**Masalah:**
- NEXTAUTH_URL masih: `http://localhost:3000`
- Ini tidak berfungsi di production
- Auth callback akan gagal

**Solusi:**
NEXTAUTH_URL harus diset ke production URL Anda

---

## 📋 Langkah-Langkah Perbaikan

### Step 1: Tambahkan Environment Variables di Vercel

1. **Buka Vercel Dashboard:**
   - Kunjungi: https://vercel.com/dashboard

2. **Pilih Project:**
   - Klik project `ayamgeprekku`

3. **Masuk ke Settings:**
   - Klik tab **Settings**
   - Pilih menu **Environment Variables**

4. **Tambahkan NEXTAUTH_SECRET:**
   - Klik **"Add New"**
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**:
     ```
     PFuSppda5HDzQo4CpXADiViRWtCXSY/s4nqh3Xv2cWU=
     ```
   - **Environments**: Pilih semua: Production, Preview, Development
   - Klik **"Save"**

5. **Tambahkan NEXTAUTH_URL:**
   - Klik **"Add New"**
   - **Name**: `NEXTAUTH_URL`
   - **Value**: Production URL Anda
     - Jika belum deploy, kosongkan dulu
     - Setelah deploy, update dengan URL: `https://ayamgeprekku.vercel.app`
   - **Environments**: Pilih semua: Production, Preview, Development
   - Klik **"Save"**

### Step 2: Verifikasi Environment Variables di Vercel

Setelah menambahkan, pastikan ada di Vercel:

| Variable | Status | Value |
|----------|--------|-------|
| `NEXTAUTH_SECRET` | ✅ Tambahkan | `PFuSppda5HDzQo4CpXADiViRWtCXSY/s4nqh3Xv2cWU=` |
| `NEXTAUTH_URL` | ✅ Tambahkan | `https://ayamgeprekku.vercel.app` |
| `POSTGRES_PRISMA_URL` | ✅ Dari Vercel Postgres | (Otomatis) |
| `POSTGRES_URL_NON_POOLING` | ✅ Dari Vercel Postgres | (Otomatis) |
| `POSTGRES_URL` | ✅ Dari Vercel Postgres | (Otomatis) |

### Step 3: Redeploy Project

Setelah environment variables ditambahkan:

1. **Masuk ke tab Deployments:**
   - Klik menu **Deployments**
   - Lihat deployment terbaru

2. **Redeploy:**
   - Klik tombol **"Redeploy"**
   - Tunggu deployment selesai (± 2-3 menit)

### Step 4: Update NEXTAUTH_URL (Setelah Deployment)

Setelah deployment selesai:

1. **Copy Production URL:**
   - Dari Vercel Dashboard → tab terbaru
   - Contoh: `https://ayamgeprekku.vercel.app`

2. **Edit NEXTAUTH_URL:**
   - Settings → Environment Variables
   - Edit `NEXTAUTH_URL`
   - **Production**: `https://ayamgeprekku.vercel.app`
   - Klik **"Save"**

3. **Redeploy Lagi:**
   - Deployments → "Redeploy"
   - Tunggu selesai

---

## 🔍 Cek Masalah Login

Setelah perbaikan:

1. **Buka Production URL:**
   - Kunjungi: `https://ayamgeprekku.vercel.app`

2. **Test Register:**
   - Buka `/register`
   - Register user baru
   - Pastikan berhasil

3. **Test Login:**
   - Buka `/login`
   - Login dengan user yang baru register
   - Pastikan berhasil dan redirect ke dashboard

4. **Cek Browser Console:**
   - Tekan F12 untuk membuka Developer Tools
   - Lihat tab **Console** untuk error
   - Lihat tab **Network** untuk failed requests

---

## 📊 Environment Variables di Vercel Dashboard

Pastikan semua ini ada dan benar:

### Wajib:

| Variable | Purpose | Value |
|----------|---------|-------|
| `NEXTAUTH_SECRET` | Auth security | `PFuSppda5HDzQo4CpXADiViRWtCXSY/s4nqh3Xv2cWU=` |
| `NEXTAUTH_URL` | Auth callback | `https://ayamgeprekku.vercel.app` |

### Database (Otomatis dari Vercel Postgres):

| Variable | Purpose |
|----------|---------|
| `POSTGRES_PRISMA_URL` | Database connection |
| `POSTGRES_URL_NON_POOLING` | For migrations |
| `POSTGRES_URL` | Backup connection |
| `POSTGRES_USER` | Database user |
| `POSTGRES_PASSWORD` | Database password |
| `POSTGRES_HOST` | Database host |
| `POSTGRES_DATABASE` | Database name |

---

## 🔍 Troubleshooting Lebih Lanjut

### Masalah 1: Error di Console: "NEXTAUTH_URL is not configured"

**Solusi:**
- NEXTAUTH_URL belum di-set di Vercel
- Tambahkan di Environment Variables
- Redeploy

### Masalah 2: Error: "Database connection failed"

**Solusi:**
- Cek POSTGRES_ variables di Vercel
- Pastikan database Postgres sudah dibuat
- Pastikan semua ada dan benar

### Masalah 3: Error: "NEXTAUTH_SECRET is invalid"

**Solusi:**
- Gunakan NEXTAUTH_SECRET yang sudah digenerate:
  ```
  PFuSppda5HDzQo4CpXADiViRWtCXSY/s4nqh3Xv2cWU=
  ```
- JANGAN gunakan default value
- Pastikan secret cukup panjang (min 32 characters)

### Masalah 4: Redirect tidak berhasil

**Solusi:**
- NEXTAUTH_URL harus menggunakan HTTPS
- NEXTAUTH_URL harus full URL dengan domain
- Tidak boleh localhost di production

---

## ✅ Checklist Perbaikan

### Environment Variables:
- [ ] NEXTAUTH_SECRET ditambahkan di Vercel
- [ ] NEXTAUTH_SECRET menggunakan value yang digenerate
- [ ] NEXTAUTH_URL ditambahkan di Vercel
- [ ] NEXTAUTH_URL diset ke production URL
- [ ] Semua database variables ada (otomatis dari Vercel Postgres)
- [ ] Redeploy dilakukan

### Testing:
- [ ] Production URL dapat diakses
- [ ] Register user baru berhasil
- [ ] Login berhasil
- [ ] Tidak error di console
- [ ] Redirect ke dashboard berhasil

---

## 💡 Best Practices

### Environment Variables:
1. ✅ Gunakan NEXTAUTH_SECRET yang cukup panjang (min 32 chars)
2. ✅ Gunakan NEXTAUTH_SECRET yang unik dan random
3. ✅ JANGAN gunakan default atau short secrets
4. ✅ NEXTAUTH_URL harus full URL dengan HTTPS
5. ✅ Production environment variables di-set di Vercel, bukan di code

### Deployment:
1. ✅ Selalu redeploy setelah mengubah environment variables
2. ✅ Cek deployment logs untuk error
3. ✅ Test di production setelah setiap deploy

---

## 🚀 Quick Fix

### Satu-Satunya:

1. **Buka Vercel Dashboard**:
   - https://vercel.com/dashboard → Settings → Environment Variables

2. **Add/Edit NEXTAUTH_SECRET:**
   ```
   Name: NEXTAUTH_SECRET
   Value: PFuSppda5HDzQo4CpXADiViRWtCXSY/s4nqh3Xv2cWU=
   ```

3. **Add/Update NEXTAUTH_URL:**
   ```
   Name: NEXTAUTH_URL
   Value: https://ayamgeprekku.vercel.app
   ```

4. **Redeploy**:
   - Deployments → "Redeploy"

5. **Test Login**:
   - Buka production URL
   - Register dan login

---

## 📝 Generate NEXTAUTH_SECRET Baru

Jika ingin generate secret baru:

```bash
openssl rand -base64 32
```

Atau kunjungi:
https://generate-secret.vercel.app/32

---

## 🎯 Summary

### Masalah Utama:
❌ NEXTAUTH_SECRET masih default value
❌ NEXTAUTH_URL masih http://localhost:3000

### Solusi:
✅ Tambahkan NEXTAUTH_SECRET yang digenerate ke Vercel
✅ Set NEXTAUTH_URL ke production URL di Vercel
✅ Redeploy project

### Expected Result:
✅ Login berhasil di production
✅ Register user berhasil
✅ Tidak error di console
✅ Redirect ke dashboard berhasil

---

## 💬 Bantuan

Jika masih ada masalah:

1. **Cek Deployment Logs:**
   - Vercel Dashboard → Deployments → Klik deployment terbaru
   - Lihat Build Logs dan Function Logs

2. **Cek Browser Console:**
   - Tekan F12
   - Lihat error di Console tab
   - Lihat failed requests di Network tab

3. **Baca Documentation:**
   - Vercel Docs: https://vercel.com/docs
   - NextAuth Docs: https://next-auth.js.org

---

**Ikuti langkah-langkah di atas untuk memperbaiki masalah login!** 🔧

Setelah diperbaiki, login di Vercel deployment akan berfungsi normal! ✅
