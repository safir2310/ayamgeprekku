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

    const wallet = await db.walletSaldo.findUnique({
      where: { userId: user.id },
    });

    const history = await db.walletHistory.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return successResponse({
      saldo: wallet?.saldo || 0,
      history,
    });
  } catch (error) {
    console.error('Get wallet error:', error);
    return errorResponse('Terjadi kesalahan', 500);
  }
}
