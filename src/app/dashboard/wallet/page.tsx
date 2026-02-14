'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useStore } from '@/store/store';
import { formatCurrency } from '@/lib/helpers';
import { Wallet, Gift, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function WalletPage() {
  const { user, setSaldo } = useStore();
  const [redeemCode, setRedeemCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleRedeem = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/wallet/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Authorization: `Bearer ${token}`, // Add this when auth is working
        },
        body: JSON.stringify({ kode: redeemCode }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: data.message });
        setRedeemCode('');
        // Update wallet balance in store
        setSaldo(data.data.newSaldo);
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat redeem' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Wallet & Poin
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola saldo dan tukarkan kode redeem Anda
          </p>
        </motion.div>

        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className="gradient-brand text-white border-0 shadow-lg">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Wallet className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Saldo Anda</p>
                    <p className="text-4xl font-bold">
                      {formatCurrency(user?.saldo || 0)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5" />
                    <span className="font-semibold">1 Point = Rp 100</span>
                  </div>
                  <p className="text-sm opacity-90">
                    Gunakan saldo untuk belanja di Ayam Geprek
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Redeem Code Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Gift className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle>Redeem Code</CardTitle>
                    <CardDescription>
                      Tukarkan kode untuk mendapatkan poin
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRedeem} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="redeemCode">Kode Redeem</Label>
                    <Input
                      id="redeemCode"
                      type="text"
                      placeholder="Masukkan kode redeem"
                      value={redeemCode}
                      onChange={(e) => setRedeemCode(e.target.value.toUpperCase())}
                      className="uppercase"
                      disabled={loading}
                    />
                  </div>

                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-3 rounded-lg flex items-center gap-2 ${
                        message.type === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                          : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                      }`}
                    >
                      <CheckCircle2 className="h-5 w-5" />
                      <span>{message.text}</span>
                    </motion.div>
                  )}

                  <Button
                    type="submit"
                    className="w-full gradient-brand text-white"
                    disabled={loading || !redeemCode}
                  >
                    {loading ? 'Memproses...' : 'Redeem Sekarang'}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <p className="text-sm text-orange-700 dark:text-orange-300 font-medium mb-2">
                    💡 Cara mendapatkan kode redeem:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Ikuti event promo dari kami</li>
                    <li>• Undang teman dengan referral code</li>
                    <li>• Belanja berulang untuk bonus poin</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Wallet Info Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Tentang Wallet</CardTitle>
                <CardDescription>
                  Informasi tentang sistem wallet kami
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">
                    💰 Cara Menggunakan Saldo
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Saldo wallet dapat digunakan saat checkout. Anda dapat memilih untuk
                    menggunakan sebagian atau seluruh saldo untuk pembayaran.
                  </p>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-700 dark:text-green-300 mb-2">
                    🎁 Bonus Poin
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Setiap pembelian memberikan Anda poin. Kumpulkan poin dan tukarkan
                    dengan hadiah menarik atau gunakan untuk belanja.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">
                    ⭐ Level Member
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Naikkan level member untuk mendapatkan lebih banyak benefit:
                  </p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Silver: Level awal</li>
                    <li>• Gold: Rp 500.000+ total belanja</li>
                    <li>• Platinum: Rp 1.000.000+ total belanja</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
