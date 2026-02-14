import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcrypt';
import { generateUniqueUserId, initializeUserWallet } from '@/lib/api-utils';
import { generateReferralCode, generateVerificationCodeFromPhone } from '@/lib/helpers';
import { successResponse, errorResponse } from '@/lib/api-utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password, email, noHp } = body;

    // Validation
    if (!username || !password || !email || !noHp) {
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

    // Check if username already exists
    const existingUser = await db.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return errorResponse('Username sudah digunakan');
    }

    // Check if email already exists
    const existingEmail = await db.user.findUnique({
      where: { email },
    });

    if (existingEmail) {
      return errorResponse('Email sudah digunakan');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate unique userId
    const userId = await generateUniqueUserId('user');

    // Generate referral code
    const referralCode = generateReferralCode();

    // Generate verification code from phone number (last 6 digits)
    const kodeVerifikasi = generateVerificationCodeFromPhone(noHp);

    // Create user
    const newUser = await db.user.create({
      data: {
        userId,
        username,
        password: hashedPassword,
        email,
        noHp,
        kodeVerifikasi,
        role: 'user',
        memberLevel: 'Silver',
        totalSpent: 0,
        referralCode,
      },
    });

    // Initialize wallet
    await initializeUserWallet(newUser.id);

    // Get user with wallet
    const userWithWallet = await db.user.findUnique({
      where: { id: newUser.id },
      include: { walletSaldo: true },
    });

    // Create simple token - same format as login
    const token = btoa(JSON.stringify({ id: newUser.id, type: 'user', username: newUser.username }));

    const { password: _, ...userWithoutPassword } = userWithWallet!;

    // Return user data with all needed fields
    const response = {
      id: userWithoutPassword.id,
      userId: userWithoutPassword.userId,
      username: userWithoutPassword.username,
      email: userWithoutPassword.email,
      noHp: userWithoutPassword.noHp,
      kodeVerifikasi: userWithoutPassword.kodeVerifikasi,
      role: 'user',
      memberLevel: userWithoutPassword.memberLevel,
      saldo: userWithoutPassword.walletSaldo?.saldo || 0,
    };

    return successResponse({
      user: response,
      token,
    }, 'Registrasi berhasil');
  } catch (error) {
    console.error('Register error:', error);
    return errorResponse('Terjadi kesalahan saat registrasi', 500);
  }
}
