const showcaseItems = [
  {
    title: 'گالری روغن‌های پریمیوم',
    description: 'انتخابی کامل از برندهای جهانی با ضمانت اصالت برای هر نوع موتور.',
    image: '/images/products/shell-ultra.svg'
  },
  {
    title: 'تجهیزات دیتیلینگ و تمیزی کابین',
    description: 'از نانو پوشش‌ها تا کیت‌های نظافت؛ همه برای درخشش خودرو شما.',
    image: '/images/products/interior-kit.svg'
  },
  {
    title: 'آماده برای سفرهای طولانی',
    description: 'پکیج‌های اضطراری شامل جامپ استارتر، لوازم ایمنی و فیلترهای یدک.',
    image: '/images/products/jump-starter.svg'
  },
  {
    title: 'باشگاه مشتریان اتو سرویس مانی',
    description: 'با جمع‌آوری امتیاز، سرویس‌های دوره‌ای و کوپن‌های ویژه دریافت کنید.',
    image: '/images/hero/garage.svg'
  }
];

export default function HomeShowcase() {
  return (
    <section className="section" aria-labelledby="home-showcase-heading">
      <div className="container home-showcase">
        <div className="home-showcase__header">
          <h2 id="home-showcase-heading">همه چیز برای نگهداری بی‌نقص خودرو</h2>
          <p>دسته‌بندی‌های الهام‌بخش برای شروع خرید و تجهیز گاراژ اختصاصی شما.</p>
        </div>
        <div className="home-showcase__grid">
          {showcaseItems.map((item) => (
            <article key={item.title} className="home-showcase-card">
              <img src={item.image} alt={item.title} />
              <div className="home-showcase-card__body">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
