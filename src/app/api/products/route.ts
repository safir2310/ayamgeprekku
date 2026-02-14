import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, getAdminFromAuth } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get('kategori');
    const promo = searchParams.get('promo');
    const isAvailable = searchParams.get('isAvailable');

    const where: any = {};

    if (kategori) {
      where.kategori = kategori;
    }

    if (promo === 'true') {
      where.promo = true;
    }

    if (isAvailable === 'true') {
      where.isAvailable = true;
    }

    const products = await db.produk.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(products);
  } catch (error) {
    console.error('Get products error:', error);
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
    const { nama, deskripsi, harga, kategori, gambar, promo, diskon } = body;

    // Validation
    if (!nama || !harga || !kategori) {
      return errorResponse('Nama, harga, dan kategori wajib diisi');
    }

    const product = await db.produk.create({
      data: {
        nama,
        deskripsi,
        harga: parseFloat(harga),
        kategori,
        gambar,
        promo: promo || false,
        diskon: diskon ? parseFloat(diskon) : 0,
        isAvailable: true,
        adminId: admin.id,
      },
    });

    return successResponse(product, 'Produk berhasil ditambahkan');
  } catch (error) {
    console.error('Create product error:', error);
    return errorResponse('Terjadi kesalahan', 500);
  }
}
