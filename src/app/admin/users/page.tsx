'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useStore } from '@/store/store';
import { formatCurrency } from '@/lib/helpers';
import {
  Users,
  Search,
  ArrowLeft,
  Mail,
  Phone,
  Wallet,
  Shield,
} from 'lucide-react';

export default function AdminUsersPage() {
  const { user } = useStore();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Mock users - in production, fetch from API
    setTimeout(() => {
      setUsers([
        {
          id: '1',
          userId: '0001',
          username: 'user1',
          email: 'user1@example.com',
          noHp: '08123456789',
          role: 'user',
          memberLevel: 'Silver',
          walletSaldo: { saldo: 50000 },
          totalSpent: 150000,
          createdAt: new Date(),
        },
        {
          id: '2',
          userId: '0002',
          username: 'user2',
          email: 'user2@example.com',
          noHp: '08198765432',
          role: 'user',
          memberLevel: 'Gold',
          walletSaldo: { saldo: 120000 },
          totalSpent: 600000,
          createdAt: new Date(),
        },
        {
          id: '3',
          userId: '0003',
          username: 'user3',
          email: 'user3@example.com',
          noHp: '08571234567',
          role: 'user',
          memberLevel: 'Platinum',
          walletSaldo: { saldo: 250000 },
          totalSpent: 1500000,
          createdAt: new Date(),
        },
      ]);
      setLoading(false);
    }, 500);
  });

  const getMemberLevelColor = (level: string) => {
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
  };

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.userId.includes(searchTerm)
  );

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
                  Kelola User
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Total {users.length} user terdaftar
                </p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari user..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-xs text-gray-500">Total User</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter((u) => u.memberLevel === 'Platinum').length}
                  </p>
                  <p className="text-xs text-gray-500">Platinum</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Wallet className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      users.reduce((sum, u) => sum + (u.walletSaldo?.saldo || 0), 0)
                    )}
                  </p>
                  <p className="text-xs text-gray-500">Total Saldo</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded" />
                <div>
                  <p className="text-2xl font-bold">
                    {formatCurrency(
                      users.reduce((sum, u) => sum + (u.totalSpent || 0), 0)
                    )}
                  </p>
                  <p className="text-xs text-gray-500">Total Belanja</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Users List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((userItem, index) => (
              <motion.div
                key={userItem.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 gradient-brand rounded-full flex items-center justify-center text-white text-xl font-bold">
                          {userItem.username.charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg flex items-center gap-2">
                            {userItem.username}
                            {userItem.role === 'admin' && (
                              <Badge className="bg-blue-100 text-blue-700 text-xs">
                                Admin
                              </Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            ID: {userItem.userId}
                          </p>
                          <div className="flex gap-4 mt-2 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span>{userItem.email}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              <span>{userItem.noHp}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Member Level</p>
                          <Badge
                            className={`mt-1 bg-gradient-to-r ${getMemberLevelColor(userItem.memberLevel)} text-white`}
                          >
                            {userItem.memberLevel}
                          </Badge>
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-gray-500">Saldo Wallet</p>
                          <p className="font-semibold text-green-600">
                            {formatCurrency(userItem.walletSaldo?.saldo || 0)}
                          </p>
                        </div>

                        <div className="text-center">
                          <p className="text-xs text-gray-500">Total Belanja</p>
                          <p className="font-semibold text-orange-600">
                            {formatCurrency(userItem.totalSpent || 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada user ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
