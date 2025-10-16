import Link from 'next/link';
import type { Category } from '@/lib/types';

interface Props {
  categories: Category[];
}

export default function CategoryGrid({ categories }: Props) {
  return (
    <section className="section" style={{ paddingTop: '0' }}>
      <div className="container">
        <div className="category-grid-header">
          <div>
            <h2 style={{ margin: 0 }}>دسته‌بندی‌های پیشنهادی</h2>
            <p style={{ color: 'var(--color-muted)', margin: '0.35rem 0 0' }}>
              از میان دسته‌بندی‌های محبوب مشتریان انتخاب کنید.
            </p>
          </div>
          <Link href="/store" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
            مشاهده همه محصولات
          </Link>
        </div>
        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="category-card"
              style={{
                backgroundImage: `url(${category.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="category-card__content">
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{category.name}</div>
                <p className="category-card__description">{category.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
