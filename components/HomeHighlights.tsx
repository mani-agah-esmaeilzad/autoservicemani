const highlights = [
  {
    icon: '🛒',
    title: 'تنوع کامل روغن و فیلتر',
    description: 'انتخابی از برندهای جهانی با موجودی لحظه‌ای و مشخصات دقیق برای هر خودرو.'
  },
  {
    icon: '🔍',
    title: 'فیلتر پیشرفته جستجو',
    description: 'براساس مدل خودرو، ویسکوزیته و استاندارد سازنده نتایج را شخصی‌سازی کنید.'
  },
  {
    icon: '🤖',
    title: 'دستیار هوشمند خرید',
    description: 'سوال‌های فنی خود را بپرسید تا مناسب‌ترین روغن یا فیلتر پیشنهاد شود.'
  }
];

export default function HomeHighlights() {
  return (
    <section className="section section--highlight" aria-labelledby="home-highlights-heading">
      <div className="container home-highlight-minimal">
        <header>
          <span className="badge">چرا مانی اویل؟</span>
          <h2 id="home-highlights-heading">فروشگاه تخصصی برای روغن، فیلتر و افزودنی</h2>
          <p>
            ما با تمرکز روی لوازم مصرفی موتور، اطلاعات فنی و ابزارهای مقایسه را فراهم کرده‌ایم تا خریدی مطمئن و سریع داشته باشید.
          </p>
        </header>
        <div className="home-highlight-minimal__grid">
          {highlights.map((item) => (
            <article key={item.title}>
              <span aria-hidden="true">{item.icon}</span>
              <div>
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
