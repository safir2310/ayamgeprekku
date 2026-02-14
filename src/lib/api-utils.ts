import { db } from '@/lib/db';
import { generate4DigitId, generateReferralCode } from './helpers';
import bcrypt from 'bcrypt';

// Helper function to create response
export function successResponse(data: any, message: string = 'Success') {
  return Response.json({ success: true, message, data }, { status: 200 });
}

export function errorResponse(message: string, status: number = 400) {
  return Response.json({ success: false, message }, { status });
}

// Helper to get user from request
export async function getUserFromAuth(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  // TODO: Implement proper JWT verification
  // For now, we'll use a simple approach
  try {
    const decoded = JSON.parse(atob(token));

    // Check if it's an admin token
    if (decoded.type === 'admin') {
      return null; // Use getAdminFromAuth for admin
    }

    // It's a user token - could be just the ID or an object
    const userId = typeof decoded === 'string' ? decoded : decoded.id;
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { walletSaldo: true },
    });
    return user;
  } catch {
    return null;
  }
}

// Helper to get admin from request
export async function getAdminFromAuth(authHeader: string | null) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.substring(7);
  try {
    const decoded = JSON.parse(atob(token));

    // Check if it's an admin token
    if (decoded.type === 'admin') {
      const admin = await db.admin.findUnique({
        where: { id: decoded.id },
      });
      if (admin) {
        return {
          ...admin,
          role: 'admin',
        };
      }
    }

    return null;
  } catch {
    return null;
  }
}

// Helper to generate unique userId
export async function generateUniqueUserId(role: string): Promise<string> {
  let userId: string;
  let exists: any;

  do {
    userId = generate4DigitId();
    if (role === 'admin') {
      exists = await db.admin.findUnique({ where: { userId } });
    } else {
      exists = await db.user.findUnique({ where: { userId } });
    }
  } while (exists);

  return userId;
}

// Helper to initialize user wallet
export async function initializeUserWallet(userId: string) {
  const existingWallet = await db.walletSaldo.findUnique({
    where: { userId },
  });

  if (!existingWallet) {
    await db.walletSaldo.create({
      data: {
        userId,
        saldo: 0,
      },
    });
  }
}

// Helper to create wallet history entry
export async function createWalletHistory(
  userId: string,
  tipe: 'credit' | 'debit',
  jumlah: number,
  deskripsi: string,
  saldoSebelum: number,
  saldoSesudah: number
) {
  await db.walletHistory.create({
    data: {
      userId,
      tipe,
      jumlah,
      deskripsi,
      saldoSebelum,
      saldoSesudah,
    },
  });
}
