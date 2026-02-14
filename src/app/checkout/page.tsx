'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useStore } from '@/store/store';
import { formatCurrency } from '@/lib/helpers';
import { ShoppingCart, Wallet, CheckCircle2, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { user, cart, getCartTotal, removeFromCart, updateCartQuantity, clearCart } = useStore();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    alamat: user?.alamat || '',
    catatan: '',
    useSaldo: false,
    saldoAmount: 0,
  });
  const [agreed, setAgreed] = useState(false);

  const cartTotal = getCartTotal();
  const maxSaldo = Math.min(formData.saldoAmount, user?.saldo || 0, cartTotal);
  const finalTotal = cartTotal - maxSaldo;

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
    if (cart.length === 0) {
      router.push('/');
    }
  }, [user, cart, router]);

  const handleRemoveItem = (produkId: string) => {
    removeFromCart(produkId);
  };

  const handleQuantityChange = (produkId: string, quantity: number) => {
    updateCartQuantity(produkId, quantity);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cart,
          alamat: formData.alamat,
          catatan: formData.catatan,
          useSaldo: formData.useSaldo,
          saldoAmount: maxSaldo,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear cart
        clearCart();

        // Redirect to WhatsApp
        window.open(data.data.whatsappUrl, '_blank');

        // Show success message and redirect to dashboard
        router.push('/dashboard/orders');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan saat checkout');
    } finally {
      setLoading(false);
    }
  };

  if (!user || cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Checkout
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Review dan selesaikan pesanan Anda
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2 space-y-4"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Keranjang Belanja ({cart.length} item)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      <span className="text-6xl">{item.gambar || '🍗'}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{item.nama}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {formatCurrency(item.harga)}
                      </p>
                      <div className="flex items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleQuantityChange(item.produkId, item.jumlah - 1)
                          }
                          disabled={item.jumlah <= 1}
                        >
                          -
                        </Button>
                        <span className="font-medium">{item.jumlah}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() =>
                            handleQuantityChange(item.produkId, item.jumlah + 1)
                          }
                        >
                          +
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="ml-auto text-red-600 hover:text-red-700"
                          onClick={() => handleRemoveItem(item.produkId)}
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-orange-600">
                        {formatCurrency(item.harga * item.jumlah)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pengiriman</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat Lengkap *</Label>
                  <textarea
                    id="alamat"
                    value={formData.alamat}
                    onChange={(e) =>
                      setFormData({ ...formData, alamat: e.target.value })
                    }
                    placeholder="Masukkan alamat lengkap pengiriman"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="catatan">Catatan (Opsional)</Label>
                  <textarea
                    id="catatan"
                    value={formData.catatan}
                    onChange={(e) =>
                      setFormData({ ...formData, catatan: e.target.value })
                    }
                    placeholder="Tambahkan catatan untuk pesanan Anda"
                    className="w-full min-h-[80px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Subtotal */}
                <div className="flex justify-between text-lg">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(cartTotal)}
                  </span>
                </div>

                {/* Wallet Section */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Gunakan Saldo</span>
                    </div>
                    <Checkbox
                      id="useSaldo"
                      checked={formData.useSaldo}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          useSaldo: checked as boolean,
                          saldoAmount: checked
                            ? Math.min(user?.saldo || 0, cartTotal)
                            : 0,
                        })
                      }
                    />
                  </div>

                  {formData.useSaldo && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <div className="flex items-center justify-between text-sm">
                        <span>Saldo Tersedia:</span>
                        <span className="font-semibold">
                          {formatCurrency(user?.saldo || 0)}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="saldoAmount">
                          Jumlah Saldo yang Digunakan:
                        </Label>
                        <Input
                          id="saldoAmount"
                          type="number"
                          value={formData.saldoAmount}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              saldoAmount: Math.min(
                                parseFloat(e.target.value) || 0,
                                user?.saldo || 0,
                                cartTotal
                              ),
                            })
                          }
                          max={user?.saldo || 0}
                          min={0}
                          step={100}
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            setFormData({
                              ...formData,
                              saldoAmount: Math.min(
                                user?.saldo || 0,
                                cartTotal
                              ),
                            })
                          }
                        >
                          Gunakan Semua
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            setFormData({ ...formData, saldoAmount: 0 })
                          }
                        >
                          Set 0
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Discount */}
                {maxSaldo > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Diskon Saldo</span>
                    <span className="font-semibold">
                      -{formatCurrency(maxSaldo)}
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-2xl font-bold">
                    <span>Total</span>
                    <span className="text-orange-600">
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Agreement */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="agree"
                    checked={agreed}
                    onCheckedChange={(checked) => setAgreed(checked as boolean)}
                  />
                  <Label
                    htmlFor="agree"
                    className="text-sm leading-tight cursor-pointer"
                  >
                    Saya setuju dengan syarat dan ketentuan yang berlaku
                  </Label>
                </div>

                {/* Submit Button */}
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !agreed || !formData.alamat}
                  className="w-full gradient-brand text-white py-6 text-lg button-hover"
                >
                  {loading ? 'Memproses...' : (
                    <>
                      <ArrowRight className="h-5 w-5 mr-2" />
                      Pesan Sekarang
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-gray-500">
                  Pesanan akan dikirim ke WhatsApp setelah checkout
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
