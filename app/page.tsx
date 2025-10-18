import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCarousel from '@/components/ProductCarousel';
import BrandCarousel from '@/components/BrandCarousel';
import HomeHighlights from '@/components/HomeHighlights';
import HomeServices from '@/components/HomeServices';
import HomeShowcase from '@/components/HomeShowcase';
import HomeTestimonials from '@/components/HomeTestimonials';
import HomeStats from '@/components/HomeStats';
import HomeGallery from '@/components/HomeGallery';
import HomeInsights from '@/components/HomeInsights';
import HomeCTA from '@/components/HomeCTA';
import { listBrands, listFeaturedCategories, listProducts, listServices } from '@/lib/data';

export default async function HomePage() {
  const [categories, products, brands, services] = await Promise.all([
    listFeaturedCategories(),
    listProducts(),
    listBrands(),
    listServices()
  ]);

  const topPicks = products.slice(0, 8);
  const newArrivals = products.slice(8, 16);

  return (
    <>
      <HeroBanner />
      <HomeStats />
      <HomeHighlights />
      <HomeGallery />
      <HomeShowcase />
      <CategoryGrid categories={categories} />
      <BrandCarousel brands={brands} />
      {topPicks.length > 0 && (
        <ProductCarousel
          products={topPicks}
          title="پیشنهادهای منتخب اتو سرویس مانی"
          description="ترکیب ویژه‌ای از کالاهای ضروری برای سرویس دوره‌ای خودرو شما"
        />
      )}
      {newArrivals.length > 0 && (
        <ProductCarousel
          products={newArrivals}
          title="جدیدترین کالاهای افزوده‌شده"
          description="تازه‌ترین محصولات فروشگاه با آپدیت روزانه برای خودروهای محبوب"
        />
      )}
      <HomeServices services={services} />
      <HomeInsights />
      <HomeCTA />
      <HomeTestimonials />
    </>
  );
}
