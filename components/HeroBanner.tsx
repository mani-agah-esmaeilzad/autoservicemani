import Link from 'next/link';

export default function HeroBanner() {
  return (
    <section className="section" style={{ paddingTop: '5rem' }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', alignItems: 'center', gap: '3rem' }}>
        <div>
          <span className="badge">فروشگاه تخصصی تعویض روغن</span>
          <h1 style={{ fontSize: '2.6rem', margin: '1rem 0', lineHeight: 1.3 }}>
            تجربه‌ای مدرن از نگهداری خودرو با <span className="text-primary">Auto Service Mani</span>
          </h1>
          <p style={{ color: 'var(--color-muted)', lineHeight: 1.9, marginBottom: '1.75rem' }}>
            سفارش آنلاین روغن موتور، قطعات مصرفی و رزرو خدمات حرفه‌ای با پشتیبانی 24 ساعته، ارسال سریع و تضمین اصالت کالا.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/store" className="btn btn-primary">
              ورود به فروشگاه
            </Link>
            <Link href="/services" className="btn" style={{ border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
              رزرو خدمات حضوری
            </Link>
          </div>
        </div>
        <div className="card" style={{ borderRadius: 'var(--radius-lg)', background: 'radial-gradient(circle at top right, rgba(225,6,0,0.15), transparent 60%)' }}>
          <div style={{ display: 'grid', gap: '1rem' }}>
            <div>
              <strong style={{ fontSize: '1.25rem' }}>باشگاه مشتریان</strong>
              <p style={{ color: 'var(--color-muted)', margin: '0.5rem 0 0' }}>
                با هر خرید امتیاز بگیرید و از خدمات VIP شامل سرویس دوره‌ای در محل بهره‌مند شوید.
              </p>
            </div>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>
              <div className="card" style={{ boxShadow: 'none', border: '1px solid #eee' }}>
                <strong style={{ fontSize: '1.4rem' }}>+850</strong>
                <p style={{ margin: 0, color: 'var(--color-muted)' }}>خدمات موفق</p>
              </div>
              <div className="card" style={{ boxShadow: 'none', border: '1px solid #eee' }}>
                <strong style={{ fontSize: '1.4rem' }}>4.9/5</strong>
                <p style={{ margin: 0, color: 'var(--color-muted)' }}>رضایت مشتریان</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
