'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Logo } from '@/components/logo';
import { useStore } from '@/store/store';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useStore();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false,
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Nama pengguna atau kata sandi salah');
        setIsLoading(false);
        return;
      }

      // Store user data and token
      setUser(data.data.user);
      setToken(data.data.token);

      // Redirect based on role
      if (data.data.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 gradient-brand">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-4"
            >
              <Logo size="lg" />
            </motion.div>
            <CardTitle className="text-2xl font-bold text-gradient-brand">
              Selamat Datang!
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Masuk untuk memesan ayam geprek favorit Anda
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
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Kata Sandi</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    Lupa kata sandi?
                  </Link>
                </div>
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

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({
                      ...formData,
                      rememberMe: checked as boolean,
                    })
                  }
                />
                <Label
                  htmlFor="remember"
                  className="text-sm font-normal cursor-pointer"
                >
                  Ingat saya
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full gradient-brand text-white button-hover shadow-lg"
                disabled={isLoading}
              >
                {isLoading ? 'Memproses...' : 'Masuk'}
              </Button>

              <div className="grid grid-cols-2 gap-3">
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
            className="text-white hover:text-yellow-200 transition-colors text-sm"
          >
            ← Kembali ke Beranda
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
