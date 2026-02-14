import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AYAM GEPREK SAMBAL IJO - Pedasnya Bikin Nagih 🔥",
  description: "Nikmati ayam geprek dengan sambal ijo yang pedasnya bikin nagih! Kualitas terbaik, harga terjangkau, dan pelayanan memuaskan. Pesan sekarang!",
  keywords: ["Ayam Geprek", "Sambal Ijo", "Makanan Pedas", "Ayam Goreng", "Pesan Online", "Food Delivery"],
  authors: [{ name: "AYAM GEPREK SAMBAL IJO" }],
  openGraph: {
    title: "AYAM GEPREK SAMBAL IJO - Pedasnya Bikin Nagih",
    description: "Nikmati ayam geprek dengan sambal ijo yang pedasnya bikin nagih!",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AYAM GEPREK SAMBAL IJO - Pedasnya Bikin Nagih",
    description: "Nikmati ayam geprek dengan sambal ijo yang pedasnya bikin nagih!",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground min-h-screen flex flex-col`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
