'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useStore } from '@/store/store';
import {
  Settings,
  ArrowLeft,
  Store,
  DollarSign,
  Save,
  Instagram,
  Facebook,
  Phone,
  MapPin,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const { user, token } = useStore();
  const [loading, setLoading] = useState(false);

  // Wallet Settings
  const [walletSettings, setWalletSettings] = useState({
    pointValue: 100,
    minSaldoUse: 0,
    cashbackRate: 0,
    referralRate: 100,
  });

  // Store Profile
  const [storeProfile, setStoreProfile] = useState({
    nama: 'AYAM GEPREK SAMBAL IJO',
    slogan: 'Pedasnya Bikin Nagih 🔥🔥',
    alamat:
      'Jl. Medan - Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 24151',
    noHp: '085260812758',
    instagram: '#',
    facebook: '#',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.success) {
        setWalletSettings(data.data.walletSettings);
        setStoreProfile(data.data.profileToko);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWalletSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'wallet',
          data: walletSettings,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        alert(responseData.message);
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error('Error saving wallet settings:', error);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveStoreProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          type: 'store',
          data: storeProfile,
        }),
      });

      const responseData = await response.json();
      if (responseData.success) {
        alert(responseData.message);
      } else {
        alert(responseData.message);
      }
    } catch (error) {
      console.error('Error saving store profile:', error);
      alert('Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Akses ditolak</p>
          <Link href="/login">
            <Button className="gradient-brand text-white">Masuk</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Pengaturan
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Kelola pengaturan sistem dan toko
              </p>
            </div>
          </div>
        </motion.div>

        <div className="space-y-8">
          {/* Wallet Settings */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Pengaturan Wallet</CardTitle>
                    <p className="text-sm text-gray-500">
                      Atur nilai poin dan sistem reward
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="pointValue">1 Point = (Rp)</Label>
                      <Input
                        id="pointValue"
                        type="number"
                        value={walletSettings.pointValue}
                        onChange={(e) =>
                          setWalletSettings({
                            ...walletSettings,
                            pointValue: parseInt(e.target.value),
                          })
                        }
                      />
                      <p className="text-xs text-gray-500">
                        Nilai tukar poin ke rupiah
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="minSaldoUse">
                        Minimum Penggunaan Saldo (Rp)
                      </Label>
                      <Input
                        id="minSaldoUse"
                        type="number"
                        value={walletSettings.minSaldoUse}
                        onChange={(e) =>
                          setWalletSettings({
                            ...walletSettings,
                            minSaldoUse: parseInt(e.target.value),
                          })
                        }
                      />
                      <p className="text-xs text-gray-500">
                        Minimum saldo yang dapat digunakan
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cashbackRate">
                        Cashback Rate (%)
                      </Label>
                      <Input
                        id="cashbackRate"
                        type="number"
                        value={walletSettings.cashbackRate}
                        onChange={(e) =>
                          setWalletSettings({
                            ...walletSettings,
                            cashbackRate: parseFloat(e.target.value),
                          })
                        }
                      />
                      <p className="text-xs text-gray-500">
                        Persentase cashback dari pembelian
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="referralRate">
                        Referral Reward (Poin)
                      </Label>
                      <Input
                        id="referralRate"
                        type="number"
                        value={walletSettings.referralRate}
                        onChange={(e) =>
                          setWalletSettings({
                            ...walletSettings,
                            referralRate: parseInt(e.target.value),
                          })
                        }
                      />
                      <p className="text-xs text-gray-500">
                        Poin yang didapat saat user baru referral
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button
                    onClick={handleSaveWalletSettings}
                    disabled={loading}
                    className="gradient-brand text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Pengaturan Wallet
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Store Profile */}
          <motion.div
            id="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <Store className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle>Profil Toko</CardTitle>
                    <p className="text-sm text-gray-500">
                      Edit informasi toko Anda
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Toko</Label>
                      <Input
                        id="nama"
                        value={storeProfile.nama}
                        onChange={(e) =>
                          setStoreProfile({ ...storeProfile, nama: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slogan">Slogan</Label>
                      <Input
                        id="slogan"
                        value={storeProfile.slogan}
                        onChange={(e) =>
                          setStoreProfile({ ...storeProfile, slogan: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat Lengkap</Label>
                    <Textarea
                      id="alamat"
                      value={storeProfile.alamat}
                      onChange={(e) =>
                        setStoreProfile({ ...storeProfile, alamat: e.target.value })
                      }
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="noHp">Nomor HP (WhatsApp)</Label>
                    <Input
                      id="noHp"
                      type="tel"
                      value={storeProfile.noHp}
                      onChange={(e) =>
                        setStoreProfile({ ...storeProfile, noHp: e.target.value })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="instagram">
                        <Instagram className="h-4 w-4 inline mr-2" />
                        Instagram
                      </Label>
                      <Input
                        id="instagram"
                        type="url"
                        value={storeProfile.instagram}
                        onChange={(e) =>
                          setStoreProfile({
                            ...storeProfile,
                            instagram: e.target.value,
                          })
                        }
                        placeholder="https://instagram.com/..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="facebook">
                        <Facebook className="h-4 w-4 inline mr-2" />
                        Facebook
                      </Label>
                      <Input
                        id="facebook"
                        type="url"
                        value={storeProfile.facebook}
                        onChange={(e) =>
                          setStoreProfile({
                            ...storeProfile,
                            facebook: e.target.value,
                          })
                        }
                        placeholder="https://facebook.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button
                    onClick={handleSaveStoreProfile}
                    disabled={loading}
                    className="gradient-brand text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Profil Toko
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-semibold">Alamat akan muncul di</p>
                      <p className="text-sm text-gray-600">
                        Footer, Halaman Order, dan Struk
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold">No HP untuk WhatsApp</p>
                      <p className="text-sm text-gray-600">
                        Digunakan untuk kirim order ke WhatsApp
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
