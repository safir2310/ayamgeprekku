import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, getUserFromAuth } from '@/lib/api-utils';

// PUT - Update point product (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromAuth(authHeader);

    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    if (user.role !== 'admin') {
      return errorResponse('Hanya admin yang dapat mengupdate produk point', 403);
    }

    const { id } = params;
    const body = await request.json();
    const { nama, deskripsi, poin, gambar, isAvailable } = body;

    // Check if product exists
    const existingProduct = await db.produkPoint.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return errorResponse('Produk tidak ditemukan', 404);
    }

    // Update product
    const product = await db.produkPoint.update({
      where: { id },
      data: {
        ...(nama && { nama }),
        ...(deskripsi !== undefined && { deskripsi }),
        ...(poin && { poin: parseInt(poin) }),
        ...(gambar !== undefined && { gambar }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
    });

    return successResponse(
      { product },
      'Produk point berhasil diupdate'
    );
  } catch (error) {
    console.error('Update point product error:', error);
    return errorResponse('Terjadi kesalahan saat mengupdate produk', 500);
  }
}

// DELETE - Delete point product (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromAuth(authHeader);

    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    if (user.role !== 'admin') {
      return errorResponse('Hanya admin yang dapat menghapus produk point', 403);
    }

    const { id } = params;

    // Check if product exists
    const existingProduct = await db.produkPoint.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return errorResponse('Produk tidak ditemukan', 404);
    }

    // Delete product
    await db.produkPoint.delete({
      where: { id },
    });

    return successResponse(
      { message: 'Produk berhasil dihapus' },
      'Produk point berhasil dihapus'
    );
  } catch (error) {
    console.error('Delete point product error:', error);
    return errorResponse('Terjadi kesalahan saat menghapus produk', 500);
  }
}
