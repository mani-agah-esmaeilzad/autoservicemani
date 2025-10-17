import Link from 'next/link';

const highlights = [
  {
    icon: '🚚',
    title: 'ارسال فوق سریع در تهران',
    description: 'تحویل کمتر از ۳ ساعت برای سفارش‌های ضروری و قطعات مصرفی محبوب.'
  },
  {
    icon: '🛡️',
    title: 'تضمین اصالت و گارانتی',
    description: 'تمام کالاها با ضمانت اصالت و امکان مرجوعی ۷ روزه عرضه می‌شوند.'
  },
  {
    icon: '🤝',
    title: 'نصب و سرویس در محل',
    description: 'همزمان با ثبت سفارش قطعه، سرویس تعویض و نصب در محل را نیز رزرو کنید.'
  },
  {
    icon: '🎧',
    title: 'پشتیبانی ۲۴/۷',
    description: 'کارشناسان فنی و دستیار هوشمند اتو سرویس مانی همیشه کنار شما هستند.'
  }
];

export default function HomeHighlights() {
  return (
    <section className="section" aria-labelledby="home-highlights-heading">
      <div className="container home-highlights">
        <div className="home-highlights__header">
          <h2 id="home-highlights-heading">چرا اتو سرویس مانی؟</h2>
          <p>
            تجربه‌ای کامل از خرید قطعات، دریافت مشاوره تخصصی و سرویس دوره‌ای خودرو؛ همه در یک پلتفرم.
          </p>
        </div>
        <div className="home-highlights__grid">
          {highlights.map((item) => (
            <article key={item.title} className="home-highlight-card">
              <span className="home-highlight-card__icon" aria-hidden="true">
                {item.icon}
              </span>
              <div className="home-highlight-card__body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="home-highlights__cta">
          <Link href="/services" className="btn btn-ghost">
            مشاهده خدمات حضوری
          </Link>
          <Link href="/assistant" className="btn btn-primary">
            شروع گفت‌وگو با دستیار هوشمند
          </Link>
        </div>
      </div>
    </section>
  );
}
