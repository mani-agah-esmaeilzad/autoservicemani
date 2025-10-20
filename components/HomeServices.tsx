import Link from 'next/link';
import type { Service } from '@/lib/types';

type HomeServicesProps = {
  services: Service[];
};

export default function HomeServices({ services }: HomeServicesProps) {
  if (services.length === 0) {
    return null;
  }

  return (
    <section className="section section--services" aria-labelledby="home-services-heading">
      <div className="container home-services home-services--reference">
        <header className="home-services__header">
          <div>
            <span className="badge">سرویس‌های در محل</span>
            <h2 id="home-services-heading">بسته‌های سرویس محبوب مشتریان</h2>
            <p>انتخاب سرویس مناسب به‌همراه تامین قطعات در یک سفارش واحد.</p>
          </div>
          <Link href="/services" className="btn btn-ghost btn-small">
            مشاهده همه سرویس‌ها
          </Link>
        </header>
        <div className="home-services__grid">
          {services.map((service) => (
            <article key={service.id} className="home-service-card home-service-card--reference">
              <header>
                <h3>{service.name}</h3>
                <span>{service.duration}</span>
              </header>
              <p>{service.description}</p>
              <footer>
                <div>
                  <strong>{service.price.toLocaleString('fa-IR')} تومان</strong>
                  <small>شامل اجرت کارشناس</small>
                </div>
                <Link href="/checkout" className="btn btn-primary btn-small">
                  رزرو سرویس
                </Link>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
