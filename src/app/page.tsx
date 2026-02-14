'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Star, Flame, Zap, Search, X, Filter } from 'lucide-react';
import { Logo } from '@/components/logo';
import { useStore } from '@/store/store';
import { formatCurrency } from '@/lib/helpers';

interface Product {
  id: string;
  nama: string;
  deskripsi: string;
  harga: number;
  kategori: string;
  promo: boolean;
  diskon: number;
  gambar?: string;
}

export default function HomePage() {
  const { addToCart } = useStore();
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isSearching, setIsSearching] = useState(false);

  // Computed displayed products based on search and category
  const displayedProducts = useMemo(() => {
    if (isSearching) {
      return allProducts.filter((product) => {
        const matchesSearch =
          product.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.deskripsi.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory =
          selectedCategory === 'all' || product.kategori.toLowerCase() === selectedCategory.toLowerCase();

        return matchesSearch && matchesCategory;
      });
    }
    return featuredProducts;
  }, [isSearching, searchQuery, selectedCategory, allProducts, featuredProducts]);

  useEffect(() => {
    // Fetch products from API
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.data && Array.isArray(data.data)) {
          setAllProducts(data.data);
          setFeaturedProducts(data.data.slice(0, 4));
        }
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
        setAllProducts([]);
        setFeaturedProducts([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const categories = [
    { id: 'all', name: 'Semua', icon: '🍽️', count: 0 },
    { id: 'makanan', name: 'Makanan', icon: '🍗', count: 12 },
    { id: 'minuman', name: 'Minuman', icon: '🥤', count: 8 },
    { id: 'promo', name: 'Promo', icon: '🔥', count: 5 },
    { id: 'diskon', name: 'Diskon', icon: '💰', count: 7 },
    { id: 'terbaru', name: 'Terbaru', icon: '✨', count: 3 },
  ];

  const handleAddToCart = (product: any) => {
    addToCart({
      produkId: product.id,
      nama: product.nama,
      harga: product.harga,
      gambar: product.gambar,
      jumlah: 1,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    setSelectedCategory('all');
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (!isSearching && categoryId !== 'all') {
      setIsSearching(true);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 gradient-brand opacity-90" />
        <div className="absolute inset-0 bg-black/10" />

        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-5xl mx-auto text-center">
            {/* Hero Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Flame className="h-4 w-4 text-yellow-200" />
                <span className="text-white text-sm font-medium">
                  Promo Spesial Hari Ini!
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                AYAM GEPREK
                <br />
                <span className="text-yellow-300">SAMBAL IJO</span>
              </h1>

              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl mx-auto">
                Pedasnya bikin nagih! 🔥 Nikmati ayam geprek dengan sambal ijo yang
                menggugah selera. Kualitas terbaik, harga terjangkau!
              </p>

              {/* Search Bar */}
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari menu favorit Anda..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-24 h-14 text-lg shadow-xl bg-white/95 backdrop-blur-sm"
                  />
                  {searchQuery && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-100"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              </form>

              <div className="flex flex-wrap gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-white text-orange-600 hover:bg-yellow-100 button-hover shadow-lg text-lg px-8"
                  onClick={() => {}}
                >
                  Pesan Sekarang
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 button-hover text-lg px-8"
                  onClick={() => {
                    const menuSection = document.getElementById('menu');
                    menuSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Lihat Menu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-12 bg-gradient-to-r from-red-600 to-orange-600">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="flex flex-col md:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3">
                <Zap className="h-8 w-8 text-yellow-300" />
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  PROMO SPESIAL!
                </h2>
              </div>
              <p className="text-white/90 text-lg">
                Diskon hingga <span className="font-bold text-yellow-300">20%</span> untuk semua menu
              </p>
              <Button
                size="lg"
                className="bg-white text-red-600 hover:bg-yellow-100 button-hover"
                onClick={() => {}}
              >
                Pesan Sekarang
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="menu" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-brand">
              Kategori Menu
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Temukan berbagai menu lezat yang siap menggugah selera Anda
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card
                  className={`cursor-pointer card-hover text-center p-6 border-2 transition-all ${
                    selectedCategory === category.id
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                      : 'hover:border-orange-400'
                  }`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CardContent className="p-0">
                    <div className="text-4xl mb-3">{category.icon}</div>
                    <h3 className="font-semibold mb-1 text-sm md:text-base">{category.name}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Search/Filter Info */}
          {(isSearching || selectedCategory !== 'all') && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 text-center"
            >
              <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-700 dark:text-blue-300">
                  {isSearching && searchQuery && `Hasil pencarian: "${searchQuery}"`}
                  {isSearching && searchQuery && selectedCategory !== 'all' && ' • '}
                  {selectedCategory !== 'all' && `Kategori: ${categories.find(c => c.id === selectedCategory)?.name}`}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearSearch}
                  className="h-6 px-2 text-blue-600 hover:bg-blue-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-brand">
              {isSearching ? 'Hasil Pencarian' : 'Menu Unggulan'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {isSearching
                ? `Menampilkan ${displayedProducts.length} produk`
                : 'Menu paling favorit dan banyak dipesan oleh pelanggan kami'}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoading ? (
              [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <Card className="h-full">
                    <CardContent className="p-0">
                      <div className="h-48 bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-6 bg-gray-200 rounded w-3/4" />
                        <div className="h-4 bg-gray-200 rounded w-full" />
                        <div className="flex items-center justify-between mt-3">
                          <div className="h-6 bg-gray-200 rounded w-1/2" />
                          <div className="h-8 w-8 bg-gray-200 rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="card-hover overflow-hidden border-2 hover:border-orange-400 h-full">
                    <CardContent className="p-0">
                      {/* Product Image */}
                      <div className="relative h-48 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
                        {product.gambar ? (
                          <img src={product.gambar} alt={product.nama} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-8xl">🍗</span>
                        )}
                        {product.promo && (
                          <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                            Promo {product.diskon}%
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                          onClick={() => {}}
                        >
                          <Star className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Product Info */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{product.nama}</h3>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {product.deskripsi}
                          </p>
                        </div>

                        <div className="flex items-center justify-between">
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
                          <Button
                            size="sm"
                            className="gradient-brand text-white button-hover"
                            onClick={() => handleAddToCart(product)}
                          >
                            +
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-4 text-center py-12">
                <div className="flex flex-col items-center gap-4">
                  <Search className="h-16 w-16 text-gray-400" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {isSearching ? 'Tidak Ada Hasil' : 'Belum Ada Produk'}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {isSearching
                      ? `Tidak ada produk yang cocok dengan pencarian "${searchQuery}"`
                      : 'Belum ada produk tersedia'}
                  </p>
                  {isSearching && (
                    <Button
                      variant="outline"
                      onClick={clearSearch}
                      className="mt-4"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Hapus Pencarian
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>

          {!isSearching && displayedProducts.length > 0 && (
            <div className="text-center mt-8">
              <Button
                size="lg"
                variant="outline"
                className="gradient-brand text-white border-none button-hover px-8"
                onClick={() => {
                  setIsSearching(true);
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Lihat Semua Menu
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gradient-brand">
              Kenapa Pilih Kami?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.5 }}
            >
              <Card className="card-hover text-center p-8">
                <CardContent className="p-0">
                  <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                    ⚡
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Pesan Cepat</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Proses pemesanan yang cepat dan mudah langsung dari WhatsApp
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Card className="card-hover text-center p-8">
                <CardContent className="p-0">
                  <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                    💎
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Kualitas Terbaik</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Bahan-bahan segar dengan resep rahasia yang nikmat
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Card className="card-hover text-center p-8">
                <CardContent className="p-0">
                  <div className="w-16 h-16 gradient-brand rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl">
                    🎁
                  </div>
                  <h3 className="font-semibold text-xl mb-2">Point Reward</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Kumpulkan poin dari setiap pembelian dan tukarkan dengan hadiah
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 gradient-brand">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Siap Mencoba?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Pesan sekarang dan nikmati ayam geprek sambal ijo terbaik!
            </p>
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-yellow-100 shadow-lg text-xl px-12 py-6"
              onClick={() => {}}
            >
              Pesan Sekarang
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
