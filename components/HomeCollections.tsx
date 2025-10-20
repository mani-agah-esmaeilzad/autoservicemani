import Link from 'next/link';

const collections = [
  {
    id: 'bundle-daily-care',
    title: 'پک مراقبت روزمره موتور',
    description: 'روغن تمام‌سنتتیک به‌همراه فیلتر روغن و هوا برای سرویس دوره‌ای خودروهای شهری.',
    items: ['روغن موتور 5W-30', 'فیلتر روغن اورجینال', 'فیلتر هوای کابین'],
    price: 'از ۲٬۴۵۰٬۰۰۰ تومان'
  },
  {
    id: 'bundle-long-life',
    title: 'پک دوام بالا',
    description: 'ترکیب روغن باکیفیت اروپایی، افزودنی محافظ موتور و فیلتر بنزین برای سفرهای طولانی.',
    items: ['روغن موتور Long Life', 'افزودنی محافظ سیتراکس', 'فیلتر بنزین کم‌مصرف'],
    price: 'از ۳٬۹۸۰٬۰۰۰ تومان'
  },
  {
    id: 'bundle-diesel',
    title: 'پک ویژه خودروهای دیزل',
    description: 'برای وانت و کراس‌اوورهای دیزل؛ ترکیبی از روغن کم‌خاکستر و فیلتر ذرات برای عملکرد پایدار.',
    items: ['روغن موتور C3 5W-40', 'فیلتر روغن مان فیلتر', 'فیلتر گازوئیل دو مرحله‌ای'],
    price: 'از ۴٬۵۵۰٬۰۰۰ تومان'
  }
];

export default function HomeCollections() {
  return (
    <section className="section section--collections" aria-labelledby="home-collections-heading">
      <div className="container home-collections">
        <header className="home-collections__header">
          <div>
            <span className="badge">پک‌های آماده خرید</span>
            <h2 id="home-collections-heading">مجموعه‌های انتخاب‌شده برای انواع رانندگان</h2>
            <p>
              هر پک شامل روغن، فیلتر و افزودنی‌های مکمل است تا بدون جست‌وجوی طولانی تمام اقلام مورد نیاز خودرو خود را تهیه کنید.
            </p>
          </div>
          <Link href="/store" className="btn btn-ghost btn-small">
            مشاهده تمام کالاها
          </Link>
        </header>

        <div className="home-collections__grid">
          {collections.map((collection) => (
            <article key={collection.id} className="home-collections__card">
              <header>
                <h3>{collection.title}</h3>
                <span>{collection.price}</span>
              </header>
              <p>{collection.description}</p>
              <ul>
                {collection.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link href="/store" className="home-collections__link">
                انتخاب پک و افزودن به سبد
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
