import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/admin', label: 'داشبورد' },
  { href: '/admin/orders', label: 'مدیریت سفارش‌ها' },
  { href: '/admin/products', label: 'مدیریت محصولات' },
  { href: '/admin/reports', label: 'گزارش‌ها و تحلیل' },
  { href: '/admin/settings', label: 'تنظیمات سامانه' }
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside style={{ background: '#fff', borderLeft: '1px solid #ececf1', padding: '2rem 1.5rem', display: 'grid', gap: '1.5rem' }}>
      <div>
        <div style={{ fontWeight: 700, fontSize: '1.2rem' }}>پنل مدیریت</div>
        <p style={{ color: 'var(--color-muted)', marginTop: '0.5rem' }}>مدیریت جامع فروشگاه و خدمات حضوری</p>
      </div>
      <nav style={{ display: 'grid', gap: '0.35rem' }}>
        {links.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '12px',
                background: isActive ? 'rgba(225, 6, 0, 0.08)' : 'transparent',
                color: isActive ? 'var(--color-primary)' : 'var(--color-accent)',
                fontWeight: isActive ? 700 : 500
              }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
