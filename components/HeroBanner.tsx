import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="hero-section">
      <div className="hero-section__backdrop" aria-hidden />
      <div className="container hero hero--inspired">
        <div className="hero__content">
          <span className="hero__pill">فروشگاه هوشمند تعویض روغن و قطعات خودرو</span>
          <h1 className="hero-heading">
            نگهداری خودرو را با <span className="text-primary">Auto Service Mani</span> هوشمند کنید
          </h1>
          <p className="hero__subtitle">
            تجربه‌ای تازه از خرید روغن موتور، فیلترها و قطعات مصرفی به همراه رزرو سرویس در محل و دستیار هوشمند فارسی‌زبان. همه‌چیز با
            طراحی مدرن و در چند کلیک در اختیار شماست.
          </p>
          <div className="hero-actions">
            <Link href="/store" className="btn btn-primary">
              ورود به فروشگاه
            </Link>
            <Link href="/assistant" className="btn btn-ghost">
              دستیار هوشمند مانی
            </Link>
          </div>
          <dl className="hero__metrics">
            <div>
              <dt>سرویس موفق</dt>
              <dd>+850</dd>
            </div>
            <div>
              <dt>رضایت مشتریان</dt>
              <dd>۴.۹ از ۵</dd>
            </div>
            <div>
              <dt>پشتیبانی تخصصی</dt>
              <dd>۲۴/۷</dd>
            </div>
          </dl>
        </div>
        <div className="hero-visual hero-visual--inspired">
          <div className="hero-visual__glow" aria-hidden />
          <div className="hero-visual__primary">
            <div className="hero-visual__badge">پیشنهاد روز مانی</div>
            <img src="/images/hero/car-front.svg" alt="تصویر خودرو و بسته سرویس کامل" />
            <div className="hero-visual__tag">سرویس کامل روغن و فیلتر</div>
          </div>
          <div className="hero-visual__secondary">
            <div className="hero-visual__card">
              <strong>باشگاه مشتریان</strong>
              <p>
                با هر خرید امتیاز بگیرید و از سرویس دوره‌ای در محل و تخفیف‌های ویژه برندهای معتبر بهره‌مند شوید.
              </p>
            </div>
            <div className="hero-visual__card hero-visual__card--stats">
              <div>
                <span>ارسال کمتر از</span>
                <strong>۳ ساعت</strong>
              </div>
              <div>
                <span>کارشناسان تایید شده</span>
                <strong>+۴۰ نفر</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
