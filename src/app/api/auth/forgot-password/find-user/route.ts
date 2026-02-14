import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return errorResponse('Email diperlukan');
    }

    if (!email.includes('@')) {
      return errorResponse('Email tidak valid');
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
      return errorResponse('Email tidak ditemukan. Silakan periksa kembali email Anda.');
    }

    if (!user.noHp || user.noHp.length < 6) {
      return errorResponse('Nomor HP tidak valid di akun Anda. Silakan hubungi admin.');
    }

    // User found successfully
    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as any).password;

    return successResponse({
      user: { ...userWithoutPassword, isAdmin },
      message: 'Akun ditemukan',
    }, 'Akun ditemukan. Silakan verifikasi kode.');
  } catch (error) {
    console.error('Find user error:', error);
    return errorResponse('Terjadi kesalahan saat mencari akun', 500);
  }
}
