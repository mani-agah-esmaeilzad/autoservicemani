const insights = [
  {
    title: 'راهنمای انتخاب روغن موتور چهار فصل',
    excerpt:
      'جدیدترین استانداردهای روغن موتور برای خودروهای توربو و تنفس طبیعی را بررسی کرده‌ایم تا انتخابی مطمئن داشته باشید.',
    link: '#',
    image: '/images/hero/car-front.svg'
  },
  {
    title: 'چک‌لیست قبل از تعویض روغن',
    excerpt: 'پیش از سفارش، این مراحل را بررسی کنید تا نوع روغن و فیلتر مناسب خودروی شما مشخص شود.',
    link: '#',
    image: '/images/hero/car-detail.svg'
  },
  {
    title: 'مقایسه فیلترهای محبوب بازار',
    excerpt: 'مزایا و معایب فیلترهای پرفروش را کنار هم گذاشته‌ایم تا خرید آگاهانه‌تری انجام دهید.',
    link: '#',
    image: '/images/hero/garage.svg'
  }
];

export default function HomeInsights() {
  return (
    <section className="section" aria-labelledby="home-insights-heading">
      <div className="container home-insights">
        <header className="home-insights__header">
          <div>
            <p className="eyebrow">راهنمای خرید مانی اویل</p>
            <h2 id="home-insights-heading">دانش فنی برای انتخاب بهترین محصول</h2>
          </div>
          <a className="button button--ghost" href="/assistant">
            دریافت مشاوره
          </a>
        </header>
        <div className="home-insights__grid">
          {insights.map((insight) => (
            <article key={insight.title} className="home-insight-card">
              <div className="home-insight-card__media">
                <img src={insight.image} alt="تصویر مقاله" loading="lazy" />
              </div>
              <div className="home-insight-card__body">
                <h3>{insight.title}</h3>
                <p>{insight.excerpt}</p>
                <a className="button button--link" href={insight.link}>
                  مطالعه بیشتر
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
