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
import { KeyRound, ArrowLeft, CheckCircle2, Phone, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    noHp: '',
    kodeVerifikasi: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Find user, Step 2: Verify code, Step 3: Reset password
  const [userFound, setUserFound] = useState<any>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleFindUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.email) {
      setError('Email diperlukan');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Email tidak valid');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password/find-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Akun tidak ditemukan');
        setIsLoading(false);
        return;
      }

      // User found, show phone number info
      setUserFound(data.data.user);
      setFormData({
        ...formData,
        noHp: data.data.user.noHp,
      });
      setStep(2);
      setIsLoading(false);
    } catch (err) {
      setError('Terjadi kesalahan saat mencari akun');
      console.error('Find user error:', err);
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.kodeVerifikasi) {
      setError('Kode verifikasi diperlukan');
      return;
    }

    if (formData.kodeVerifikasi.length !== 6) {
      setError('Kode verifikasi harus 6 digit');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          kodeVerifikasi: formData.kodeVerifikasi,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Verifikasi gagal');
        setIsLoading(false);
        return;
      }

      // Code verified, show password reset form
      setStep(3);
      setIsLoading(false);
    } catch (err) {
      setError('Terjadi kesalahan saat verifikasi');
      console.error('Verify code error:', err);
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword.length < 6) {
      setError('Kata sandi minimal 6 karakter');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Kata sandi tidak cocok');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          kodeVerifikasi: formData.kodeVerifikasi,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Reset kata sandi gagal');
        setIsLoading(false);
        return;
      }

      // Password reset successful
      setSuccess(true);

      // Redirect to login after delay
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError('Terjadi kesalahan saat reset kata sandi');
      console.error('Reset password error:', err);
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setUserFound(null);
      setFormData({
        ...formData,
        noHp: '',
        kodeVerifikasi: '',
      });
    } else if (step === 3) {
      setStep(2);
      setFormData({
        ...formData,
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      router.push('/login');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 gradient-brand">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-2 text-center py-12">
            <CardContent>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <CardTitle className="text-2xl font-bold mb-4">
                Kata Sandi Berhasil Diubah!
              </CardTitle>
              <p className="text-gray-600 dark:text-gray-400">
                Kata sandi Anda telah berhasil diubah. Mengalihkan ke halaman login...
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
          className="flex flex-col items-center mb-6"
        >
          <Logo size="lg" />
          <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
            <KeyRound className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-semibold text-orange-600">
              {step === 1 && 'Cari Akun'}
              {step === 2 && 'Verifikasi Kode'}
              {step === 3 && 'Reset Kata Sandi'}
            </span>
          </div>
        </motion.div>

        <Card className="shadow-2xl border-2">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gradient-brand">
              Lupa Kata Sandi?
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {step === 1 && 'Masukkan email untuk menemukan akun Anda'}
              {step === 2 && 'Masukkan kode verifikasi untuk mengonfirmasi identitas'}
              {step === 3 && 'Masukkan kata sandi baru untuk akun Anda'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={step === 1 ? handleFindUser : step === 2 ? handleVerifyCode : handleResetPassword}>
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

              {step === 1 && (
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                      className="pl-10 focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </div>
              )}

              {step === 2 && userFound && (
                <>
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg space-y-2">
                    <div className="flex items-start gap-2">
                      <Mail className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>Email:</strong> {formData.email}
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Phone className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        <strong>No. HP:</strong> {formData.noHp}
                      </p>
                    </div>
                    {formData.noHp && formData.noHp.length >= 6 && (
                      <div className="pt-2 border-t border-blue-300 dark:border-blue-700">
                        <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          Kode Verifikasi Anda:
                        </p>
                        <div className="bg-white dark:bg-blue-950/50 px-4 py-2 rounded-md inline-block">
                          <span className="text-2xl font-bold text-orange-600 tracking-wider">
                            {formData.noHp.slice(-6)}
                          </span>
                        </div>
                        <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                          6 digit terakhir dari nomor HP Anda
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kodeVerifikasi">Kode Verifikasi</Label>
                    <Input
                      id="kodeVerifikasi"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="Masukkan 6 digit kode"
                      value={formData.kodeVerifikasi}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, kodeVerifikasi: value });
                      }}
                      required
                      className="h-12 text-center text-2xl font-semibold tracking-wider focus:border-orange-500 focus:ring-orange-500"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-100">
                      <strong>Email:</strong> {formData.email}
                    </p>
                    {userFound && (
                      <p className="text-sm text-blue-900 dark:text-blue-100 mt-1">
                        <strong>Username:</strong> {userFound.username}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Minimal 6 karakter"
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, newPassword: e.target.value })
                        }
                        required
                        className="focus:border-orange-500 focus:ring-orange-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 2.157l-2.828 2.828a3 3 0 01-4.243 0 3 3 0 00-4.243 0L4.586 8.29a3 3 0 010-4.243 3 3 0 004.243 0l2.828 2.828a3 3 0 004.243 0 3 3 0 014.243 0l2.828-2.828a3 3 0 014.243-4.243 3 3 0 00-4.243-2.829m-2.5-5.342a7.5 7.5 0 010 10.606l2.828 2.828a7.5 7.5 0 010-10.606l-2.828-2.828z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Ulangi kata sandi baru"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        required
                        className="focus:border-orange-500 focus:ring-orange-500 pr-10"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 2.157l-2.828 2.828a3 3 0 01-4.243 0 3 3 0 00-4.243 0L4.586 8.29a3 3 0 010-4.243 3 3 0 004.243 0l2.828 2.828a3 3 0 004.243 0 3 3 0 014.243 0l2.828-2.828a3 3 0 014.243-4.243 3 3 0 00-4.243-2.829m-2.5-5.342a7.5 7.5 0 010 10.606l2.828 2.828a7.5 7.5 0 010-10.606l-2.828-2.828z" />
                          </svg>
                        ) : (
                          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </Button>
                    </div>
                    {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2 text-red-500 text-sm"
                      >
                        <span className="text-lg">✗</span>
                        <span>Kata sandi tidak cocok</span>
                      </motion.div>
                    )}
                  </div>
                </>
              )}
            </CardContent>

            <CardFooter className="flex flex-col space-y-4 pt-6">
              <Button
                type="submit"
                className="w-full gradient-brand text-white button-hover shadow-lg"
                disabled={isLoading}
              >
                {isLoading
                  ? 'Memproses...'
                  : step === 1
                  ? 'Cari Akun'
                  : step === 2
                  ? 'Verifikasi Kode'
                  : 'Reset Kata Sandi'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBack}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {step === 1 ? 'Kembali ke Login' : 'Kembali'}
              </Button>
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
