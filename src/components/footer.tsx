'use client';

import Link from 'next/link';
import { Instagram, Facebook, MapPin, Phone, Mail } from 'lucide-react';
import { Logo } from '@/components/logo';

export function Footer() {
  const storeInfo = {
    nama: 'AYAM GEPREK SAMBAL IJO',
    slogan: 'Pedasnya Bikin Nagih 🔥🔥',
    alamat: 'Jl. Medan - Banda Aceh, Simpang Camat, Gampong Tijue, Kec. Pidie, Kab. Pidie, 24151',
    noHp: '085260812758',
    instagram: '#',
    facebook: '#',
  };

  return (
    <footer className="gradient-orange-dark text-white mt-auto">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Logo size="sm" showText={false} />
              <div>
                <h3 className="font-bold text-lg">{storeInfo.nama}</h3>
                <p className="text-sm opacity-90">{storeInfo.slogan}</p>
              </div>
            </div>
            <p className="text-sm opacity-80 leading-relaxed">
              Nikmati ayam geprek dengan sambal ijo yang pedasnya bikin nagih!
              Kualitas terbaik, harga terjangkau, dan pelayanan memuaskan.
            </p>
            {/* Social Media */}
            <div className="flex gap-4">
              <Link
                href={storeInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href={storeInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
              >
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Menu Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm opacity-80 hover:opacity-100 hover:pl-2 transition-all duration-300 inline-block"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  href="/#menu"
                  className="text-sm opacity-80 hover:opacity-100 hover:pl-2 transition-all duration-300 inline-block"
                >
                  Menu Kami
                </Link>
              </li>
              <li>
                <Link
                  href="/#promo"
                  className="text-sm opacity-80 hover:opacity-100 hover:pl-2 transition-all duration-300 inline-block"
                >
                  Promo Terbaru
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/wallet"
                  className="text-sm opacity-80 hover:opacity-100 hover:pl-2 transition-all duration-300 inline-block"
                >
                  Tukar Poin
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/orders"
                  className="text-sm opacity-80 hover:opacity-100 hover:pl-2 transition-all duration-300 inline-block"
                >
                  Riwayat Pesanan
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Bantuan</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-sm opacity-80 hover:opacity-100 hover:pl-2 transition-all duration-300 inline-block"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm opacity-80 hover:opacity-100 hover:pl-2 transition-all duration-300 inline-block"
                >
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm opacity-80 hover:opacity-100 hover:pl-2 transition-all duration-300 inline-block"
                >
                  Kebijakan Privasi
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm opacity-80 hover:opacity-100 hover:pl-2 transition-all duration-300 inline-block"
                >
                  Hubungi Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-bold text-lg">Hubungi Kami</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm opacity-80 leading-relaxed">{storeInfo.alamat}</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 flex-shrink-0" />
                <a
                  href={`https://wa.me/6285260812758`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm opacity-80 hover:opacity-100 transition-colors"
                >
                  {storeInfo.noHp}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 flex-shrink-0" />
                <a
                  href="mailto:info@ayamgepreksambalijo.com"
                  className="text-sm opacity-80 hover:opacity-100 transition-colors"
                >
                  info@ayamgepreksambalijo.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm opacity-80 text-center md:text-left">
              © {new Date().getFullYear()} {storeInfo.nama}. All rights reserved.
            </p>
            <p className="text-sm opacity-80 text-center md:text-right">
              Made with 🔥 in Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
