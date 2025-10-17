import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCarousel from '@/components/ProductCarousel';
import BrandCarousel from '@/components/BrandCarousel';
import { listBrands, listFeaturedCategories, listProducts } from '@/lib/data';

export default async function HomePage() {
  const [categories, products, brands] = await Promise.all([
    listFeaturedCategories(),
    listProducts(),
    listBrands()
  ]);

  return (
    <>
      <HeroBanner />
      <CategoryGrid categories={categories} />
      <BrandCarousel brands={brands} />
      <ProductCarousel
        products={products}
        title="پرفروش‌ترین محصولات"
        description="محبوب‌ترین کالاهای تعویض روغنی با ارسال فوری"
      />
    </>
  );
}
