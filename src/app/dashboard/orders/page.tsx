'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/store';
import { formatCurrency, formatDate } from '@/lib/helpers';
import { History, Package, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function OrdersPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'Diproses':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      case 'Selesai':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300';
      case 'Cancel':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Menunggu':
        return <Clock className="h-4 w-4" />;
      case 'Diproses':
        return <Package className="h-4 w-4" />;
      case 'Selesai':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'Cancel':
        return <XCircle className="h-4 w-4" />;
      default:
        return <History className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Riwayat Pesanan
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Lihat semua pesanan Anda di sini
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="h-12 w-12 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Belum ada pesanan
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Anda belum memiliki pesanan. Mulai pesan ayam geprek favorit Anda!
              </p>
              <Button className="gradient-brand text-white" onClick={() => window.location.href = '/'}>
                Pesan Sekarang
              </Button>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            Order #{order.strukId}
                          </CardTitle>
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                        </div>
                      </div>
                      <Badge className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Items */}
                      <div className="space-y-2">
                        {order.transaksiItem.map((item: any) => (
                          <div
                            key={item.id}
                            className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-3xl">
                                {item.produk?.gambar || '🍗'}
                              </span>
                              <div>
                                <p className="font-medium">{item.produk?.nama}</p>
                                <p className="text-sm text-gray-500">
                                  {item.jumlah} x {formatCurrency(item.harga)}
                                </p>
                              </div>
                            </div>
                            <p className="font-semibold text-orange-600">
                              {formatCurrency(item.subtotal)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Pricing */}
                      <div className="border-t pt-4 space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-medium">
                            {formatCurrency(order.total)}
                          </span>
                        </div>
                        {order.saldoDipakai > 0 && (
                          <div className="flex justify-between text-green-600">
                            <span>Diskon Saldo</span>
                            <span className="font-medium">
                              -{formatCurrency(order.saldoDipakai)}
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between text-xl font-bold pt-2 border-t">
                          <span>Total</span>
                          <span className="text-orange-600">
                            {formatCurrency(order.total - order.saldoDipakai)}
                          </span>
                        </div>
                      </div>

                      {/* Delivery Info */}
                      <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                        <p className="text-sm font-medium">Informasi Pengiriman:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📍 {order.alamat}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          📞 {order.noHp}
                        </p>
                        {order.catatan && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            📝 {order.catatan}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
