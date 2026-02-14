'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldCheck, Calendar, Info } from 'lucide-react';
import { generateVerificationCodeFromDate, verifyCodeWithDateOfBirth } from '@/lib/helpers';

export default function VerifyPage() {
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showCode, setShowCode] = useState(false);

  const handleGenerateCode = () => {
    if (!dateOfBirth) {
      alert('Silakan masukkan tanggal lahir terlebih dahulu');
      return;
    }
    const code = generateVerificationCodeFromDate(dateOfBirth);
    setGeneratedCode(code);
    setIsVerified(null);
    setShowCode(true);
  };

  const handleVerify = () => {
    if (!dateOfBirth || !verificationCode) {
      alert('Silakan masukkan tanggal lahir dan kode verifikasi');
      return;
    }
    const isValid = verifyCodeWithDateOfBirth(verificationCode, dateOfBirth);
    setIsVerified(isValid);
    if (isValid) {
      setGeneratedCode(null); // Hide generated code after successful verification
    }
  };

  const examples = [
    { date: '1995-03-15', code: '150395', label: '15 Maret 1995' },
    { date: '2000-12-25', code: '251200', label: '25 Desember 2000' },
    { date: '1988-07-08', code: '080788', label: '08 Juli 1988' },
    { date: '2010-01-01', code: '010110', label: '01 Januari 2010' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl mb-4">
            <ShieldCheck className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
            Verifikasi Kode 6 Digit
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-lg mx-auto">
            Generate dan verifikasi kode 6 digit dari tanggal lahir untuk keamanan tambahan
          </p>
        </div>

        {/* Main Card */}
        <Card className="shadow-xl border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              Generator & Verifikasi Kode
            </CardTitle>
            <CardDescription>
              Masukkan tanggal lahir untuk generate kode 6 digit format DDMMYY
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Date of Birth Input */}
            <div className="space-y-2">
              <label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Tanggal Lahir
              </label>
              <Input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="h-12 text-base"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* Generate Code Button */}
            <Button
              onClick={handleGenerateCode}
              disabled={!dateOfBirth}
              className="w-full h-12 text-base font-semibold gradient-brand text-white"
            >
              Generate Kode Verifikasi
            </Button>

            {/* Generated Code Display */}
            {showCode && generatedCode && (
              <Alert className="bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
                <Info className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-900 dark:text-green-100">
                  <div className="font-mono text-2xl font-bold tracking-wider">
                    {generatedCode}
                  </div>
                  <div className="text-sm mt-1">
                    Format: <strong>DDMMYY</strong> (Hari - Bulan - 2 Digit Tahun)
                  </div>
                </AlertDescription>
              </Alert>
            )}

            {/* Divider */}
            {showCode && (
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-300 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400">
                    Verifikasi
                  </span>
                </div>
              </div>
            )}

            {/* Verification Code Input */}
            {showCode && (
              <div className="space-y-2">
                <label htmlFor="verificationCode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Masukkan Kode Verifikasi
                </label>
                <Input
                  id="verificationCode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  value={verificationCode}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, '');
                    setVerificationCode(value);
                  }}
                  placeholder="000000"
                  className="h-12 text-base text-center font-mono text-xl tracking-widest"
                />
              </div>
            )}

            {/* Verify Button */}
            {showCode && (
              <Button
                onClick={handleVerify}
                disabled={!verificationCode || verificationCode.length !== 6}
                className="w-full h-12 text-base font-semibold"
              >
                Verifikasi Kode
              </Button>
            )}

            {/* Verification Result */}
            {isVerified !== null && (
              <Alert className={isVerified ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}>
                <ShieldCheck className={`h-4 w-4 ${isVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
                <AlertDescription className={isVerified ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}>
                  <div className="font-bold text-lg">
                    {isVerified ? '✅ Verifikasi Berhasil!' : '❌ Kode Salah!'}
                  </div>
                  <div className="text-sm mt-1">
                    {isVerified
                      ? 'Kode verifikasi yang Anda masukkan sesuai dengan tanggal lahir.'
                      : `Kode yang benar adalah: ${generatedCode}`}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Examples Card */}
        <Card className="mt-6 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Contoh Penggunaan</CardTitle>
            <CardDescription>
              Berikut contoh format kode 6 digit dari tanggal lahir:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {example.label}
                  </div>
                  <div className="font-mono text-xl font-bold text-orange-600">
                    {example.code}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    (DD={example.date.slice(8, 10)} MM={example.date.slice(5, 7)} YY={example.date.slice(2, 4)})
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Alert className="mt-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertDescription className="text-blue-900 dark:text-blue-100 text-sm">
            <strong>Catatan:</strong> Sistem ini menggunakan format tanggal lahir untuk menghasilkan kode verifikasi 6 digit.
            Format: <strong>DDMMYY</strong> (Hari - Bulan - 2 Digit Terakhir Tahun).
            Gunakan ini sebagai tambahan keamanan untuk verifikasi user, reset password, dll.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
