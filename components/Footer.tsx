import Link from 'next/link';

const quickLinks = [
  { href: '/policies/shipping', label: 'شرایط ارسال' },
  { href: '/policies/returns', label: 'مرجوعی کالا' },
  { href: '/policies/privacy', label: 'حریم خصوصی' },
  { href: '/policies/terms', label: 'قوانین و مقررات' }
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__top">
        <div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>Mani Oil</div>
          <p>
            مانی اویل فروشگاهی تخصصی برای روغن، فیلتر و افزودنی‌های اورجینال است؛ با اطلاعات فنی کامل، ارسال سریع و پشتیبانی
            کارشناسی کنار شما هستیم.
          </p>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.85rem' }}>لینک‌های سریع</div>
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ color: 'rgba(255,255,255,0.75)' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.85rem' }}>اطلاعات تماس</div>
          <p>
            تهران، بلوار آیت‌الله کاشانی، مرکز خرید مانی اویل
            <br />
            تلفن: 021-88990011
            <br />
            ایمیل: support@manioil.ir
          </p>
        </div>
      </div>

      <div className="site-footer__bottom">
        <div className="container site-footer__bottom-inner">
          <span>© {new Date().getFullYear()} Mani Oil. تمام حقوق محفوظ است.</span>
          <span>طراحی با ❤️ توسط تیم مانی اویل</span>
        </div>
      </div>
    </footer>
  );
}
