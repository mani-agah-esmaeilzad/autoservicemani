import HeroBanner from '@/components/HeroBanner';
import CategoryGrid from '@/components/CategoryGrid';
import ProductCarousel from '@/components/ProductCarousel';
import BrandCarousel from '@/components/BrandCarousel';
import { listBrands, listFeaturedCategories, listProducts, listServices } from '@/lib/data';

export default function HomePage() {
  const categories = listFeaturedCategories();
  const products = listProducts();
  const services = listServices();
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
      <section className="section" style={{ paddingTop: '0' }}>
        <div className="container card" style={{ display: 'grid', gap: '1.5rem', background: '#fff5f5', border: '1px solid rgba(225,6,0,0.2)' }}>
          <div>
            <h2>بسته‌های خدمات حضوری</h2>
            <p style={{ color: 'var(--color-muted)' }}>خدمات تخصصی با امکان رزرو زمان و پرداخت آنلاین</p>
          </div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {services.map((service) => (
              <div key={service.id} className="card" style={{ boxShadow: 'none', border: '1px solid rgba(225,6,0,0.08)' }}>
                <strong style={{ fontSize: '1.1rem' }}>{service.name}</strong>
                <p style={{ color: 'var(--color-muted)', minHeight: '72px' }}>{service.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                  <span style={{ fontWeight: 600 }}>{service.price.toLocaleString('fa-IR')} تومان</span>
                  <span style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>{service.duration}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
