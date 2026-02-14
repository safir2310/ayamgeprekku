import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, getUserFromAuth } from '@/lib/api-utils';
import crypto from 'crypto';

// POST - Redeem a point product
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromAuth(authHeader);

    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { produkPointId } = body;

    // Validation
    if (!produkPointId) {
      return errorResponse('Produk point ID diperlukan');
    }

    // Get user wallet
    const wallet = await db.walletSaldo.findUnique({
      where: { userId: user.id },
    });

    if (!wallet) {
      return errorResponse('Wallet tidak ditemukan', 404);
    }

    // Get the point product
    const product = await db.produkPoint.findUnique({
      where: { id: produkPointId },
    });

    if (!product) {
      return errorResponse('Produk tidak ditemukan', 404);
    }

    if (!product.isAvailable) {
      return errorResponse('Produk tidak tersedia saat ini');
    }

    const pointValue = 100; // 1 Point = Rp 100
    const userPoints = Math.floor(wallet.saldo / pointValue);

    // Check if user has enough points
    if (userPoints < product.poin) {
      return errorResponse(
        `Poin tidak cukup. Anda memiliki ${userPoints} poin, membutuhkan ${product.poin} poin`
      );
    }

    // Calculate deduction
    const deduction = product.poin * pointValue;

    // Generate unique redeem code
    const redeemCode = crypto.randomBytes(4).toString('hex').toUpperCase();

    // Start transaction
    const newSaldo = wallet.saldo - deduction;

    // Update wallet balance
    await db.walletSaldo.update({
      where: { userId: user.id },
      data: { saldo: newSaldo },
    });

    // Create wallet history
    await db.walletHistory.create({
      data: {
        userId: user.id,
        tipe: 'debit',
        jumlah: deduction,
        deskripsi: `Tukar poin: ${product.nama} (${product.poin} poin)`,
        saldoSebelum: wallet.saldo,
        saldoSesudah: newSaldo,
      },
    });

    // Create redeem history
    await db.redeemHistory.create({
      data: {
        userId: user.id,
        produkPointId: product.id,
        poin: product.poin,
        deskripsi: `Redeem: ${product.nama}`,
      },
    });

    // Create redeem code (one-time use)
    await db.redeemCode.create({
      data: {
        kode: redeemCode,
        poin: product.poin,
        aktif: true,
        expired: false,
        adminId: product.adminId,
      },
    });

    return successResponse(
      {
        redeemCode,
        newSaldo,
        productName: product.nama,
        pointsUsed: product.poin,
      },
      'Poin berhasil ditukar'
    );
  } catch (error) {
    console.error('Redeem point product error:', error);
    return errorResponse('Terjadi kesalahan saat menukar poin', 500);
  }
}
