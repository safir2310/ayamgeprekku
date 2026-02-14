import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, getUserFromAuth } from '@/lib/api-utils';

// GET - Get all available point products
export async function GET(request: NextRequest) {
  try {
    const products = await db.produkPoint.findMany({
      where: { isAvailable: true },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse({ products });
  } catch (error) {
    console.error('Get point products error:', error);
    return errorResponse('Terjadi kesalahan saat mengambil produk', 500);
  }
}

// POST - Create new point product (Admin only)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromAuth(authHeader);

    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    if (user.role !== 'admin') {
      return errorResponse('Hanya admin yang dapat menambah produk point', 403);
    }

    const body = await request.json();
    const { nama, deskripsi, poin, gambar } = body;

    // Validation
    if (!nama || !poin) {
      return errorResponse('Nama dan poin wajib diisi');
    }

    if (poin <= 0) {
      return errorResponse('Poin harus lebih dari 0');
    }

    // Get admin ID
    const admin = await db.admin.findUnique({
      where: { userId: user.userId },
    });

    if (!admin) {
      return errorResponse('Admin tidak ditemukan', 404);
    }

    // Create product
    const product = await db.produkPoint.create({
      data: {
        nama,
        deskripsi: deskripsi || null,
        poin: parseInt(poin),
        gambar: gambar || null,
        isAvailable: true,
        adminId: admin.id,
      },
    });

    return successResponse(
      { product },
      'Produk point berhasil ditambahkan'
    );
  } catch (error) {
    console.error('Create point product error:', error);
    return errorResponse('Terjadi kesalahan saat menambah produk', 500);
  }
}
