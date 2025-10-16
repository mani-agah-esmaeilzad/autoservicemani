import { listServices } from '@/lib/data';

export const metadata = {
  title: 'رزرو خدمات حضوری | Auto Service Mani',
  description: 'انتخاب و رزرو آنلاین خدمات تخصصی تعویض روغن و نگهداری خودرو'
};

export default function ServicesPage() {
  const services = listServices();

  return (
    <div className="section">
      <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
        <header style={{ display: 'grid', gap: '0.75rem' }}>
          <h1>خدمات حضوری اتو سرویس مانی</h1>
          <p style={{ color: 'var(--color-muted)' }}>
            انتخاب زمان مراجعه، مشاهده جزئیات خدمات و پرداخت آنلاین با ضمانت رضایت مشتریان.
          </p>
        </header>

        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
          {services.map((service) => (
            <div key={service.id} className="card" style={{ display: 'grid', gap: '0.75rem' }}>
              <div>
                <strong style={{ fontSize: '1.2rem' }}>{service.name}</strong>
                <p style={{ color: 'var(--color-muted)' }}>{service.description}</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>{service.price.toLocaleString('fa-IR')} تومان</span>
                <span style={{ color: 'var(--color-muted)' }}>{service.duration}</span>
              </div>
              <button type="button" className="btn btn-primary">
                رزرو آنلاین
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
