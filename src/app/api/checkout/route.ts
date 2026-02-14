import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, getUserFromAuth, createWalletHistory } from '@/lib/api-utils';
import { generate4DigitId, createWhatsAppMessage, getWhatsAppUrl } from '@/lib/helpers';

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const user = await getUserFromAuth(authHeader);

    if (!user) {
      return errorResponse('Unauthorized', 401);
    }

    const body = await request.json();
    const { items, alamat, catatan, useSaldo, saldoAmount } = body;

    if (!items || items.length === 0) {
      return errorResponse('Keranjang kosong');
    }

    if (!alamat) {
      return errorResponse('Alamat wajib diisi');
    }

    // Calculate total
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.harga * item.jumlah,
      0
    );

    let saldoDipakai = 0;
    let finalTotal = subtotal;

    // Process saldo usage
    if (useSaldo && saldoAmount > 0) {
      const wallet = await db.walletSaldo.findUnique({
        where: { userId: user.id },
      });

      if (!wallet) {
        return errorResponse('Wallet tidak ditemukan');
      }

      const maxSaldo = Math.min(saldoAmount, wallet.saldo, subtotal);
      saldoDipakai = maxSaldo;
      finalTotal = subtotal - maxSaldo;

      // Update wallet
      await db.walletSaldo.update({
        where: { userId: user.id },
        data: { saldo: wallet.saldo - maxSaldo },
      });

      // Create wallet history
      await createWalletHistory(
        user.id,
        'debit',
        maxSaldo,
        'Pembelian pesanan',
        wallet.saldo,
        wallet.saldo - maxSaldo
      );
    }

    // Generate struk ID
    const strukId = generate4DigitId();

    // Create transaction
    const transaction = await db.transaksi.create({
      data: {
        strukId,
        userId: user.id,
        total: subtotal,
        saldoDipakai,
        diskonPoint: 0,
        sisaSaldo: saldoDipakai,
        status: 'Menunggu',
        nama: user.username,
        alamat,
        noHp: user.noHp,
        catatan,
        transaksiItem: {
          create: items.map((item: any) => ({
            produkId: item.produkId,
            jumlah: item.jumlah,
            harga: item.harga,
            subtotal: item.harga * item.jumlah,
          })),
        },
      },
    });

    // Create struk
    await db.struk.create({
      data: {
        strukId,
        transaksiId: transaction.id,
        userId: user.id,
        total: subtotal,
        saldoDipakai,
        diskonPoint: 0,
        sisaSaldo: saldoDipakai,
        status: 'Menunggu',
      },
    });

    // Get store profile
    const storeProfile = await db.profileToko.findFirst();

    // Get WhatsApp number from store profile or use default
    const whatsappNumber = storeProfile?.noHp || '085260812758';

    // Create WhatsApp message
    const orderItems = items.map((item: any) => ({
      name: item.nama,
      quantity: item.jumlah,
      price: item.harga,
      subtotal: item.harga * item.jumlah,
    }));

    const whatsappMessage = createWhatsAppMessage(
      {
        userName: user.username,
        userId: user.userId,
        address: alamat,
        phone: user.noHp,
        items: orderItems,
        total: subtotal,
        saldoUsed: saldoDipakai,
        discount: 0,
        finalTotal,
      },
      storeProfile || undefined
    );

    const whatsappUrl = getWhatsAppUrl(whatsappNumber, whatsappMessage);

    return successResponse(
      {
        transaction,
        whatsappUrl,
        strukId,
      },
      'Pesanan berhasil dibuat'
    );
  } catch (error) {
    console.error('Checkout error:', error);
    return errorResponse('Terjadi kesalahan saat checkout', 500);
  }
}
