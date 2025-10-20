import type { Metadata } from 'next';
import { listServices } from '@/lib/data';

export const metadata: Metadata = {
  title: 'پک‌های پیشنهادی | مانی اویل',
  description: 'معرفی پک‌های آماده خرید شامل روغن، فیلتر و افزودنی برای کاربردهای مختلف خودرو در مانی اویل.'
};

export default async function ServicesPage() {
  const services = await listServices();

  return (
    <main className="page">
      <section className="section" aria-labelledby="services-heading">
        <div className="container page-header">
          <span className="eyebrow">پیشنهادهای آماده</span>
          <h1 id="services-heading">پک‌های منتخب روغن و فیلتر برای سناریوهای مختلف</h1>
          <p>
            اگر زمان مقایسه محصولات را ندارید، از پک‌های آماده استفاده کنید. هر پک شامل ترکیب کالاهایی است که با هم بهترین نتیجه را
            برای خودرو شما ایجاد می‌کنند.
          </p>
        </div>
      </section>

      <section className="section" aria-labelledby="services-list-heading">
        <div className="container services-grid">
          <h2 id="services-list-heading">لیست پک‌ها</h2>

          {services.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <strong>هنوز پک پیشنهادی ثبت نشده است.</strong>
              <p>از بخش مدیریت می‌توانید پک‌های جدید اضافه کنید.</p>
            </div>
          ) : (
            <div className="services-grid__items">
              {services.map((service) => (
                <article key={service.id} className="card services-grid__item">
                  <header>
                    <h3>{service.name}</h3>
                    <span>{service.price.toLocaleString('fa-IR')} تومان</span>
                  </header>
                  <p>{service.description}</p>
                  <ul>
                    <li>{service.duration}</li>
                    <li>شامل ارسال سریع و ضمانت اصالت</li>
                  </ul>
                  <a className="btn btn-primary btn-small" href="/store">
                    مشاهده محصولات مرتبط
                  </a>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
