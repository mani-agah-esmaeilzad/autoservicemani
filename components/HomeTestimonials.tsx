const testimonials = [
  {
    name: 'مهدی ق.',
    role: 'مالک پژو ۲۰۷',
    quote:
      'با اتو سرویس مانی انتخاب روغن مناسب دغدغه نیست؛ سفارش آنلاین و نصب در محل زمان زیادی برای من ذخیره کرد.'
  },
  {
    name: 'سحر الف.',
    role: 'مدیر ناوگان حمل‌ونقل',
    quote:
      'پنل مدیریتی امکان پایش وضعیت خودروهای ناوگان و رزرو گروهی سرویس را فراهم کرده است.'
  },
  {
    name: 'رضا ن.',
    role: 'علاقه‌مند تیونینگ',
    quote: 'دسته‌بندی‌ها و فیلترهای دقیق فروشگاه باعث شد خیلی سریع قطعات سازگار با خودرویم را پیدا کنم.'
  }
];

export default function HomeTestimonials() {
  return (
    <section className="section section--testimonials" aria-labelledby="home-testimonials-heading">
      <div className="container home-testimonials home-testimonials--reference">
        <header className="home-testimonials__header">
          <span className="badge">صدای مشتریان</span>
          <h2 id="home-testimonials-heading">رانندگان درباره اتو سرویس مانی چه می‌گویند؟</h2>
          <p>بازخورد واقعی کسانی که سرویس در محل، خرید قطعات اصل و پشتیبانی ما را تجربه کرده‌اند.</p>
        </header>
        <div className="home-testimonials__grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="home-testimonial-card home-testimonial-card--reference">
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
