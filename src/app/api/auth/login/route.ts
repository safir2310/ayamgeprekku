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

    // Check if user exists
    const user = await db.user.findUnique({
      where: { username },
      include: { walletSaldo: true },
    });

    if (!user) {
      return errorResponse('Username atau password salah');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return errorResponse('Username atau password salah');
    }

    // Create simple token (in production, use JWT) - same format as admin
    const token = btoa(JSON.stringify({ id: user.id, type: 'user', username: user.username }));

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    const response = {
      id: userWithoutPassword.id,
      userId: userWithoutPassword.userId,
      username: userWithoutPassword.username,
      email: userWithoutPassword.email,
      noHp: userWithoutPassword.noHp,
      role: 'user',
      memberLevel: userWithoutPassword.memberLevel,
      saldo: userWithoutPassword.walletSaldo?.saldo || 0,
    };

    return successResponse({
      user: response,
      token,
    }, 'Login berhasil');
  } catch (error) {
    console.error('Login error:', error);
    return errorResponse('Terjadi kesalahan saat login', 500);
  }
}
