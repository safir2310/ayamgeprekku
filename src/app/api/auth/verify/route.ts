import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';
import { verifyCodeWithDateOfBirth } from '@/lib/helpers';

// POST /api/auth/verify - Verify code with date of birth
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, userId, email, type } = body;

    if (!code) {
      return errorResponse('Kode verifikasi diperlukan', 400);
    }

    // Determine which field to use (userId or email)
    if (!userId && !email) {
      return errorResponse('User ID atau Email diperlukan', 400);
    }

    // Find user by userId or email
    const user = await db.user.findUnique({
      where: userId ? { id: userId } : { email },
    });

    if (!user) {
      return errorResponse('User tidak ditemukan', 404);
    }

    // Check if user has date of birth
    if (!user.tanggalLahir) {
      return errorResponse('Tanggal lahir tidak ditemukan. Silakan lengkapi profil Anda.', 400);
    }

    // Verify the code
    const isValid = verifyCodeWithDateOfBirth(code, user.tanggalLahir);

    if (!isValid) {
      return errorResponse('Kode verifikasi salah. Kode adalah 6 digit angka dari tanggal lahir Anda (DDMMYY). Contoh: 150395 untuk tanggal 15-03-1995', 400);
    }

    // Return success response
    return successResponse(
      {
        verified: true,
        userId: user.id,
        username: user.username,
        message: 'Verifikasi berhasil!',
      },
      'Kode verifikasi valid'
    );
  } catch (error) {
    console.error('Verification error:', error);
    return errorResponse('Terjadi kesalahan saat verifikasi', 500);
  }
}
