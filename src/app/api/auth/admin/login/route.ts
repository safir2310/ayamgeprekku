import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return errorResponse('Username dan password wajib diisi');
    }

    // Check if admin exists
    const admin = await db.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return errorResponse('Username atau password salah');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);

    if (!isValidPassword) {
      return errorResponse('Username atau password salah');
    }

    // Create simple token (in production, use JWT)
    const token = btoa(JSON.stringify({ id: admin.id, type: 'admin', username: admin.username }));

    // Return admin data without password
    const { password: _, ...adminWithoutPassword } = admin;

    const response = {
      id: adminWithoutPassword.id,
      userId: adminWithoutPassword.userId,
      username: adminWithoutPassword.username,
      email: adminWithoutPassword.email,
      noHp: adminWithoutPassword.noHp,
      role: 'admin',
      memberLevel: 'Admin',
      tanggalLahir: adminWithoutPassword.tanggalLahir,
    };

    return successResponse({
      user: response,
      token,
    }, 'Login berhasil');
  } catch (error) {
    console.error('Admin login error:', error);
    return errorResponse('Terjadi kesalahan saat login', 500);
  }
}
