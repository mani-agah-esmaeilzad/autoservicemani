import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="section">
      <div className="container hero">
        <div>
          <span className="badge">فروشگاه تخصصی تعویض روغن</span>
          <h1 className="hero-heading">
            تجربه‌ای مینیمال و حرفه‌ای از نگهداری خودرو با <span className="text-primary">Auto Service Mani</span>
          </h1>
          <p style={{ color: 'var(--color-muted)', marginBottom: '1.75rem' }}>
            سفارش آنلاین روغن موتور، قطعات مصرفی و دریافت مشاوره تخصصی با دستیار هوشمند اتو سرویس مانی در کنار ارسال سریع و تضمین اصالت کالا.
          </p>
          <div className="hero-actions">
            <Link href="/store" className="btn btn-primary">
              ورود به فروشگاه
            </Link>
            <Link href="/assistant" className="btn btn-ghost">
              مشاوره فنی هوشمند
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          <div className="card hero-card">
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <strong style={{ fontSize: '1.25rem' }}>باشگاه مشتریان</strong>
                <p style={{ color: 'var(--color-muted)', margin: '0.35rem 0 0' }}>
                  با هر خرید امتیاز بگیرید و از خدمات VIP شامل سرویس دوره‌ای در محل بهره‌مند شوید.
                </p>
              </div>
              <div className="hero-stats">
                <div className="hero-stat-card">
                  <strong>+850</strong>
                  <p style={{ margin: 0, color: 'var(--color-muted)' }}>خدمات موفق</p>
                </div>
                <div className="hero-stat-card">
                  <strong>4.9/5</strong>
                  <p style={{ margin: 0, color: 'var(--color-muted)' }}>رضایت مشتریان</p>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-gallery">
            <figure>
              <img src="/images/hero/car-front.svg" alt="رندر خودروی قرمز در نمای روبه‌رو" />
              <figcaption>تعویض روغن تخصصی</figcaption>
            </figure>
            <figure>
              <img src="/images/hero/car-detail.svg" alt="جزئیات خدمات دیتیلینگ خودرو" />
              <figcaption>دیتیلینگ و نظافت حرفه‌ای</figcaption>
            </figure>
            <figure>
              <img src="/images/hero/garage.svg" alt="گاراژ هوشمند اتو سرویس مانی" />
              <figcaption>سرویس در محل و گاراژ هوشمند</figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
