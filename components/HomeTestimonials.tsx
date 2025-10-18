const testimonials = [
  {
    name: 'مهدی ق.',
    role: 'مالک پژو ۲۰۷',
    quote:
      'با اتو سرویس مانی دیگه دغدغه انتخاب روغن مناسب رو ندارم. پشتیبانی آنلاین و ارسال سریع واقعا عالیه.'
  },
  {
    name: 'سحر الف.',
    role: 'مدیر ناوگان حمل‌ونقل',
    quote:
      'داشبورد مدیریتی و امکان رزرو سرویس دوره‌ای باعث شده هزینه‌های نگهداری ناوگانمون بهینه بشه.'
  },
  {
    name: 'رضا ن.',
    role: 'علاقه‌مند تیونینگ',
    quote:
      'مگا منوی حرفه‌ای و دسته‌بندی دقیق قطعات باعث شد خیلی سریع به قطعه‌ای که می‌خواستم برسم.'
  }
];

export default function HomeTestimonials() {
  return (
    <section className="section" aria-labelledby="home-testimonials-heading">
      <div className="container home-testimonials">
        <header>
          <h2 id="home-testimonials-heading">اعتماد رانندگان حرفه‌ای</h2>
          <p>نظرات مشتریان درباره تجربه خرید، نصب و پشتیبانی اتو سرویس مانی.</p>
        </header>
        <div className="home-testimonials__grid">
          {testimonials.map((testimonial) => (
            <figure key={testimonial.name} className="home-testimonial-card">
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
