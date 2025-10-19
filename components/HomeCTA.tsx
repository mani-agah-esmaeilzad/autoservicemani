export default function HomeCTA() {
  return (
    <section className="section section--accent" aria-labelledby="home-cta-heading">
      <div className="container home-cta">
        <div className="home-cta__content">
          <p className="eyebrow">وقت سرویس خودروست؟</p>
          <h2 id="home-cta-heading">رزرو آنلاین و تحویل در محل با اتو سرویس مانی</h2>
          <p>
            فقط در چند کلیک سرویس دوره‌ای، دیتیلینگ یا تعویض روغن را رزرو کنید. تیم ما در زمان
            انتخابی شما به محل می‌آید یا خودرو را در گاراژ تخصصی تحویل می‌گیرد.
          </p>
          <div className="home-cta__actions">
            <a className="button button--primary" href="/services">
              رزرو سرویس
            </a>
            <a className="button button--ghost" href="/contact">
              درخواست مشاوره
            </a>
          </div>
        </div>
        <div className="home-cta__media" role="presentation" aria-hidden="true">
          <img src="/images/home/garage-bay.svg" alt="" />
        </div>
      </div>
    </section>
  );
}
