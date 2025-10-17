import type { Metadata } from 'next';
// import { listServices } from '@/lib/data';

export const metadata: Metadata = {
  title: 'خدمات حضوری | اتو سرویس مانی',
  description: 'معرفی خدمات تخصصی تعمیر و نگهداری خودرو توسط اتو سرویس مانی با امکان رزرو آنلاین.',
};

export default async function ServicesPage() {
   const { listServices } = await import("@/lib/data");

  const services = await listServices();

  return (
    <div className="page-shell" style={{ display: 'grid', gap: '3rem', paddingBlock: '3rem' }}>
      <section className="hero hero--alt" style={{ display: 'grid', gap: '1.25rem', textAlign: 'center' }}>
        <span className="eyebrow">خدمات تخصصی اتو سرویس مانی</span>
        <h1 className="page-title">هر سرویس، با استاندارد نمایندگی</h1>
        <p className="muted">
          تیم فنی ما با بهره‌گیری از تجهیزات به‌روز و قطعات اورجینال، مجموعه‌ای کامل از سرویس‌های دوره‌ای و تخصصی خودرو را
          ارائه می‌دهد. سرویس مورد نظر خود را انتخاب کنید و به‌صورت آنلاین رزرو کنید.
        </p>
      </section>

      <section className="section" aria-labelledby="services-heading" style={{ display: 'grid', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 id="services-heading" className="section-title">
              لیست خدمات ما
            </h2>
            <p className="muted">تنوع سرویس‌ها برای نیازهای مختلف خودروهای داخلی و وارداتی</p>
          </div>
          <a className="button button--primary" href="/contact" style={{ whiteSpace: 'nowrap' }}>
            رزرو نوبت حضوری
          </a>
        </div>

        {services.length === 0 ? (
          <div className="empty-state">
            <p>در حال حاضر سرویسی ثبت نشده است. لطفاً بعداً دوباره سر بزنید.</p>
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {services.map((service) => (
              <article
                key={service.id}
                className="card"
                style={{
                  display: 'grid',
                  gap: '1rem',
                  padding: '1.75rem',
                  borderRadius: '1.25rem',
                  background: 'var(--surface-elevated)',
                  boxShadow: 'var(--shadow-soft)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{service.name}</h3>
                    <p className="muted" style={{ lineHeight: 1.8 }}>{service.description}</p>
                  </div>
                  <span className="badge" style={{ background: 'var(--surface-accent)', color: 'var(--text-on-accent)' }}>
                    {service.duration}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <strong style={{ fontSize: '1.15rem' }}>{service.price.toLocaleString('fa-IR')} تومان</strong>
                  <a className="button button--ghost" href={`/contact?service=${encodeURIComponent(service.name)}`}>
                    هماهنگی سرویس
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
