import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import { generateUniqueUserId } from '@/lib/api-utils';
import { verifyCodeWithDateOfBirth, generateVerificationCodeFromPhone } from '@/lib/helpers';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, email, noHp, tanggalLahir, kodeVerifikasi } = body;

    // Validation
    if (!username || !password || !email || !noHp || !tanggalLahir || !kodeVerifikasi) {
      return errorResponse('Semua field wajib diisi');
    }

    if (username.length < 3) {
      return errorResponse('Nama pengguna minimal 3 karakter');
    }

    if (password.length < 6) {
      return errorResponse('Kata sandi minimal 6 karakter');
    }

    if (!email.includes('@')) {
      return errorResponse('Email tidak valid');
    }

    if (noHp.length < 10) {
      return errorResponse('Nomor HP minimal 10 digit');
    }

    // Validate tanggal lahir
    if (!tanggalLahir) {
      return errorResponse('Tanggal lahir wajib diisi');
    }

    // Verify kode verifikasi matches tanggal lahir
    const isCodeValid = verifyCodeWithDateOfBirth(kodeVerifikasi, tanggalLahir);
    if (!isCodeValid) {
      return errorResponse('Kode verifikasi salah');
    }

    // Check if username already exists
    const existingAdmin = await db.admin.findUnique({
      where: { username },
    });

    if (existingAdmin) {
      return errorResponse('Username sudah digunakan');
    }

    // Check if email already exists
    const existingEmail = await db.admin.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return errorResponse('Email sudah digunakan');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique userId
    const userId = await generateUniqueUserId('admin');

    // Generate verification code from phone number (last 6 digits)
    const kodeVerifikasiDb = generateVerificationCodeFromPhone(noHp);

    // Create admin
    const newAdmin = await db.admin.create({
      data: {
        userId,
        username,
        password: hashedPassword,
        email,
        noHp,
        tanggalLahir: new Date(tanggalLahir),
        kodeVerifikasi: kodeVerifikasiDb,
      },
    });

    // Get admin
    const admin = await db.admin.findUnique({
      where: { id: newAdmin.id },
    });

    // Create simple token (same format as login)
    const token = btoa(JSON.stringify({ id: newAdmin.id, type: 'admin', username: newAdmin.username }));

    const { password: _, ...adminWithoutPassword } = admin!;

    return successResponse({
      user: { ...adminWithoutPassword, role: 'admin', kodeVerifikasi: kodeVerifikasiDb },
      token,
    }, 'Registrasi admin berhasil');
  } catch (error) {
    console.error('Register admin error:', error);
    return errorResponse('Terjadi kesalahan saat registrasi', 500);
  }
}
