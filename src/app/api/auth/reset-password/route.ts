import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, kodeVerifikasi, newPassword } = body;

    // Validation
    if (!email || !kodeVerifikasi || !newPassword) {
      return errorResponse('Semua field wajib diisi');
    }

    if (newPassword.length < 6) {
      return errorResponse('Kata sandi minimal 6 karakter');
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
      return errorResponse('Kode verifikasi salah');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    if (isAdmin) {
      await db.admin.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    } else {
      await db.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    }

    return successResponse(
      { message: 'Kata sandi berhasil diubah' },
      'Kata sandi berhasil diubah'
    );
  } catch (error) {
    console.error('Reset password error:', error);
    return errorResponse('Terjadi kesalahan saat reset kata sandi', 500);
  }
}
