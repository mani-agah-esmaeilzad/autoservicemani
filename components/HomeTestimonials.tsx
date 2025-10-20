const testimonials = [
  {
    name: 'مهدی ق.',
    role: 'مالک پژو ۲۰۷',
    quote: 'تنوع روغن‌های مانی اویل باعث شد دقیقاً ویسکوزیته پیشنهادی سازنده را پیدا کنم و با ارسال سریع دریافت کنم.'
  },
  {
    name: 'سحر الف.',
    role: 'مدیر ناوگان شرکتی',
    quote: 'پنل کاربری سفارش‌های عمده و پیگیری موجودی را ساده کرده و فاکتورهای خرید به‌صورت خودکار صادر می‌شوند.'
  },
  {
    name: 'رضا ن.',
    role: 'علاقه‌مند تیونینگ',
    quote: 'فیلترهای تخصصی و افزودنی‌های کمیاب را همیشه در همین فروشگاه پیدا می‌کنم و توضیحات فنی دقیق است.'
  }
];

export default function HomeTestimonials() {
  return (
    <section className="section section--testimonials" aria-labelledby="home-testimonials-heading">
      <div className="container home-testimonials home-testimonials--minimal">
        <header className="home-testimonials__header">
          <span className="badge">نظر مشتریان</span>
          <h2 id="home-testimonials-heading">خریداران درباره مانی اویل چه می‌گویند؟</h2>
          <p>بازخورد مشتریانی که روغن و فیلترهای مورد نیازشان را از فروشگاه ما تهیه کرده‌اند.</p>
        </header>
        <div className="home-testimonials__grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="home-testimonial-card home-testimonial-card--minimal">
              <blockquote>{testimonial.quote}</blockquote>
              <figcaption>
                <strong>{testimonial.name}</strong>
                <span>{testimonial.role}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
