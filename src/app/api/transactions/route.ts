import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, getUserFromAuth } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromAuth(authHeader);

    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '10');

    const where: any = { userId: user.id };

    if (status) {
      where.status = status;
    }

    const transactions = await db.transaksi.findMany({
      where,
      include: {
        transaksiItem: {
          include: {
            produk: true,
          },
        },
        struk: true,
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return successResponse(transactions);
  } catch (error) {
    console.error('Get transactions error:', error);
    return errorResponse('Terjadi kesalahan', 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromAuth(authHeader);

    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { items, total } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return errorResponse('Item pesanan tidak valid', 400);
    }

    // Generate 4-digit struk ID
    const strukId = Math.floor(1000 + Math.random() * 9000).toString();

    // Create transaction
    const transaksi = await db.transaksi.create({
      data: {
        strukId,
        userId: user.id,
        total,
        saldoDipakai: 0,
        diskonPoint: 0,
        sisaSaldo: user.saldo || 0,
        status: 'Menunggu',
        nama: user.username,
        alamat: user.alamat || 'Akan diinformasikan via WhatsApp',
        noHp: user.noHp || 'Akan diinformasikan via WhatsApp',
        catatan: 'Order via WhatsApp',
        adminId: null,
        transaksiItem: {
          create: items.map((item: any) => ({
            produkId: item.produkId,
            jumlah: item.quantity,
            harga: item.price,
            subtotal: item.subtotal,
          })),
        },
      },
      include: {
        transaksiItem: {
          include: {
            produk: true,
          },
        },
      },
    });

    // Create receipt (struk)
    await db.struk.create({
      data: {
        strukId: transaksi.strukId,
        transaksiId: transaksi.id,
        userId: user.id,
        total: transaksi.total,
        saldoDipakai: transaksi.saldoDipakai,
        diskonPoint: transaksi.diskonPoint,
        sisaSaldo: transaksi.sisaSaldo,
        status: transaksi.status,
      },
    });

    return successResponse(
      {
        id: transaksi.id,
        strukId: transaksi.strukId,
        status: transaksi.status,
        total: transaksi.total,
        createdAt: transaksi.createdAt,
      },
      'Pesanan berhasil dibuat'
    );
  } catch (error) {
    console.error('Create transaction error:', error);
    return errorResponse('Terjadi kesalahan saat membuat pesanan', 500);
  }
}
