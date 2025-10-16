import ProductExplorer from '@/components/ProductExplorer';
import { listCategories, listProducts } from '@/lib/data';

export const metadata = {
  title: 'فروشگاه آنلاین اتو سرویس مانی',
  description: 'مشاهده و خرید اینترنتی تمام محصولات تخصصی نگهداری خودرو'
};

interface StorePageProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export default function StorePage({ searchParams }: StorePageProps) {
  const products = listProducts();
  const categories = listCategories();
  const initialQuery = typeof searchParams?.query === 'string' ? searchParams.query : '';

  return (
    <div className="section">
      <div className="container store-container">
        <header className="store-header">
          <div>
            <span className="badge">فروشگاه آنلاین</span>
            <h1>مارکت تخصصی قطعات و مصرفی خودرو</h1>
          </div>
          <p>
            مجموعه کامل روغن‌ها، فیلترها و لوازم جانبی با امکان ارسال فوری، مشاوره فنی و ضمانت اصالت کالا.
          </p>
        </header>
        <ProductExplorer products={products} categories={categories} initialQuery={initialQuery} />
      </div>
    </div>
  );
}
