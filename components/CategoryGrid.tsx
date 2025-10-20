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
              className="category-card category-card--modern"
            >
              <div className="category-card__icon" aria-hidden="true">
                {category.image ? <img src={category.image} alt="" /> : <span>{category.name.slice(0, 1)}</span>}
              </div>
              <div className="category-card__content">
                <div className="category-card__title">{category.name}</div>
                <p className="category-card__description">
                  {category.description ?? 'مشاهده محصولات منتخب این دسته'}
                </p>
              </div>
              <span className="category-card__cta">مشاهده</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
