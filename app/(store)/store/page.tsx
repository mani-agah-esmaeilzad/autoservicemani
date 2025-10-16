import ProductCard from '@/components/ProductCard';
import { listCategories, listProducts } from '@/lib/data';

export const metadata = {
  title: 'فروشگاه آنلاین اتو سرویس مانی',
  description: 'مشاهده و خرید اینترنتی تمام محصولات تخصصی نگهداری خودرو'
};

export default function StorePage() {
  const products = listProducts();
  const categories = listCategories();

  return (
    <div className="section">
      <div className="container" style={{ display: 'grid', gap: '2rem' }}>
        <header style={{ display: 'grid', gap: '0.75rem' }}>
          <h1>فروشگاه Auto Service Mani</h1>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>
            مجموعه کامل روغن‌ها، فیلترها و لوازم جانبی با امکان ارسال فوری و ضمانت اصالت کالا.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {categories.map((category) => (
              <span key={category.id} className="badge">
                {category.name}
              </span>
            ))}
          </div>
        </header>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
