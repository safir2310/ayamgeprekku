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
import { Shield, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage() {
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
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Username atau password salah');
        setIsLoading(false);
        return;
      }

      // Store user data and token
      setUser(data.data.user);
      setToken(data.data.token);

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (err) {
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      console.error('Admin login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
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
            <CardTitle className="text-2xl font-bold text-gradient-brand flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-orange-600" />
              Login Admin
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Masuk ke dashboard admin untuk mengelola toko
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
                <Label htmlFor="username">Username Admin</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Contoh: admin"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                  className="focus:border-orange-500 focus:ring-orange-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
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
                {isLoading ? 'Memproses...' : 'Masuk sebagai Admin'}
              </Button>

              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-gray-600 dark:text-gray-400">Login sebagai user biasa?</span>
                <Link
                  href="/login"
                  className="text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Login User
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
            className="text-gray-600 dark:text-gray-400 hover:text-orange-600 transition-colors text-sm flex items-center gap-2 mx-auto w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
