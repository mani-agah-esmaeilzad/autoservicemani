const stats = [
  {
    label: 'مشتریان راضی',
    value: '۳۵K+',
    description: 'گستره‌ای از رانندگان که سرویس‌های منظم خود را به اتو سرویس مانی سپرده‌اند.'
  },
  {
    label: 'محصول فعال در فروشگاه',
    value: '۴٬۸۰۰+',
    description: 'قطعات و لوازم مصرفی تاییدشده برای خودروهای داخلی و وارداتی.'
  },
  {
    label: 'شبکه تخصصی همکار',
    value: '۵۶',
    description: 'تعمیرگاه و تکنسین تاییدشده که سفارش‌های حضوری را پوشش می‌دهند.'
  }
];

export default function HomeStats() {
  return (
    <section className="section" aria-labelledby="home-stats-heading">
      <div className="container home-stats">
        <div className="home-stats__intro">
          <p className="eyebrow">اعتماد مشتریان</p>
          <h2 id="home-stats-heading">ماموریت ما؛ نگهداری هوشمند خودرو برای همه</h2>
          <p>
            تیم اتو سرویس مانی با ترکیب فروشگاه آنلاین، خدمات حضوری و دستیار هوشمند، تجربه‌ای
            پیوسته و مطمئن برای مالکین خودرو می‌سازد. اعداد زیر تصویری از همراهی جامعه ماست.
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
