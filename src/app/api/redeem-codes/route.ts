import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, getAdminFromAuth } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const codes = await db.redeemCode.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(codes);
  } catch (error) {
    console.error('Get redeem codes error:', error);
    return errorResponse('Terjadi kesalahan', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const admin = await getAdminFromAuth(authHeader);

    if (!admin || admin.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { kode, poin, aktif, expired, expiredAt } = body;

    // Validation
    if (!poin) {
      return errorResponse('Jumlah poin wajib diisi');
    }

    // Generate random code if not provided
    const finalKode = kode || `AYAM-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Check if code already exists
    const existingCode = await db.redeemCode.findUnique({
      where: { kode: finalKode },
    });

    if (existingCode) {
      return errorResponse('Kode sudah digunakan');
    }

    const redeemCode = await db.redeemCode.create({
      data: {
        kode: finalKode,
        poin: parseInt(poin),
        aktif: aktif !== undefined ? aktif : true,
        expired: expired || false,
        expiredAt: expiredAt ? new Date(expiredAt) : null,
        adminId: admin.id,
      },
    });

    return successResponse(redeemCode, 'Kode redeem berhasil dibuat');
  } catch (error) {
    console.error('Create redeem code error:', error);
    return errorResponse('Terjadi kesalahan', 500);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const admin = await getAdminFromAuth(authHeader);

    if (!admin || admin.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { id, aktif, expired } = body;

    const redeemCode = await db.redeemCode.update({
      where: { id },
      data: {
        aktif,
        expired,
      },
    });

    return successResponse(redeemCode, 'Kode redeem berhasil diupdate');
  } catch (error) {
    console.error('Update redeem code error:', error);
    return errorResponse('Terjadi kesalahan', 500);
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const admin = await getAdminFromAuth(authHeader);

    if (!admin || admin.role !== 'admin') {
      return errorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return errorResponse('ID wajib diisi');
    }

    await db.redeemCode.delete({
      where: { id },
    });

    return successResponse(null, 'Kode redeem berhasil dihapus');
  } catch (error) {
    console.error('Delete redeem code error:', error);
    return errorResponse('Terjadi kesalahan', 500);
  }
}
