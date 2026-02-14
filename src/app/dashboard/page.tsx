'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/store';
import { formatCurrency } from '@/lib/helpers';
import {
  ShoppingCart,
  Wallet,
  History,
  User,
  Gift,
  ArrowRight,
  Clock,
  Coins,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, cart, getCartTotal, getCartItemsCount } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    setTimeout(() => setLoading(false), 500);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4 text-gray-600">Silakan login terlebih dahulu</p>
          <Link href="/login">
            <Button className="gradient-brand text-white">Masuk</Button>
          </Link>
        </div>
      </div>
    );
  }

  const cartTotal = getCartTotal();
  const cartItemsCount = getCartItemsCount();

  const menuItems = [
    {
      title: 'Keranjang',
      description: `${cartItemsCount} item dalam keranjang`,
      icon: ShoppingCart,
      color: 'from-orange-500 to-orange-600',
      href: '/dashboard#cart',
      action: 'Lihat Keranjang',
    },
    {
      title: 'Wallet & Poin',
      description: formatCurrency(user.saldo || 0),
      icon: Wallet,
      color: 'from-green-500 to-emerald-600',
      href: '/dashboard/wallet',
      action: 'Kelola Wallet',
    },
    {
      title: 'Riwayat Pesanan',
      description: 'Lihat pesanan Anda',
      icon: History,
      color: 'from-blue-500 to-blue-600',
      href: '/dashboard/orders',
      action: 'Lihat Riwayat',
    },
    {
      title: 'Tukar Poin',
      description: 'Tukar poin dengan hadiah',
      icon: Coins,
      color: 'from-purple-500 to-purple-600',
      href: '/dashboard/point-redeem',
      action: 'Tukar Sekarang',
    },
    {
      title: 'Profile',
      description: 'Edit profil Anda',
      icon: User,
      color: 'from-gray-500 to-gray-600',
      href: '/dashboard/profile',
      action: 'Edit Profile',
    },
  ];

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
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Selamat datang, {user.username}! 👋
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className={`bg-gradient-to-r ${getMemberLevelColor(user.memberLevel)} text-white text-sm px-4 py-2`}>
                {user.memberLevel} Member
              </Badge>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Saldo Wallet</p>
                  <p className="text-2xl font-bold text-green-600 mt-1">
                    {formatCurrency(user.saldo || 0)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Item di Keranjang</p>
                  <p className="text-2xl font-bold text-orange-600 mt-1">
                    {cartItemsCount}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Member Level</p>
                  <p className="text-2xl font-bold text-purple-600 mt-1">
                    {user.memberLevel}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <Badge className={`bg-gradient-to-r ${getMemberLevelColor(user.memberLevel)} text-white`}>
                    <User className="h-4 w-4 mr-1" />
                    {user.memberLevel.charAt(0)}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link href={item.href}>
                <Card className="card-hover h-full">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.description}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-gradient-to-r hover:opacity-90 text-white" style={{ background: `linear-gradient(to right, ${item.color})` }}>
                      {item.action}
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-12 text-gray-500">
                <div className="text-center">
                  <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Aktivitas Anda akan muncul di sini</p>
                  <Link
                    href="/dashboard/orders"
                    className="text-orange-600 hover:underline mt-2 inline-block"
                  >
                    Lihat riwayat pesanan
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

function getMemberLevelColor(level: string): string {
  switch (level) {
    case 'Platinum':
      return 'from-purple-500 to-pink-500';
    case 'Gold':
      return 'from-yellow-400 to-orange-500';
    case 'Silver':
      return 'from-gray-300 to-gray-500';
    default:
      return 'from-gray-300 to-gray-500';
  }
}
