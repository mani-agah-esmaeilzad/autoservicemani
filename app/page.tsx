import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCarousel from '@/components/ProductCarousel';
import BrandCarousel from '@/components/BrandCarousel';
import { listBrands, listFeaturedCategories, listProducts } from '@/lib/data';

export default function HomePage() {
  const categories = listFeaturedCategories();
  const products = listProducts();
  const brands = listBrands();

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
