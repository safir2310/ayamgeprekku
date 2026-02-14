'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStore } from '@/store/store';
import { Gift, Coins, ArrowLeft, CheckCircle2, Copy, Info } from 'lucide-react';

interface ProdukPoint {
  id: string;
  nama: string;
  deskripsi: string | null;
  poin: number;
  gambar: string | null;
  isAvailable: boolean;
}

export default function PointRedeemPage() {
  const { user } = useStore();
  const [products, setProducts] = useState<ProdukPoint[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProdukPoint | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/point-products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!selectedProduct) return;

    setIsRedeeming(true);
    try {
      const response = await fetch('/api/point-products/redeem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          produkPointId: selectedProduct.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsConfirmOpen(false);
        setRedeemCode(data.data.redeemCode);
        setIsSuccessOpen(true);

        // Update user balance in store
        if (data.data.newSaldo !== undefined) {
          // Update store with new saldo
          user!.saldo = data.data.newSaldo;
        }

        // Refresh products list
        fetchProducts();
      } else {
        alert(data.message || 'Gagal menukar poin');
      }
    } catch (error) {
      console.error('Error redeeming:', error);
      alert('Terjadi kesalahan saat menukar poin');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(redeemCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const userPoints = user?.saldo || 0;
  const pointValue = 100; // 1 Point = Rp 100

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tukar Poin
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Tukarkan poin Anda dengan hadiah menarik
              </p>
            </div>
          </div>
        </motion.div>

        {/* Points Balance Card */}
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
                    <Coins className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Saldo Poin Anda</p>
                    <p className="text-4xl font-bold">
                      {Math.floor(userPoints / pointValue)} Poin
                    </p>
                    <p className="text-sm opacity-75 mt-1">
                      = Rp {userPoints.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-2 justify-end">
                    <Info className="h-5 w-5" />
                    <span className="font-semibold">1 Poin = Rp {pointValue}</span>
                  </div>
                  <p className="text-sm opacity-90">
                    Kumpulkan lebih banyak poin dengan berbelanja
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-0">
                  <div className="h-48 bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-6 bg-gray-200 rounded w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, index) => {
              const userPointsValue = Math.floor(userPoints / pointValue);
              const canRedeem = userPointsValue >= product.poin && product.isAvailable;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className={`h-full flex flex-col card-hover ${
                    canRedeem ? 'border-2 border-green-300 hover:border-green-500' : 'border-2 border-gray-200 opacity-75'
                  }`}>
                    {/* Product Image */}
                    <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                      {product.gambar ? (
                        <img src={product.gambar} alt={product.nama} className="w-full h-full object-cover" />
                      ) : (
                        <Gift className="h-20 w-20 text-purple-400" />
                      )}
                      <div className="absolute top-3 right-3">
                        <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Coins className="h-4 w-4" />
                          {product.poin} Poin
                        </div>
                      </div>
                      {!product.isAvailable && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <span className="text-white font-bold text-lg">Habis</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <CardContent className="p-4 flex-1 flex flex-col">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{product.nama}</h3>
                        {product.deskripsi && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {product.deskripsi}
                          </p>
                        )}
                      </div>

                      <div className="mt-4 space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">
                            Poin Anda: {userPointsValue}
                          </span>
                          <span className={`font-semibold ${
                            canRedeem ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {canRedeem ? 'Cukup' : `Kurang ${product.poin - userPointsValue}`}
                          </span>
                        </div>

                        <Button
                          className={`w-full ${
                            canRedeem
                              ? 'gradient-brand text-white button-hover'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          disabled={!canRedeem || isRedeeming}
                          onClick={() => {
                            setSelectedProduct(product);
                            setIsConfirmOpen(true);
                          }}
                        >
                          <Coins className="h-4 w-4 mr-2" />
                          {isRedeeming && selectedProduct?.id === product.id
                            ? 'Memproses...'
                            : canRedeem
                            ? 'Tukar Poin'
                            : 'Poin Tidak Cukup'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Belum Ada Hadiah</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Silakan cek kembali nanti untuk hadiah menarik
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient-brand">
              Konfirmasi Tukar Poin
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menukar poin dengan hadiah ini?
            </DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4 py-4">
              <Card className="bg-gray-50 dark:bg-gray-800">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                      {selectedProduct.gambar ? (
                        <img
                          src={selectedProduct.gambar}
                          alt={selectedProduct.nama}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <Gift className="h-10 w-10 text-purple-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{selectedProduct.nama}</h4>
                      {selectedProduct.deskripsi && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {selectedProduct.deskripsi}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-purple-600 font-bold">
                        <Coins className="h-5 w-5" />
                        {selectedProduct.poin} Poin
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 dark:text-gray-300">Poin Anda saat ini:</span>
                  <span className="font-bold text-lg">{Math.floor(userPoints / pointValue)} Poin</span>
                </div>
                <div className="flex items-center justify-between mt-2 text-red-600">
                  <span>Poin setelah ditukar:</span>
                  <span className="font-bold text-lg">
                    {Math.floor(userPoints / pointValue) - selectedProduct.poin} Poin
                  </span>
                </div>
              </div>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                ⚠️ Tindakan ini tidak dapat dibatalkan. Kode redeem yang diberikan bersifat
                sekali pakai.
              </p>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsConfirmOpen(false)}
                  disabled={isRedeeming}
                >
                  Batal
                </Button>
                <Button
                  className="gradient-brand text-white"
                  onClick={handleRedeem}
                  disabled={isRedeeming}
                >
                  {isRedeeming ? 'Memproses...' : 'Ya, Tukar Sekarang'}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Success Dialog with Redeem Code */}
      <Dialog open={isSuccessOpen} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-green-600">
              Poin Berhasil Ditukar!
            </DialogTitle>
            <DialogDescription className="text-center">
              Simpan kode redeem ini dengan baik
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-green-600" />
              </div>
            </div>

            <div className="text-center mb-6">
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Berikut adalah kode redeem Anda:
              </p>
              <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-lg p-6 mb-4">
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 tracking-wider">
                  {redeemCode}
                </p>
              </div>
              <Button
                onClick={handleCopyCode}
                variant="outline"
                className="w-full"
              >
                <Copy className="h-4 w-4 mr-2" />
                {copied ? 'Berhasil Disalin!' : 'Salin Kode'}
              </Button>
            </div>

            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <p className="text-sm text-yellow-700 dark:text-yellow-300 font-medium mb-2">
                ⚠️ Penting:
              </p>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Kode redeem ini hanya dapat digunakan 1 kali</li>
                <li>• Jangan berikan kode ini kepada orang lain</li>
                <li>• Gunakan kode ini segera sebelum kadaluarsa</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button
              className="w-full gradient-brand text-white"
              onClick={() => {
                setIsSuccessOpen(false);
                setSelectedProduct(null);
              }}
            >
              Tutup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
