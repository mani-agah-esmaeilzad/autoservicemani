import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="hero-section hero-section--reference">
      <div className="hero-section__pattern" aria-hidden />
      <div className="container hero hero--reference">
        <div className="hero__copy">
          <span className="hero__eyebrow">سرویس کامل خودرو با یک کلیک</span>
          <h1>
            تجربه فروشگاه و سرویس هوشمند <span className="text-primary">اتو سرویس مانی</span>
          </h1>
          <p>
            ترکیبی از فروشگاه آنلاین قطعات اصل، رزرو سرویس در محل و دستیار هوشمند فارسی؛ هر آنچه برای نگهداری خودرو لازم
            دارید در یک داشبورد یکپارچه فراهم است.
          </p>
          <div className="hero__actions">
            <Link href="/store" className="btn btn-primary btn-large">
              مشاهده محصولات محبوب
            </Link>
            <Link href="/assistant" className="btn btn-ghost btn-large">
              گفت‌وگو با دستیار هوشمند
            </Link>
          </div>
          <div className="hero__quick-actions" aria-label="اقدامات سریع">
            <div>
              <span>ارسال اکسپرس در تهران</span>
              <strong>کمتر از ۳ ساعت</strong>
            </div>
            <div>
              <span>مشاوره فنی ۲۴/۷</span>
              <strong>کارشناسان تایید شده</strong>
            </div>
            <div>
              <span>ضمانت اصالت کالا</span>
              <strong>مرجوعی ۷ روزه</strong>
            </div>
          </div>
        </div>

        <div className="hero__aside">
          <div className="hero-card hero-card--primary">
            <div className="hero-card__header">
              <span className="badge">رزرو سرویس حضوری</span>
              <h2>تعویض روغن در محل شما</h2>
              <p>روز و ساعت سرویس را انتخاب کنید تا کارشناس مانی با قطعات اصل به محل شما اعزام شود.</p>
            </div>
            <div className="hero-card__content">
              <div>
                <span>زمان‌بندی آزاد</span>
                <strong>۷ روز هفته</strong>
              </div>
              <div>
                <span>هزینه سرویس</span>
                <strong>از ۴۹۰٬۰۰۰ تومان</strong>
              </div>
            </div>
            <Link href="/checkout" className="btn btn-primary btn-block">
              رزرو سرویس سریع
            </Link>
          </div>

          <div className="hero-card hero-card--secondary">
            <div className="hero-card__media" aria-hidden>
              <img src="/images/hero/car-front.svg" alt="کیفیت سرویس خودرو" />
            </div>
            <dl className="hero-card__stats">
              <div>
                <dt>میانگین امتیاز مشتریان</dt>
                <dd>۴.۹ از ۵</dd>
              </div>
              <div>
                <dt>سرویس موفق این ماه</dt>
                <dd>+۳۲۰</dd>
              </div>
              <div>
                <dt>نمایندگی برندهای معتبر</dt>
                <dd>+۲۵</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
