const galleryItems = [
  { src: '/images/home/garage-bay.svg', alt: 'تیم سرویس در حال بررسی خودرو داخل گاراژ' },
  { src: '/images/home/engine-care.svg', alt: 'جزئیات موتور با نورپردازی قرمز و ابزار حرفه‌ای' },
  { src: '/images/home/detailing.svg', alt: 'پولیش و دیتیلینگ بدنه خودرو' },
  { src: '/images/home/family-trip.svg', alt: 'خانواده‌ای آماده سفر با خودرو در کنار جاده' },
  { src: '/images/home/night-drive.svg', alt: 'رانندگی شبانه در اتوبان با نورهای شهری' },
  { src: '/images/home/tools.svg', alt: 'ابزارهای تخصصی تعمیر خودرو روی میز کار' }
];

export default function HomeGallery() {
  return (
    <section className="section" aria-labelledby="home-gallery-heading">
      <div className="container home-gallery">
        <div className="home-gallery__intro">
          <p className="eyebrow">گوشه‌ای از تجربه اتو سرویس مانی</p>
          <h2 id="home-gallery-heading">هر آنچه برای نگهداری خودرو نیاز دارید در یک نگاه</h2>
          <p>
            از سرویس‌های دوره‌ای تا دیتیلینگ لوکس، تیم ما آماده است تا خودرو شما را برای هر مسیر و
            ماجراجویی آماده کند. این گالری تصویری از فضا، تجهیزات و لحظات مشتریان ماست.
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
