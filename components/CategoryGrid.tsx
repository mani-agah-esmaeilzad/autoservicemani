import Link from 'next/link';
import type { Category } from '@/lib/types';

interface Props {
  categories: Category[];
}

export default function CategoryGrid({ categories }: Props) {
  return (
    <section className="section section--categories" aria-labelledby="category-section-heading">
      <div className="container category-minimal">
        <header>
          <div>
            <span className="badge">دسته‌بندی کالاها</span>
            <h2 id="category-section-heading">سریع به گروه کالای موردنظر برسید</h2>
            <p>دسته‌بندی‌ها براساس نوع روغن، فیلتر و افزودنی مرتب شده‌اند تا انتخاب ساده‌تر شود.</p>
          </div>
          <Link href="/store" className="btn btn-ghost">
            مشاهده همه محصولات
          </Link>
        </header>

        <div className="category-minimal__grid">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.slug}`} className="category-minimal__card">
              <div className="category-minimal__icon" aria-hidden="true">
                {category.image ? <img src={category.image} alt="" /> : <span>{category.name.slice(0, 1)}</span>}
              </div>
              <div className="category-minimal__body">
                <strong>{category.name}</strong>
                <p>{category.description ?? 'مشاهده محصولات مرتبط با این دسته'}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
