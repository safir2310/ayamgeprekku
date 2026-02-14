'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Menu, X, User, Search, MessageCircle, Home, UtensilsCrossed, Wallet, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { useStore } from '@/store/store';
import { formatCurrency, createWhatsAppMessage, getWhatsAppUrl } from '@/lib/helpers';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StoreProfile {
  nama: string;
  alamat: string;
  noHp: string;
}

export function Header() {
  const router = useRouter();
  const {
    user,
    token,
    cart,
    getCartTotal,
    getCartItemsCount,
    logout,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
  } = useStore();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  useEffect(() => {
    // Set mounted state after component mounts (client-side only)
    requestAnimationFrame(() => {
      setIsMounted(true);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch store profile
  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.profileToko) {
          setStoreProfile(data.data.profileToko);
        }
      })
      .catch((error) => {
        console.error('Error fetching store profile:', error);
        // Use default values if API fails
        setStoreProfile({
          nama: 'AYAM GEPREK SAMBAL IJO',
          alamat: 'Jl. Medan - Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 24151',
          noHp: '085260812758',
        });
      });
  }, []);

  const cartTotal = getCartTotal();
  const cartItemsCount = getCartItemsCount();

  const handleCheckout = async () => {
    if (!storeProfile || cart.length === 0) return;

    setIsCheckingOut(true);

    try {
      // Check if user is logged in
      if (!user || !token) {
        // For guest users, just send to WhatsApp without saving to database
        const orderData = {
          userName: 'Pelanggan',
          userId: 'Guest',
          address: 'Akan diinformasikan via WhatsApp',
          phone: 'Akan diinformasikan via WhatsApp',
          items: cart.map((item) => ({
            name: item.nama,
            quantity: item.jumlah,
            price: item.harga,
            subtotal: item.harga * item.jumlah,
          })),
          total: cartTotal,
          saldoUsed: 0,
          discount: 0,
          finalTotal: cartTotal,
        };

        const message = createWhatsAppMessage(orderData, storeProfile);
        const whatsappUrl = getWhatsAppUrl(storeProfile.noHp, message);

        window.open(whatsappUrl, '_blank');
        clearCart();
        setIsCartOpen(false);
        router.push('/dashboard/orders');
        setIsCheckingOut(false);
        return;
      }

      // For logged-in users, save order to database
      const orderItems = cart.map((item) => ({
        produkId: item.produkId,
        quantity: item.jumlah,
        price: item.harga,
        subtotal: item.harga * item.jumlah,
      }));

      // Save order to database
      const saveOrderResponse = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: orderItems,
          total: cartTotal,
        }),
      });

      const saveOrderData = await saveOrderResponse.json();

      if (!saveOrderResponse.ok) {
        console.error('Failed to save order:', saveOrderResponse.status, saveOrderData);
        // Continue with WhatsApp even if save fails
      } else {
        console.log('Order saved successfully:', saveOrderData);
      }

      // Create WhatsApp message
      const orderData = {
        userName: user?.username || 'Pelanggan',
        userId: user?.userId || 'Guest',
        address: user?.alamat || 'Akan diinformasikan via WhatsApp',
        phone: user?.noHp || 'Akan diinformasikan via WhatsApp',
        items: cart.map((item) => ({
          name: item.nama,
          quantity: item.jumlah,
          price: item.harga,
          subtotal: item.harga * item.jumlah,
        })),
        total: cartTotal,
        saldoUsed: 0,
        discount: 0,
        finalTotal: cartTotal,
      };

      const message = createWhatsAppMessage(orderData, storeProfile);
      const whatsappUrl = getWhatsAppUrl(storeProfile.noHp, message);

      // Open WhatsApp in new tab
      window.open(whatsappUrl, '_blank');

      // Clear cart
      clearCart();

      // Close cart sheet
      setIsCartOpen(false);

      // Redirect to order history page
      router.push('/dashboard/orders');
    } catch (error) {
      console.error('Checkout error:', error);
      // Still proceed with WhatsApp and redirect
      const orderData = {
        userName: user?.username || 'Pelanggan',
        userId: user?.userId || 'Guest',
        address: user?.alamat || 'Akan diinformasikan via WhatsApp',
        phone: user?.noHp || 'Akan diinformasikan via WhatsApp',
        items: cart.map((item) => ({
          name: item.nama,
          quantity: item.jumlah,
          price: item.harga,
          subtotal: item.harga * item.jumlah,
        })),
        total: cartTotal,
        saldoUsed: 0,
        discount: 0,
        finalTotal: cartTotal,
      };

      const message = createWhatsAppMessage(orderData, storeProfile);
      const whatsappUrl = getWhatsAppUrl(storeProfile.noHp, message);

      window.open(whatsappUrl, '_blank');
      clearCart();
      setIsCartOpen(false);
      router.push('/dashboard/orders');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const navItems = [
    { name: 'Beranda', href: '/' },
    { name: 'Menu', href: '/#menu' },
    { name: 'Promo', href: '/#promo' },
  ];

  const userMenuItems = user?.role === 'admin'
    ? [
        { name: 'Dashboard Admin', href: '/admin' },
        { name: 'Kelola Produk', href: '/admin/produk' },
        { name: 'Kelola User', href: '/admin/user' },
        { name: 'Pengaturan', href: '/admin/settings' },
      ]
    : [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Profile', href: '/dashboard' },
        { name: 'Riwayat Pesanan', href: '/dashboard/orders' },
        { name: 'Wallet', href: '/dashboard/wallet' },
      ];

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg'
            : 'bg-gradient-to-r from-orange-600 via-orange-500 to-yellow-500'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Left Section: Logo & Navigation */}
            <div className="flex items-center gap-4 md:gap-8">
              {/* Logo */}
              <Link href="/" className="flex-shrink-0 flex items-center gap-3">
                <Logo size="sm" showText={false} className={isScrolled ? '' : 'text-white'} />
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-4 md:gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`font-medium text-sm md:text-base transition-colors duration-300 hover:text-orange-400 ${
                      isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Search Button */}
              <Button
                variant="ghost"
                size="icon"
                className={`${isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}
              >
                <Search className="h-5 w-5" />
              </Button>

              {/* Cart Button */}
              <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`relative ${isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'}`}
                  >
                    <ShoppingCart className="h-5 w-5" />
                    {isMounted && cartItemsCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {cartItemsCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-full h-full sm:max-w-md p-0 overflow-y-auto">
                  <DialogTitle className="sr-only">Keranjang Belanja</DialogTitle>
                  <div className="flex flex-col min-h-full">
                    {/* Cart Hero Section */}
                    <div className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 text-white">
                      <div className="absolute inset-0 bg-black/10" />
                      <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/30 rounded-full blur-3xl" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-300/30 rounded-full blur-2xl" />
                      
                      <div className="relative p-6 text-center">
                        <div className="text-6xl mb-3">🛒</div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">
                          Keranjang Belanja
                        </h2>
                        <p className="text-white/90 text-sm">
                          {cartItemsCount} item • {formatCurrency(cartTotal)}
                        </p>
                      </div>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 flex flex-col p-4">
                      {cart.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
                          <div className="text-7xl mb-4">🛍️</div>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Keranjang Kosong
                          </h3>
                          <p className="text-gray-500 text-sm max-w-[200px]">
                            Yuk, tambahkan menu lezat ke keranjangmu!
                          </p>
                          <Button
                            className="mt-6 gradient-brand text-white button-hover"
                            onClick={() => setIsCartOpen(false)}
                          >
                            Lihat Menu
                          </Button>
                        </div>
                      ) : (
                        <>
                          {/* Cart Items */}
                          <div className="flex-1 space-y-3">
                            {cart.map((item) => (
                              <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex gap-3 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                              >
                                {item.gambar && (
                                  <div className="w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                                    <img
                                      src={item.gambar}
                                      alt={item.nama}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h3 className="font-semibold text-base line-clamp-1 mb-1">
                                    {item.nama}
                                  </h3>
                                  <p className="text-orange-600 font-bold text-sm mb-2">
                                    {formatCurrency(item.harga)}
                                  </p>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-100 dark:hover:bg-gray-600"
                                        onClick={() => {
                                          if (item.jumlah > 1) {
                                            updateCartQuantity(item.produkId, item.jumlah - 1);
                                          } else {
                                            removeFromCart(item.produkId);
                                          }
                                        }}
                                      >
                                        -
                                      </Button>
                                      <span className="text-sm font-bold w-6 text-center">
                                        {item.jumlah}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-orange-600 hover:bg-orange-100 dark:hover:bg-gray-600"
                                        onClick={() => updateCartQuantity(item.produkId, item.jumlah + 1)}
                                      >
                                        +
                                      </Button>
                                    </div>
                                    <p className="font-bold text-sm text-gray-900 dark:text-white">
                                      {formatCurrency(item.harga * item.jumlah)}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          {/* Cart Footer */}
                          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            {/* Total */}
                            <div className="flex items-center justify-between py-3">
                              <span className="font-semibold text-gray-600 dark:text-gray-400">
                                Total Pembayaran
                              </span>
                              <span className="text-2xl font-bold text-orange-600">
                                {formatCurrency(cartTotal)}
                              </span>
                            </div>

                            {/* Clear Button */}
                            <Button
                              variant="outline"
                              className="w-full h-12 text-base"
                              onClick={() => {
                                if (confirm('Hapus semua item dari keranjang?')) {
                                  clearCart();
                                  setIsCartOpen(false);
                                }
                              }}
                            >
                              <X className="h-4 w-4 mr-2" />
                              Hapus Semua
                            </Button>

                            {/* Checkout Button */}
                            <Button
                              className="w-full h-14 gradient-brand text-white button-hover text-base font-bold flex items-center justify-center gap-2"
                              onClick={handleCheckout}
                              disabled={isCheckingOut || cart.length === 0}
                            >
                              <MessageCircle className="h-5 w-5" />
                              {isCheckingOut ? 'Memproses...' : 'Checkout via WhatsApp'}
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative">
                      <Avatar className="h-8 w-8">
                        {user.photo ? (
                          <AvatarImage src={user.photo} alt={user.username} />
                        ) : (
                          <AvatarFallback className="gradient-brand text-white">
                            {user.username.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        )}
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.username}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <Badge variant="secondary" className="w-fit">
                          {user.memberLevel}
                        </Badge>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {userMenuItems.map((item) => (
                      <DropdownMenuItem key={item.name} asChild>
                        <Link href={item.href}>{item.name}</Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      Keluar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button
                    variant={isScrolled ? 'default' : 'secondary'}
                    size="sm"
                    className="button-hover"
                  >
                    <User className="h-4 w-4 mr-2" />
                    Masuk
                  </Button>
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button
                    variant="ghost"
                    size="lg"
                    className={isMounted && isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white'}
                  >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-full max-w-[320px]">
                  <DialogTitle className="sr-only">Menu Mobile</DialogTitle>
                  <div className="flex flex-col h-full">
                    {/* Navigation Items */}
                    <nav className="flex flex-col gap-1 py-2 px-4">
                      <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors active:bg-orange-100"
                      >
                        <Home className="h-6 w-6 text-orange-500" />
                        <span className="text-base font-medium">Beranda</span>
                      </Link>

                      <Link
                        href="/#menu"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors active:bg-orange-100"
                      >
                        <UtensilsCrossed className="h-6 w-6 text-orange-500" />
                        <span className="text-base font-medium">Menu</span>
                      </Link>

                      <Link
                        href="/#promo"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors active:bg-orange-100"
                      >
                        <Search className="h-6 w-6 text-orange-500" />
                        <span className="text-base font-medium">Promo</span>
                      </Link>

                      {user ? (
                        <>
                          {/* User Info Section */}
                          <div className="px-4 py-6 bg-gray-50 border-y">
                            <div className="flex items-center gap-4 mb-3">
                              <Avatar className="h-12 w-12">
                                {user.photo ? (
                                  <AvatarImage src={user.photo} alt={user.username} />
                                ) : (
                                  <AvatarFallback className="gradient-brand text-white text-xl">
                                    {user.username.charAt(0).toUpperCase()}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div>
                                <p className="text-base font-semibold">{user.username}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                            <Badge variant="secondary" className="w-fit ml-auto">
                              {user.memberLevel}
                            </Badge>
                          </div>

                          {/* Dashboard Links */}
                          <nav className="flex flex-col gap-1">
                            <Link
                              href="/dashboard"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors"
                            >
                              <Home className="h-6 w-6 text-orange-500" />
                              <span className="text-base font-medium">Dashboard</span>
                            </Link>

                            <Link
                              href="/dashboard/orders"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors"
                            >
                              <FileText className="h-6 w-6 text-orange-500" />
                              <span className="text font-medium">Riwayat Pesanan</span>
                            </Link>

                            <Link
                              href="/dashboard/wallet"
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="flex items-center gap-4 p-4 rounded-xl hover:bg-orange-50 transition-colors"
                            >
                              <Wallet className="h-6 w-6 text-orange-500" />
                              <span className="text-base font-medium">Wallet</span>
                            </Link>
                          </nav>

                          {/* Logout Button */}
                          <Button
                            variant="destructive"
                            onClick={() => {
                              logout();
                              setIsMobileMenuOpen(false);
                            }}
                            className="mx-4 mt-4 h-12 text-base font-medium"
                          >
                            <X className="h-5 w-5 mr-2" />
                            <span>Keluar</span>
                          </Button>
                        </>
                      ) : (
                        <div className="px-4 py-8">
                          {/* Guest: Login Button */}
                          <Link href="/login">
                            <Button
                              size="lg"
                              className="w-full h-14 gradient-brand text-white text-base font-medium flex items-center justify-center gap-3"
                            >
                              <User className="h-5 w-5" />
                              <span>Masuk / Daftar</span>
                            </Button>
                          </Link>
                        </div>
                      )}
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Spacer for fixed header */}
      <div className="h-16 md:h-20" />
    </>
  );
}
