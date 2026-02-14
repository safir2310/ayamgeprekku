'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useStore } from '@/store/store';
import { Gift, Plus, Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

interface ProdukPoint {
  id: string;
  nama: string;
  deskripsi: string | null;
  poin: number;
  gambar: string | null;
  isAvailable: boolean;
  createdAt: string;
}

export default function PointProductsPage() {
  const { user } = useStore();
  const [products, setProducts] = useState<ProdukPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProdukPoint | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<ProdukPoint | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    nama: '',
    deskripsi: '',
    poin: '',
    gambar: '',
    isAvailable: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleOpenDialog = (product?: ProdukPoint) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nama: product.nama,
        deskripsi: product.deskripsi || '',
        poin: product.poin.toString(),
        gambar: product.gambar || '',
        isAvailable: product.isAvailable,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nama: '',
        deskripsi: '',
        poin: '',
        gambar: '',
        isAvailable: true,
      });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
    setFormData({
      nama: '',
      deskripsi: '',
      poin: '',
      gambar: '',
      isAvailable: true,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const url = editingProduct
        ? `/api/point-products/${editingProduct.id}`
        : '/api/point-products';

      const response = await fetch(url, {
        method: editingProduct ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nama: formData.nama,
          deskripsi: formData.deskripsi || null,
          poin: parseInt(formData.poin),
          gambar: formData.gambar || null,
          isAvailable: formData.isAvailable,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: editingProduct ? 'Produk berhasil diupdate' : 'Produk berhasil ditambahkan' });
        handleCloseDialog();
        fetchProducts();
      } else {
        setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menyimpan produk' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingProduct) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/point-products/${deletingProduct.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'Produk berhasil dihapus' });
        setIsDeleteDialogOpen(false);
        setDeletingProduct(null);
        fetchProducts();
      } else {
        setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat menghapus produk' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleAvailable = async (product: ProdukPoint) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/point-products/${product.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          isAvailable: !product.isAvailable,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchProducts();
      } else {
        setMessage({ type: 'error', text: data.message || 'Terjadi kesalahan' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Terjadi kesalahan saat mengupdate status' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Produk Tukar Poin
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Kelola produk yang dapat ditukar dengan poin
              </p>
            </div>
            <Button
              className="gradient-brand text-white button-hover"
              onClick={() => handleOpenDialog()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </div>
        </motion.div>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              message.type === 'success'
                ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
            }`}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}

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
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="h-full flex flex-col card-hover border-2">
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                    {product.gambar ? (
                      <img
                        src={product.gambar}
                        alt={product.nama}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Gift className="h-20 w-20 text-purple-400" />
                    )}
                    <div className="absolute top-3 right-3">
                      <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {product.poin} Poin
                      </div>
                    </div>
                    {!product.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">Tidak Tersedia</span>
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
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Status:</span>
                        <Switch
                          checked={product.isAvailable}
                          onCheckedChange={() => handleToggleAvailable(product)}
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleOpenDialog(product)}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 text-red-600 hover:text-red-700 border-red-300"
                          onClick={() => {
                            setDeletingProduct(product);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Belum Ada Produk</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Mulai tambahkan produk yang bisa ditukar dengan poin
              </p>
              <Button
                className="gradient-brand text-white"
                onClick={() => handleOpenDialog()}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gradient-brand">
              {editingProduct ? 'Edit Produk' : 'Tambah Produk Baru'}
            </DialogTitle>
            <DialogDescription>
              {editingProduct
                ? 'Update informasi produk tukar poin'
                : 'Tambah produk baru yang bisa ditukar dengan poin'}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nama">Nama Produk *</Label>
              <Input
                id="nama"
                placeholder="Contoh: Diskon Rp 10.000"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deskripsi">Deskripsi</Label>
              <Textarea
                id="deskripsi"
                placeholder="Deskripsi produk..."
                value={formData.deskripsi}
                onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="poin">Poin yang Diperlukan *</Label>
              <Input
                id="poin"
                type="number"
                placeholder="Contoh: 100"
                value={formData.poin}
                onChange={(e) => setFormData({ ...formData, poin: e.target.value })}
                required
                min="1"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                1 Poin = Rp 100
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gambar">URL Gambar</Label>
              <Input
                id="gambar"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={formData.gambar}
                onChange={(e) => setFormData({ ...formData, gambar: e.target.value })}
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Opsional. Kosongkan untuk menggunakan ikon default
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isAvailable"
                checked={formData.isAvailable}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, isAvailable: checked })
                }
              />
              <Label htmlFor="isAvailable" className="cursor-pointer">
                Produk Tersedia
              </Label>
            </div>
          </form>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              className="gradient-brand text-white"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Memproses...' : editingProduct ? 'Update' : 'Simpan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-red-600">
              Hapus Produk?
            </DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>

          {deletingProduct && (
            <Card className="bg-gray-50 dark:bg-gray-800">
              <CardContent className="p-4">
                <h4 className="font-semibold">{deletingProduct.nama}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {deletingProduct.poin} Poin
                </p>
              </CardContent>
            </Card>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
