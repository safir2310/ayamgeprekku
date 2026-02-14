import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, kodeVerifikasi } = body;

    // Validation
    if (!email || !kodeVerifikasi) {
      return errorResponse('Semua field wajib diisi');
    }

    if (!email.includes('@')) {
      return errorResponse('Email tidak valid');
    }

    if (kodeVerifikasi.length !== 6) {
      return errorResponse('Kode verifikasi harus 6 digit');
    }

    // Check if user exists (check both User and Admin tables)
    let user = await db.user.findUnique({
      where: { email },
    });

    let isAdmin = false;
    if (!user) {
      user = await db.admin.findUnique({
        where: { email },
      });
      if (user) {
        isAdmin = true;
      }
    }

    if (!user) {
      return errorResponse('Email tidak ditemukan');
    }

    if (!user.noHp || user.noHp.length < 6) {
      return errorResponse('Nomor HP tidak valid di akun Anda. Silakan hubungi admin.');
    }

    // Verify kode verifikasi matches last 6 digits of phone number
    const expectedCode = user.noHp.slice(-6);
    if (expectedCode !== kodeVerifikasi) {
      return errorResponse('Kode verifikasi salah. Kode adalah 6 digit terakhir dari nomor HP Anda.');
    }

    // Code verified successfully
    return successResponse({
      message: 'Verifikasi berhasil',
    }, 'Verifikasi berhasil. Silakan masukkan kata sandi baru.');
  } catch (error) {
    console.error('Verify code error:', error);
    return errorResponse('Terjadi kesalahan saat verifikasi', 500);
  }
}
