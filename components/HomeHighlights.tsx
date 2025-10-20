import Link from 'next/link';

const highlights = [
  {
    icon: '🛠️',
    title: 'گزارش سلامت خودرو',
    description: 'پس از هر سرویس گزارشی دقیق از وضعیت روغن، فیلتر و لوازم مصرفی دریافت کنید.'
  },
  {
    icon: '⚡',
    title: 'پشتیبانی هوشمند فوری',
    description: 'سوالات فنی خود را با دستیار هوشمند مانی مطرح کنید و راهکارهای عملی دریافت نمایید.'
  },
  {
    icon: '📦',
    title: 'بسته‌های آماده سرویس',
    description: 'پکیج‌های منتخب روغن، فیلتر و افزودنی را بر اساس مدل خودرو انتخاب کنید.'
  }
];

export default function HomeHighlights() {
  return (
    <section className="section section--highlight" aria-labelledby="home-highlights-heading">
      <div className="container home-highlight-shell">
        <header className="home-highlight-shell__header">
          <div>
            <span className="badge">همه‌چیز برای مراقبت خودرو</span>
            <h2 id="home-highlights-heading">یک اکوسیستم کامل برای رانندگان حرفه‌ای</h2>
            <p>
              با اتو سرویس مانی قطعات اصل، زمان‌بندی سرویس و مشاوره تخصصی در کنار هم قرار می‌گیرند تا تجربه‌ای بدون دغدغه
              از نگهداری خودرو داشته باشید.
            </p>
          </div>
          <Link href="/about" className="btn btn-ghost">
            آشنایی با خدمات ما
          </Link>
        </header>

        <div className="home-highlight-shell__grid">
          {highlights.map((item) => (
            <article key={item.title} className="home-highlight-card home-highlight-card--reference">
              <span className="home-highlight-card__icon" aria-hidden="true">
                {item.icon}
              </span>
              <div className="home-highlight-card__body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
          <div className="home-highlight-card home-highlight-card--cta">
            <div>
              <h3>برنامه‌ریزی سرویس دوره‌ای</h3>
              <p>
                تاریخچه سرویس‌های خود را ثبت کنید تا قبل از موعد، یادآوری زمان تعویض روغن و فیلتر برایتان ارسال شود.
              </p>
            </div>
            <Link href="/account" className="btn btn-primary btn-small">
              فعال‌سازی یادآور سرویس
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
