import type { Metadata } from 'next';
import { Vazirmatn } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const vazir = Vazirmatn({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap'
});

export const metadata: Metadata = {
  title: 'Auto Service Mani | فروشگاه آنلاین لوازم و خدمات خودرو',
  description:
    'اتو سرویس مانی؛ فروشگاه آنلاین تخصصی برای تجهیزات، روغن و خدمات تعویض روغن خودرو با امکان سفارش آنلاین و مدیریت پیشرفته.',
  keywords: ['auto service', 'mani', 'خدمات خودرو', 'فروشگاه آنلاین', 'تعویض روغن'],
  metadataBase: new URL('https://auto-service-mani.example.com'),
  openGraph: {
    title: 'Auto Service Mani | فروشگاه تخصصی خدمات خودرو',
    description:
      'خرید اینترنتی انواع روغن موتور، فیلتر و خدمات خودرو با ارسال سریع و مدیریت حرفه‌ای سفارش‌ها.',
    siteName: 'Auto Service Mani',
    type: 'website',
    locale: 'fa_IR'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazir.className} body-root`}>
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
