import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCarousel from '@/components/ProductCarousel';
import BrandCarousel from '@/components/BrandCarousel';
import HomeHighlights from '@/components/HomeHighlights';
import HomeCollections from '@/components/HomeCollections';
import HomeTestimonials from '@/components/HomeTestimonials';
import { listBrands, listFeaturedCategories, listProducts } from '@/lib/data';

export default async function HomePage() {
  const [categories, products, brands] = await Promise.all([
    listFeaturedCategories(),
    listProducts(),
    listBrands()
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
          title="پرفروش‌های این هفته"
          description="گزیده‌ای از روغن‌ها و فیلترهای محبوب کاربران با موجودی به‌روز"
        />
      )}
      <HomeCollections />
      <BrandCarousel brands={brands} />
      <HomeTestimonials />
    </>
  );
}
