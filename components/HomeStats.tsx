const stats = [
  {
    label: 'سفارش موفق',
    value: '۳۵K+',
    description: 'خریدارانی که روغن و فیلتر خود را از مانی اویل تهیه کرده‌اند.'
  },
  {
    label: 'تنوع محصول',
    value: '۴٬۸۰۰+',
    description: 'انواع روغن موتور، گیربکس، فیلتر و افزودنی از برندهای معتبر.'
  },
  {
    label: 'نماینده رسمی',
    value: '۵۶',
    description: 'تامین‌کنندگان تاییدشده که موجودی فروشگاه را تامین می‌کنند.'
  }
];

export default function HomeStats() {
  return (
    <section className="section" aria-labelledby="home-stats-heading">
      <div className="container home-stats">
        <div className="home-stats__intro">
          <p className="eyebrow">اعتماد مشتریان</p>
          <h2 id="home-stats-heading">فروشگاه تخصصی مانی اویل در یک نگاه</h2>
          <p>
            با تمرکز بر قطعات مصرفی خودرو، شبکه‌ای از تامین‌کنندگان معتبر و تجربه خرید شفاف ایجاد کرده‌ایم. این آمار خلاصه‌ای از
            مسیر مشترک ما با مشتریان است.
          </p>
        </div>
        <dl className="home-stats__grid">
          {stats.map((stat) => (
            <div key={stat.label} className="home-stats__item">
              <dt>{stat.label}</dt>
              <dd>
                <span className="home-stats__value">{stat.value}</span>
                <span className="home-stats__description">{stat.description}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
