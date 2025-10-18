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
    <section className="section" aria-labelledby="home-services-heading">
      <div className="container home-services">
        <header className="home-services__header">
          <h2 id="home-services-heading">سرویس‌های محبوب حضوری</h2>
          <p>رزرو آنلاین خدمات تخصصی همراه با تامین قطعات مورد نیاز از فروشگاه.</p>
          <Link href="/services" className="btn btn-link">
            مشاهده همه خدمات
          </Link>
        </header>
        <div className="home-services__grid">
          {services.map((service) => (
            <article key={service.id} className="home-service-card">
              <div className="home-service-card__badge">{service.duration}</div>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <footer>
                <span className="home-service-card__price">{service.price.toLocaleString('fa-IR')} تومان</span>
                <Link href="/checkout" className="btn btn-ghost">
                  رزرو سریع
                </Link>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
