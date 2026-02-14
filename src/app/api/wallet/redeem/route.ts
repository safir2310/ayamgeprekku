import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, getUserFromAuth, createWalletHistory } from '@/lib/api-utils';
import { isExpired } from '@/lib/helpers';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromAuth(authHeader);

    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { kode } = body;

    if (!kode) {
      return errorResponse('Kode wajib diisi');
    }

    // Find redeem code
    const redeemCode = await db.redeemCode.findUnique({
      where: { kode },
    });

    if (!redeemCode) {
      return errorResponse('Kode redeem tidak valid');
    }

    if (!redeemCode.aktif) {
      return errorResponse('Kode redeem sudah tidak aktif');
    }

    if (redeemCode.expired) {
      return errorResponse('Kode redeem sudah kadaluarsa');
    }

    if (redeemCode.expiredAt && isExpired(redeemCode.expiredAt)) {
      return errorResponse('Kode redeem sudah kadaluarsa');
    }

    // Check if already used by this user
    const existingHistory = await db.redeemHistory.findFirst({
      where: {
        userId: user.id,
        redeemCodeId: redeemCode.id,
      },
    });

    if (existingHistory) {
      return errorResponse('Kode redeem sudah digunakan');
    }

    // Get wallet
    const wallet = await db.walletSaldo.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      return errorResponse('Wallet tidak ditemukan');
    }

    const saldoSebelum = wallet.saldo;
    const saldoSesudah = saldoSebelum + redeemCode.poin;

    // Update wallet
    await db.walletSaldo.update({
      where: { userId: user.id },
      data: { saldo: saldoSesudah },
    });

    // Create wallet history
    await createWalletHistory(
      user.id,
      'credit',
      redeemCode.poin,
      `Redeem code: ${kode}`,
      saldoSebelum,
      saldoSesudah
    );

    // Create redeem history
    await db.redeemHistory.create({
      data: {
        userId: user.id,
        redeemCodeId: redeemCode.id,
        poin: redeemCode.poin,
        deskripsi: `Redeem code: ${kode}`,
      },
    });

    return successResponse(
      { newSaldo: saldoSesudah },
      `Berhasil redeem ${redeemCode.poin} poin`
    );
  } catch (error) {
    console.error('Redeem error:', error);
    return errorResponse('Terjadi kesalahan', 500);
  }
}
