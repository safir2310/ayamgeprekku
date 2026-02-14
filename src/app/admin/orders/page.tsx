'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/store';
import { formatCurrency, formatDate } from '@/lib/helpers';
import {
  ShoppingCart,
  Search,
  ArrowLeft,
  Clock,
  Package,
  CheckCircle2,
  XCircle,
  Phone,
  MapPin,
} from 'lucide-react';

export default function AdminOrdersPage() {
  const { user } = useStore();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const statusOptions = [
    { value: '', label: 'Semua Status' },
    { value: 'Menunggu', label: 'Menunggu' },
    { value: 'Diproses', label: 'Diproses' },
    { value: 'Selesai', label: 'Selesai' },
    { value: 'Cancel', label: 'Cancel' },
  ];

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const url = filterStatus
        ? `/api/transactions?status=${filterStatus}`
        : '/api/transactions';
      const response = await fetch(url);
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

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      // TODO: Create PUT/PATCH API endpoint for updating order status
      alert(`Status pesanan diubah ke ${newStatus}`);
      fetchOrders();
    } catch (error) {
      alert('Terjadi kesalahan');
    }
  };

  const filteredOrders = orders.filter((order) =>
    order.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.strukId.includes(searchTerm)
  );

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
        return <Clock className="h-4 w-4" />;
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
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Kelola Pesanan
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Total {orders.length} pesanan
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari pesanan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Orders List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
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
                            {formatDate(order.createdAt)} • {order.nama}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`flex items-center gap-2 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Order Items */}
                      <div className="lg:col-span-2">
                        <h4 className="font-semibold mb-3 flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4" />
                          Item Pesanan
                        </h4>
                        <div className="space-y-2">
                          {order.transaksiItem.map((item: any) => (
                            <div
                              key={item.id}
                              className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">
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
                        <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex justify-between text-lg">
                            <span>Subtotal</span>
                            <span className="font-semibold">
                              {formatCurrency(order.total)}
                            </span>
                          </div>
                          {order.saldoDipakai > 0 && (
                            <div className="flex justify-between text-green-600 mt-2">
                              <span>Diskon Saldo</span>
                              <span className="font-medium">
                                -{formatCurrency(order.saldoDipakai)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between text-xl font-bold pt-2 mt-2 border-t">
                            <span>Total</span>
                            <span className="text-orange-600">
                              {formatCurrency(order.total - order.saldoDipakai)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Customer Info & Actions */}
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold mb-3">Informasi Pelanggan</h4>
                          <div className="space-y-2">
                            <div className="flex items-start gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {order.alamat}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600 dark:text-gray-400">
                                {order.noHp}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div>
                          <h4 className="font-semibold mb-3">Update Status</h4>
                          <div className="space-y-2">
                            {order.status === 'Menunggu' && (
                              <Button
                                onClick={() => updateOrderStatus(order.id, 'Diproses')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Mulai Proses
                              </Button>
                            )}
                            {order.status === 'Diproses' && (
                              <Button
                                onClick={() => updateOrderStatus(order.id, 'Selesai')}
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                              >
                                Selesaikan
                              </Button>
                            )}
                            {order.status !== 'Selesai' && order.status !== 'Cancel' && (
                              <Button
                                variant="outline"
                                className="w-full text-red-600 hover:bg-red-50"
                                onClick={() => updateOrderStatus(order.id, 'Cancel')}
                              >
                                Batalkan
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredOrders.length === 0 && !loading && (
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada pesanan ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
