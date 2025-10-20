const galleryItems = [
  { src: '/images/home/garage-bay.svg', alt: 'انبار مانی اویل با قفسه‌های محصولات روغن و فیلتر' },
  { src: '/images/home/engine-care.svg', alt: 'نمای نزدیک از روغن‌ریزی دقیق روی موتور خودرو' },
  { src: '/images/home/detailing.svg', alt: 'بسته‌بندی محصولات مراقبت از خودرو روی میز نمایش' },
  { src: '/images/home/family-trip.svg', alt: 'خانواده‌ای آماده سفر با خودرو پس از سرویس دوره‌ای' },
  { src: '/images/home/night-drive.svg', alt: 'رانندگی شبانه با خیال راحت پس از تعویض روغن مناسب' },
  { src: '/images/home/tools.svg', alt: 'ابزار و فیلترهای مختلف آماده ارسال برای مشتریان' }
];

export default function HomeGallery() {
  return (
    <section className="section" aria-labelledby="home-gallery-heading">
      <div className="container home-gallery">
        <div className="home-gallery__intro">
          <p className="eyebrow">نمایی از مانی اویل</p>
          <h2 id="home-gallery-heading">فضا و محصولات فروشگاه تخصصی ما</h2>
          <p>
            از آماده‌سازی سفارش‌ها تا قفسه‌بندی اصولی، همه چیز در مانی اویل برای تحویل سریع و مطمئن محصولات روغن و فیلتر طراحی
            شده است. این تصاویر بخشی از پشت صحنه فروشگاه ماست.
          </p>
        </div>
        <div className="home-gallery__grid">
          {galleryItems.map((item) => (
            <figure key={item.src} className="home-gallery__item">
              <img src={item.src} alt={item.alt} loading="lazy" />
              <figcaption>{item.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
