import Link from 'next/link';
import type { Category } from '@/lib/types';

interface Props {
  categories: Category[];
}

export default function CategoryGrid({ categories }: Props) {
  return (
    <section className="section" style={{ paddingTop: '0' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ margin: 0 }}>دسته‌بندی‌های پیشنهادی</h2>
            <p style={{ color: 'var(--color-muted)' }}>از میان دسته‌بندی‌های محبوب مشتریان انتخاب کنید.</p>
          </div>
          <Link href="/store" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            مشاهده همه محصولات
          </Link>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: `linear-gradient(135deg, rgba(17,17,17,0.85), rgba(225,6,0,0.75)), url(${category.image}) center/cover`,
                  filter: 'grayscale(0.2)',
                  zIndex: 0
                }}
              />
              <div style={{ position: 'relative', zIndex: 1, color: '#fff', height: '200px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{category.name}</div>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
