import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCarousel from '@/components/ProductCarousel';
import BrandCarousel from '@/components/BrandCarousel';
import HomeHighlights from '@/components/HomeHighlights';
import HomeServices from '@/components/HomeServices';
import HomeTestimonials from '@/components/HomeTestimonials';
import { listBrands, listFeaturedCategories, listProducts, listServices } from '@/lib/data';

export default async function HomePage() {
  const [categories, products, brands, services] = await Promise.all([
    listFeaturedCategories(),
    listProducts(),
    listBrands(),
    listServices()
  ]);

  const featuredProducts = products.slice(0, 8);

  return (
    <>
      <HeroBanner />
      <HomeHighlights />
      <CategoryGrid categories={categories} />
      {featuredProducts.length > 0 && (
        <ProductCarousel
          products={featuredProducts}
          title="پیشنهادهای ویژه اتو سرویس مانی"
          description="برگزیده‌ای از محبوب‌ترین کالاهای سرویس خودرو با ارسال سریع"
        />
      )}
      <BrandCarousel brands={brands} />
      <HomeServices services={services} />
      <HomeTestimonials />
    </>
  );
}
