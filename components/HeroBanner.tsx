import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="hero hero--minimal" aria-labelledby="hero-heading">
      <div className="container hero-minimal">
        <div className="hero-minimal__copy">
          <span className="hero-minimal__eyebrow">فروشگاه تخصصی روغن و فیلتر</span>
          <h1 id="hero-heading">
            هر آنچه موتور خودروی شما نیاز دارد در <span className="text-primary">مانی اویل</span>
          </h1>
          <p>
            مجموعه‌ای از روغن‌های اورجینال، فیلترهای تخصصی و افزودنی‌های تاییدشده را یکجا ببینید، مقایسه کنید و با ارسال سریع
            دریافت کنید.
          </p>
          <div className="hero-minimal__actions">
            <Link href="/store" className="btn btn-primary btn-large">
              مشاهده محصولات
            </Link>
            <Link href="/assistant" className="btn btn-ghost btn-large">
              راهنمای انتخاب روغن
            </Link>
          </div>
          <dl className="hero-minimal__metrics">
            <div>
              <dt>+۳۵۰ مدل محصول</dt>
              <dd>روغن موتور، گیربکس و انواع فیلتر</dd>
            </div>
            <div>
              <dt>ارسال سریع</dt>
              <dd>تحویل ۲۴ ساعته در تهران</dd>
            </div>
            <div>
              <dt>ضمانت اصالت</dt>
              <dd>پلمپ کارخانه و تاریخ تولید جدید</dd>
            </div>
          </dl>
        </div>

        <div className="hero-minimal__media" aria-hidden>
          <div className="hero-minimal__card">
            <img src="/images/products/shell-ultra.svg" alt="روغن موتور" />
            <div>
              <strong>Shell Helix Ultra</strong>
              <span>سری پرطرفدار روغن‌های تمام‌سنتتیک</span>
            </div>
          </div>
          <div className="hero-minimal__tag">
            <span>پیشنهاد سرد</span>
            <strong>روغن مناسب زمستان</strong>
          </div>
        </div>
      </div>
    </section>
  );
}
