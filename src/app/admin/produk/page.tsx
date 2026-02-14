'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useStore } from '@/store/store';
import { formatCurrency } from '@/lib/helpers';
import {
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  ArrowLeft,
  Save,
  X,
} from 'lucide-react';

export default function ProdukManagementPage() {
  const { user, token } = useStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    harga: '',
    kategori: 'makanan',
    gambar: '',
    promo: false,
    diskon: '0',
    isAvailable: true,
  });

  const kategoriOptions = [
    { value: 'makanan', label: 'Makanan' },
    { value: 'minuman', label: 'Minuman' },
    { value: 'promo', label: 'Promo' },
    { value: 'diskon', label: 'Diskon' },
    { value: 'terbaru', label: 'Terbaru' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.success) {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/products', {
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
          nama: '',
          deskripsi: '',
          harga: '',
          kategori: 'makanan',
          gambar: '',
          promo: false,
          diskon: '0',
          isAvailable: true,
        });
        fetchProducts();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Terjadi kesalahan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin ingin menghapus produk ini?')) return;

    try {
      // TODO: Create DELETE API endpoint
      alert('Fitur delete akan segera tersedia');
    } catch (error) {
      alert('Terjadi kesalahan');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.nama.toLowerCase().includes(searchTerm.toLowerCase())
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
                  Kelola Produk
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Total {products.length} produk
                </p>
              </div>
            </div>

            <Button
              onClick={() => setShowForm(true)}
              className="gradient-brand text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
        </motion.div>

        {/* Add/Edit Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="border-2 border-orange-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setShowForm(false);
                      setEditingProduct(null);
                    }}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nama">Nama Produk *</Label>
                      <Input
                        id="nama"
                        value={formData.nama}
                        onChange={(e) =>
                          setFormData({ ...formData, nama: e.target.value })
                        }
                        placeholder="Contoh: Ayam Geprek Sambal Ijo"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="harga">Harga (Rp) *</Label>
                      <Input
                        id="harga"
                        type="number"
                        value={formData.harga}
                        onChange={(e) =>
                          setFormData({ ...formData, harga: e.target.value })
                        }
                        placeholder="15000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="kategori">Kategori *</Label>
                      <select
                        id="kategori"
                        value={formData.kategori}
                        onChange={(e) =>
                          setFormData({ ...formData, kategori: e.target.value })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      >
                        {kategoriOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="diskon">Diskon (%)</Label>
                      <Input
                        id="diskon"
                        type="number"
                        value={formData.diskon}
                        onChange={(e) =>
                          setFormData({ ...formData, diskon: e.target.value })
                        }
                        placeholder="0"
                        min="0"
                        max="100"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deskripsi">Deskripsi</Label>
                    <Textarea
                      id="deskripsi"
                      value={formData.deskripsi}
                      onChange={(e) =>
                        setFormData({ ...formData, deskripsi: e.target.value })
                      }
                      placeholder="Deskripsi produk..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gambar">URL Gambar</Label>
                    <Input
                      id="gambar"
                      value={formData.gambar}
                      onChange={(e) =>
                        setFormData({ ...formData, gambar: e.target.value })
                      }
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.promo}
                        onChange={(e) =>
                          setFormData({ ...formData, promo: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span>Produk Promo</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isAvailable}
                        onChange={(e) =>
                          setFormData({ ...formData, isAvailable: e.target.checked })
                        }
                        className="w-4 h-4"
                      />
                      <span>Tersedia</span>
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="submit"
                      className="gradient-brand text-white flex-1"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Simpan Produk
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowForm(false);
                        setEditingProduct(null);
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari produk..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="card-hover h-full">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-4xl">{product.gambar ? '🍗' : '🍗'}</span>
                        <Badge
                          className={`${
                            product.kategori === 'promo'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {product.kategori}
                        </Badge>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => {
                            setEditingProduct(product);
                            setFormData({
                              nama: product.nama,
                              deskripsi: product.deskripsi || '',
                              harga: product.harga.toString(),
                              kategori: product.kategori,
                              gambar: product.gambar || '',
                              promo: product.promo,
                              diskon: product.diskon?.toString() || '0',
                              isAvailable: product.isAvailable,
                            });
                            setShowForm(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <h3 className="font-semibold text-lg mb-1">{product.nama}</h3>
                    {product.deskripsi && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {product.deskripsi}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div>
                        {product.promo && product.diskon > 0 && (
                          <p className="text-sm text-gray-400 line-through">
                            {formatCurrency(product.harga)}
                          </p>
                        )}
                        <p className="text-xl font-bold text-orange-600">
                          {formatCurrency(
                            product.harga * (1 - (product.diskon || 0) / 100)
                          )}
                        </p>
                      </div>
                      {product.promo && (
                        <Badge className="bg-red-500 text-white">PROMO</Badge>
                      )}
                    </div>

                    {!product.isAvailable && (
                      <div className="mt-2">
                        <Badge className="bg-gray-400 text-white w-full justify-center">
                          Tidak Tersedia
                        </Badge>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 && !loading && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Tidak ada produk ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}
