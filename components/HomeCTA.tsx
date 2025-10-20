export default function HomeCTA() {
  return (
    <section className="section section--accent" aria-labelledby="home-cta-heading">
      <div className="container home-cta">
        <div className="home-cta__content">
          <p className="eyebrow">به خانواده مانی اویل بپیوندید</p>
          <h2 id="home-cta-heading">اولین نفری باشید که از تخفیف‌ها و محصولات جدید باخبر می‌شود</h2>
          <p>
            با عضویت در باشگاه مشتریان، پیشنهادهای شخصی‌سازی‌شده برای خودرویتان دریافت کنید و در خرید روغن و فیلتر صرفه‌جویی کنید.
          </p>
          <div className="home-cta__actions">
            <a className="button button--primary" href="/account">
              ایجاد حساب کاربری
            </a>
            <a className="button button--ghost" href="/assistant">
              دریافت مشاوره خرید
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
