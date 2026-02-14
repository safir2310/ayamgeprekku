'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/store';
import { formatCurrency } from '@/lib/helpers';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  Clock,
  TrendingUp,
  Gift,
  Settings,
  Store,
  LogOut,
  ChevronRight,
  ArrowLeft,
  Check,
  ChevronUp,
} from 'lucide-react';

type TabId = 'overview' | 'products' | 'orders' | 'users' | 'redeem' | 'settings';

const tabs = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'from-orange-500 to-orange-600' },
  { id: 'products', label: 'Produk', icon: Package, color: 'from-blue-500 to-blue-600' },
  { id: 'orders', label: 'Pesanan', icon: ShoppingCart, color: 'from-green-500 to-emerald-600' },
  { id: 'users', label: 'Users', icon: Users, color: 'from-purple-500 to-purple-600' },
  { id: 'redeem', label: 'Redeem', icon: Gift, color: 'from-pink-500 to-pink-600' },
  { id: 'settings', label: 'Settings', icon: Settings, color: 'from-gray-500 to-gray-600' },
];

export default function AdminDashboard() {
  const { user, logout } = useStore();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalProducts: 45,
    totalUsers: 128,
    totalOrders: 892,
    totalRevenue: 15680000,
    pendingOrders: 12,
    todayOrders: 24,
  });

  useEffect(() => {
    setTimeout(() => setLoading(false), 500);
  }, []);

  useEffect(() => {
    if (user && user.role !== 'admin') {
      window.location.href = '/dashboard';
    }
  }, [user]);

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
          <p className="mb-4 text-gray-600">Silakan login sebagai admin</p>
          <Link href="/login">
            <button className="gradient-brand text-white px-6 py-2 rounded-lg">
              Masuk
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const activeTabData = tabs.find((t) => t.id === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Admin Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-brand rounded-lg flex items-center justify-center text-white">
                  <LayoutDashboard className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
                  </h1>
                  <p className="text-sm text-gray-500">
                    {user.username}
                  </p>
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>

              <button
                onClick={logout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="flex-1 flex">
        {/* Sidebar Tabs */}
        <div className="hidden md:flex w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex-col">
          <nav className="flex-1 py-6 px-3 space-y-1">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    relative w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-300
                    ${isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTabIndicator"
                      className="absolute left-0 right-0 bottom-0 h-0.5 bg-white/50 rounded-full"
                      initial={false}
                      animate={{ opacity: 1 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && <OverviewTab stats={stats} />}
                {activeTab === 'products' && <ProductsTab />}
                {activeTab === 'orders' && <OrdersTab />}
                {activeTab === 'users' && <UsersTab />}
                {activeTab === 'redeem' && <RedeemTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ stats }: { stats: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Dashboard Overview
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Package}
          title="Total Produk"
          value={stats.totalProducts}
          color="from-orange-500 to-orange-600"
          trend="+5"
        />
        <StatCard
          icon={Users}
          title="Total User"
          value={stats.totalUsers}
          color="from-blue-500 to-blue-600"
          trend="+12"
        />
        <StatCard
          icon={ShoppingCart}
          title="Total Pesanan"
          value={stats.totalOrders}
          color="from-green-500 to-emerald-600"
          trend="+24"
        />
        <StatCard
          icon={DollarSign}
          title="Total Pendapatan"
          value={formatCurrency(stats.totalRevenue)}
          color="from-purple-500 to-purple-600"
          trend="+18%"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pesanan Menunggu
                </p>
                <p className="text-2xl font-bold text-yellow-600 mt-1">
                  {stats.pendingOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Pesanan Hari Ini
                </p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {stats.todayOrders}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-500" />
            Aktivitas Terbaru
          </h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Pesanan baru #0892</p>
                <p className="text-sm text-gray-500">Baru saja • Menunggu</p>
              </div>
              <span className="text-xs text-gray-400">2 menit yang lalu</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">User baru mendaftar</p>
                <p className="text-sm text-gray-500">user125 • Silver Member</p>
              </div>
              <span className="text-xs text-gray-400">5 menit yang lalu</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                <Gift className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Redeem code ditukar</p>
                <p className="text-sm text-gray-500">AYAM-2024-1234 • 1000 poin</p>
              </div>
              <span className="text-xs text-gray-400">10 menit yang lalu</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProductsTab() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Kelola Produk
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Halaman kelola produk dipindahkan ke tab terpisah
      </p>
      <Link href="/admin/produk">
        <Button className="gradient-brand text-white">
          Buka Halaman Produk
          <ChevronUp className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}

function OrdersTab() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <ShoppingCart className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Kelola Pesanan
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Halaman kelola pesanan dipindahkan ke tab terpisah
      </p>
      <Link href="/admin/orders">
        <Button className="gradient-brand text-white">
          Buka Halaman Pesanan
          <ChevronUp className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}

function UsersTab() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Users className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Kelola User
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Halaman kelola user dipindahkan ke tab terpisah
      </p>
      <Link href="/admin/users">
        <Button className="gradient-brand text-white">
          Buka Halaman User
          <ChevronUp className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}

function RedeemTab() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Kelola Redeem Codes
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Link href="/admin/redeem-codes">
          <Card className="card-hover h-full">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Redeem Codes</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kelola kode redeem untuk user
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/point-products">
          <Card className="card-hover h-full">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
                <Store className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Produk Tukar Poin</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kelola produk yang bisa ditukar dengan poin
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function SettingsTab() {
  return (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <Settings className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Pengaturan
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Halaman pengaturan dipindahkan ke tab terpisah
      </p>
      <Link href="/admin/settings">
        <Button className="gradient-brand text-white">
          Buka Halaman Settings
          <ChevronUp className="h-4 w-4 ml-2" />
        </Button>
      </Link>
    </div>
  );
}

function StatCard({ icon: Icon, title, value, color, trend }: any) {
  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <div
            className={`w-12 h-12 bg-gradient-to-br ${color} rounded-full flex items-center justify-center`}
          >
            <Icon className="h-6 w-6 text-white" />
          </div>
          {trend && (
            <Badge className="bg-green-100 text-green-700">
              <Check className="h-3 w-3" />
              {trend}
            </Badge>
          )}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
