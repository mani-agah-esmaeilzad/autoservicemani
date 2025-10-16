'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavMenu from './NavMenu';
import { useCart } from '@/contexts/CartContext';

const navLinks = [
  { href: '/', label: 'صفحه اصلی' },
  { href: '/store', label: 'فروشگاه' },
  { href: '/services', label: 'خدمات حضوری' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' }
];

export default function Header() {
  const pathname = usePathname();
  const {
    state: { items }
  } = useCart();

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  return (
    <header
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #ececf1',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1rem 0' }}>
        <Link href="/">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-dark))',
                color: '#fff',
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                display: 'grid',
                placeItems: 'center',
                fontWeight: 700,
                letterSpacing: '1px'
              }}
            >
              ASM
            </span>
            <div>
              <strong style={{ fontSize: '1.1rem' }}>Auto Service Mani</strong>
              <div style={{ fontSize: '0.85rem', color: 'var(--color-muted)' }}>اتو سرویس مانی</div>
            </div>
          </div>
        </Link>

        <NavMenu />

        <nav style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname === link.href ? 'text-primary' : ''}
              style={{ fontWeight: pathname === link.href ? 700 : 500 }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link href="/cart" style={{ position: 'relative', fontWeight: 600 }}>
          سبد خرید
          {totalItems > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-0.55rem',
                left: '-0.85rem',
                background: 'var(--color-primary)',
                color: '#fff',
                borderRadius: '999px',
                padding: '0.1rem 0.45rem',
                fontSize: '0.75rem'
              }}
            >
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
