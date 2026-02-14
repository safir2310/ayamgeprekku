import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { successResponse, errorResponse, getAdminFromAuth } from '@/lib/api-utils';

export async function GET(request: NextRequest) {
  try {
    const walletSettings = await db.walletSettings.findFirst();
    const profileToko = await db.profileToko.findFirst();

    return successResponse({
      walletSettings: walletSettings || {
        pointValue: 100,
        minSaldoUse: 0,
        cashbackRate: 0,
        referralRate: 100,
      },
      profileToko: profileToko || {
        nama: 'AYAM GEPREK SAMBAL IJO',
        slogan: 'Pedasnya Bikin Nagih 🔥🔥',
        alamat: 'Jl. Medan - Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 24151',
        noHp: '085260812758',
        instagram: '#',
        facebook: '#',
      },
    });
  } catch (error) {
    console.error('Get settings error:', error);
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
    const { type, data } = body;

    if (type === 'wallet') {
      // Update or create wallet settings
      const existingSettings = await db.walletSettings.findFirst();
      let updatedSettings;

      if (existingSettings) {
        updatedSettings = await db.walletSettings.update({
          where: { id: existingSettings.id },
          data: {
            pointValue: data.pointValue,
            minSaldoUse: data.minSaldoUse,
            cashbackRate: data.cashbackRate,
            referralRate: data.referralRate,
          },
        });
      } else {
        updatedSettings = await db.walletSettings.create({
          data: {
            pointValue: data.pointValue,
            minSaldoUse: data.minSaldoUse,
            cashbackRate: data.cashbackRate,
            referralRate: data.referralRate,
          },
        });
      }

      return successResponse(updatedSettings, 'Pengaturan wallet berhasil disimpan');
    } else if (type === 'store') {
      // Update or create store profile
      const existingProfile = await db.profileToko.findFirst();
      let updatedProfile;

      if (existingProfile) {
        updatedProfile = await db.profileToko.update({
          where: { id: existingProfile.id },
          data: {
            nama: data.nama,
            slogan: data.slogan,
            alamat: data.alamat,
            noHp: data.noHp,
            instagram: data.instagram,
            facebook: data.facebook,
          },
        });
      } else {
        updatedProfile = await db.profileToko.create({
          data: {
            nama: data.nama,
            slogan: data.slogan,
            alamat: data.alamat,
            noHp: data.noHp,
            instagram: data.instagram,
            facebook: data.facebook,
          },
        });
      }

      return successResponse(updatedProfile, 'Profil toko berhasil disimpan');
    } else {
      return errorResponse('Tipe pengaturan tidak valid');
    }
  } catch (error) {
    console.error('Update settings error:', error);
    return errorResponse('Terjadi kesalahan', 500);
  }
}
