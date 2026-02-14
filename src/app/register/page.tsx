'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Logo } from '@/components/logo';
import { CheckCircle2, XCircle } from 'lucide-react';
import { useStore } from '@/store/store';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken } = useStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    noHp: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    if (formData.username.length < 3) {
      setError('Nama pengguna minimal 3 karakter');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok');
      return false;
    }
    if (!formData.email.includes('@')) {
      setError('Email tidak valid');
      return false;
    }
    if (formData.noHp.length < 10) {
      setError('Nomor HP minimal 10 digit');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
          email: formData.email,
          noHp: formData.noHp,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Registrasi gagal');
        setIsLoading(false);
        return;
      }

      // Store user data and token
      setUser(data.data.user);
      setToken(data.data.token);

      // Show success message
      setSuccess(true);

      // Redirect to login after delay
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Terjadi kesalahan saat registrasi. Silakan coba lagi.');
      console.error('Register error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-brand">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-2 text-center py-12">
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold mb-4">
                Registrasi Berhasil!
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Akun Anda telah berhasil dibuat. Mengalihkan ke halaman login...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-6"
        >
          <Logo size="lg" />
        </motion.div>
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gradient-brand">
              Daftar Akun Baru
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Buat akun untuk mulai memesan
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <div className="space-y-2">
                <Label htmlFor="username">Nama Pengguna</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Contoh: user123"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="noHp">Nomor HP</Label>
                <Input
                  id="noHp"
                  type="tel"
                  placeholder="08xxxxxxxxxx"
                  value={formData.noHp}
                  onChange={(e) =>
                    setFormData({ ...formData, noHp: e.target.value })
                  }
                  required
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi kata sandi"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({ ...formData, confirmPassword: e.target.value })
                  }
                  required
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
                {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-red-500 text-sm"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Kata sandi tidak cocok</span>
                  </motion.div>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full gradient-brand text-white button-hover shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
              </Button>

              <div className="text-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Sudah punya akun?{' '}
                </span>
                <Link
                  href="/login"
                  className="text-orange-600 hover:text-orange-700 font-semibold"
                >
                  Masuk
                </Link>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Link
                  href="/login/admin"
                  className="w-full"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-purple-300 text-purple-600 hover:bg-purple-50 button-hover"
                  >
                    Login Admin
                  </Button>
                </Link>
                <Link
                  href="/register/admin"
                  className="w-full"
                >
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 button-hover"
                  >
                    Daftar Admin
                  </Button>
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="text-center mt-6"
        >
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors text-sm"
          >
            ← Kembali ke Beranda
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
