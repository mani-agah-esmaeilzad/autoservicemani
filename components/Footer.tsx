import Link from 'next/link';

const quickLinks = [
  { href: '/policies/shipping', label: 'شرایط ارسال' },
  { href: '/policies/returns', label: 'مرجوعی کالا' },
  { href: '/policies/privacy', label: 'حریم خصوصی' },
  { href: '/policies/terms', label: 'قوانین و مقررات' }
];

export default function Footer() {
  return (
    <footer style={{ background: '#111', color: '#fff', marginTop: '4rem' }}>
      <div className="container" style={{ padding: '3.5rem 0', display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        <div>
          <div style={{ fontSize: '1.35rem', fontWeight: 700, marginBottom: '0.75rem' }}>Auto Service Mani</div>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
            اتو سرویس مانی با ارائه خدمات تخصصی تعویض روغن و فروش آنلاین بهترین برندهای لوازم مصرفی، تجربه‌ای متفاوت و مطمئن از نگهداری خودرو فراهم می‌کند.
          </p>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.85rem' }}>لینک‌های سریع</div>
          <div style={{ display: 'grid', gap: '0.5rem' }}>
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href} style={{ color: 'rgba(255,255,255,0.7)' }}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: '0.85rem' }}>اطلاعات تماس</div>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.8 }}>
            تهران، اتوبان ستاری، نبش خیابان خودرو سرویس<br />
            تلفن: 021-88990011<br />
            ایمیل: support@autoservicemani.ir
          </p>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="container" style={{ padding: '1.5rem 0', display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.6)' }}>
          <span>© {new Date().getFullYear()} Auto Service Mani. تمام حقوق محفوظ است.</span>
          <span>طراحی با ❤️ توسط تیم اتو سرویس مانی</span>
        </div>
      </div>
    </footer>
  );
}
