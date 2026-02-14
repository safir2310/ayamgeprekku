'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/store';
import { formatPoints } from '@/lib/helpers';
import { Gift, Plus, Copy, ArrowLeft, Save, Trash2 } from 'lucide-react';

export default function RedeemCodesPage() {
  const { user, token } = useStore();
  const [codes, setCodes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    kode: '',
    poin: '',
    aktif: true,
    expired: false,
    expiredAt: '',
  });

  useEffect(() => {
    fetchCodes();
  }, []);

  const fetchCodes = async () => {
    try {
      const response = await fetch('/api/redeem-codes');
      const data = await response.json();
      if (data.success) {
        setCodes(data.data);
      }
    } catch (error) {
      console.error('Error fetching redeem codes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/redeem-codes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setShowForm(false);
        setFormData({
          kode: '',
          poin: '',
          aktif: true,
          expired: false,
          expiredAt: '',
        });
        fetchCodes();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error creating redeem code:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleCopyCode = (kode: string) => {
    navigator.clipboard.writeText(kode);
    alert('Kode berhasil disalin!');
  };

  const handleToggleActive = async (id: string) => {
    try {
      const code = codes.find((c) => c.id === id);
      if (!code) return;

      const response = await fetch('/api/redeem-codes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          id,
          aktif: !code.aktif,
          expired: code.expired,
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchCodes();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error updating redeem code:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus kode ini?')) return;

    try {
      const response = await fetch(`/api/redeem-codes?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        fetchCodes();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error deleting redeem code:', error);
      alert('Terjadi kesalahan');
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
      <div className="container mx-auto px-4 max-w-5xl">
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
                  Kelola Redeem Codes
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Total {codes.length} kode redeem
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="gradient-brand text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Buat Kode Baru
            </Button>
          </div>
        </motion.div>

        {/* Create Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-orange-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Buat Kode Redeem Baru</CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowForm(false)}
                  >
                    ✕
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreate} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="kode">Kode (Opsional)</Label>
                      <Input
                        id="kode"
                        value={formData.kode}
                        onChange={(e) =>
                          setFormData({ ...formData, kode: e.target.value })
                        }
                        placeholder="Kosongkan untuk generate otomatis"
                      />
                      <p className="text-xs text-gray-500">
                        Kosongkan untuk generate kode acak
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="poin">Jumlah Poin *</Label>
                      <Input
                        id="poin"
                        type="number"
                        value={formData.poin}
                        onChange={(e) =>
                          setFormData({ ...formData, poin: e.target.value })
                        }
                        placeholder="1000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="expiredAt">Tanggal Kadaluarsa (Opsional)</Label>
                      <Input
                        id="expiredAt"
                        type="datetime-local"
                        value={formData.expiredAt}
                        onChange={(e) =>
                          setFormData({ ...formData, expiredAt: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.aktif}
                        onChange={(e) =>
                          setFormData({ ...formData, aktif: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span>Aktif</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.expired}
                        onChange={(e) =>
                          setFormData({ ...formData, expired: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span>Kadaluarsa</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="gradient-brand text-white flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Kode
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowForm(false)}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Codes List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {codes.map((code, index) => (
              <motion.div
                key={code.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className={`${!code.aktif ? 'opacity-60' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-14 h-14 rounded-full flex items-center justify-center ${
                            code.aktif
                              ? 'bg-gradient-to-br from-purple-500 to-purple-600'
                              : 'bg-gray-400'
                          }`}
                        >
                          <Gift className="h-7 w-7 text-white" />
                        </div>

                        <div>
                          <h3 className="font-semibold text-lg">{code.kode}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formatPoints(code.poin)} Poin
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge
                              className={`${
                                code.aktif
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-200 text-gray-700'
                              }`}
                            >
                              {code.aktif ? 'Aktif' : 'Tidak Aktif'}
                            </Badge>
                            {code.expired && (
                              <Badge className="bg-red-100 text-red-700">
                                Kadaluarsa
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {code.aktif && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCopyCode(code.kode)}
                          >
                            <Copy className="h-4 w-4 mr-1" />
                            Salin
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleActive(code.id)}
                        >
                          {code.aktif ? 'Nonaktifkan' : 'Aktifkan'}
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(code.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {code.expiredAt && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-gray-500">
                          Kadaluarsa: {new Date(code.expiredAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {codes.length === 0 && !loading && (
          <div className="text-center py-12">
            <Gift className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Belum ada kode redeem</p>
          </div>
        )}
      </div>
    </div>
  );
}
