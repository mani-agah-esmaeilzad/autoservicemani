import Link from 'next/link';
import type { Category } from '@/lib/types';

interface Props {
  categories: Category[];
}

export default function CategoryGrid({ categories }: Props) {
  return (
    <section className="section section--categories" aria-labelledby="category-section-heading">
      <div className="container category-section">
        <header className="category-section__header">
          <div>
            <span className="badge">مرور سریع دسته‌ها</span>
            <h2 id="category-section-heading">هر آنچه نیاز دارید را در دسته‌بندی‌های هوشمند بیابید</h2>
            <p>با انتخاب دسته‌بندی مناسب، پیشنهادهای متناسب با خودرو و سابقه خرید شما نمایش داده می‌شود.</p>
          </div>
          <Link href="/store" className="btn btn-ghost">
            مشاهده تمام محصولات
          </Link>
        </header>

        <div className="category-section__layout">
          <div className="category-section__intro">
            <h3>پکیج‌های سرویس منتخب</h3>
            <p>
              دسته‌بندی‌ها به شکل پکیج طراحی شده‌اند تا سریع‌تر به روغن، فیلتر و لوازم جانبی مورد نیاز دسترسی داشته باشید.
            </p>
            <ul>
              <li>دسته‌بندی بر اساس نوع سرویس و برند خودرو</li>
              <li>پیشنهادهای ویژه با تخفیف‌های دوره‌ای</li>
              <li>نمایش محصولات دارای نصب در محل</li>
            </ul>
            <Link href="/assistant" className="btn btn-primary btn-small">
              انتخاب دسته با دستیار هوشمند
            </Link>
          </div>

          <div className="category-section__grid">
            {categories.map((category) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="category-card category-card--reference">
                <div className="category-card__icon" aria-hidden="true">
                  {category.image ? <img src={category.image} alt="" /> : <span>{category.name.slice(0, 1)}</span>}
                </div>
                <div className="category-card__body">
                  <strong>{category.name}</strong>
                  <p>{category.description ?? 'مشاهده محصولات مرتبط با این دسته‌بندی'}</p>
                </div>
                <span className="category-card__arrow" aria-hidden="true" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
