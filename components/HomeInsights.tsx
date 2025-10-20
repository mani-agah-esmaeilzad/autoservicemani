const insights = [
  {
    title: 'راهنمای انتخاب روغن موتور چهار فصل',
    excerpt:
      'جدیدترین استانداردهای روغن موتور برای خودروهای توربو و تنفس طبیعی را بررسی کرده‌ایم تا انتخابی مطمئن داشته باشید.',
    link: '#',
    image: '/images/hero/car-front.svg'
  },
  {
    title: 'چک‌لیست سرویس قبل از سفر',
    excerpt:
      'با این چک‌لیست ۱۲ مرحله‌ای مطمئن شوید خودرو شما برای سفرهای جاده‌ای آماده است و از خرابی‌های ناگهانی جلوگیری کنید.',
    link: '#',
    image: '/images/hero/car-detail.svg'
  },
  {
    title: 'نکات طلایی دیتیلینگ حرفه‌ای در خانه',
    excerpt:
      'آموزش مرحله به مرحله برای برق انداختن بدنه و کابین خودرو با استفاده از محصولات موجود در فروشگاه.',
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
            <p className="eyebrow">آکادمی اتو سرویس مانی</p>
            <h2 id="home-insights-heading">دانش فنی برای مراقبت از خودرو</h2>
          </div>
          <a className="button button--ghost" href="/services">
            مشاهده همه مقالات
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
