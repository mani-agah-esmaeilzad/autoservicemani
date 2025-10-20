import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Mani Oil | فروشگاه تخصصی روغن و فیلتر خودرو',
  description: 'مانی اویل فروشگاهی آنلاین برای خرید روغن موتور، فیلتر و افزودنی‌های اورجینال با ارسال سریع و مشاوره تخصصی.',
  keywords: ['mani oil', 'روغن موتور', 'فیلتر خودرو', 'فروشگاه آنلاین'],
  metadataBase: new URL('https://mani-oil.example.com'),
  openGraph: {
    title: 'Mani Oil | فروشگاه تخصصی روغن و فیلتر خودرو',
    description: 'خرید آنلاین روغن و فیلتر با ضمانت اصالت، موجودی به‌روز و پشتیبانی کارشناسی از مانی اویل.',
    siteName: 'Mani Oil',
    type: 'website',
    locale: 'fa_IR'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className="body-root">
        <Providers>
          <Suspense fallback={null}>
            <Header />
          </Suspense>
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
