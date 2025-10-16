'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavMenu, { categoryGroups } from './NavMenu';
import SearchBar from './SearchBar';
import { useCart } from '@/contexts/CartContext';

const navLinks = [
  { href: '/', label: 'صفحه اصلی' },
  { href: '/store', label: 'فروشگاه' },
  { href: '/assistant', label: 'دستیار فنی' },
  { href: '/services', label: 'خدمات حضوری' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' }
];

export default function Header() {
  const pathname = usePathname();
  const {
    state: { items }
  } = useCart();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    setPortalElement(document.body);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setIsDrawerOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    setIsDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const shouldLockBody = isDrawerOpen && isMobile;
    document.body.classList.toggle('no-scroll', shouldLockBody);
    return () => document.body.classList.remove('no-scroll');
  }, [isDrawerOpen, isMobile]);

  const toggleAriaLabel = isDrawerOpen ? 'بستن منو' : 'باز کردن منو';

  const mobileDrawer =
    isMobile && portalElement
      ? createPortal(
          <>
            <aside
              id="primary-mobile-drawer"
              className={`mobile-drawer ${isDrawerOpen ? 'open' : ''}`}
              aria-hidden={!isDrawerOpen}
            >
              <div className="mobile-drawer__header">
                <span style={{ fontWeight: 700 }}>منو</span>
                <button type="button" className="mobile-drawer__close" onClick={() => setIsDrawerOpen(false)}>
                  بستن
                </button>
              </div>
              <nav className="mobile-drawer__nav">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link ${pathname === link.href ? 'active' : ''}`}
                    onClick={() => setIsDrawerOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mobile-drawer__categories">
                <h3>دسته‌بندی محصولات</h3>
                {categoryGroups.map((group) => (
                  <div key={group.title} className="category-menu__group">
                    <h3>{group.title}</h3>
                    <div className="category-menu__links">
                      {group.links.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="category-menu__link"
                          onClick={() => setIsDrawerOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
            {isDrawerOpen && <div className="drawer-backdrop" onClick={() => setIsDrawerOpen(false)} />}
          </>,
          portalElement
        )
      : null;

  return (
    <header className="layout-header">
      <div className="container header-inner">
        {isMobile && (
          <button
            type="button"
            className={`mobile-toggle ${isDrawerOpen ? 'open' : ''}`}
            aria-label={toggleAriaLabel}
            aria-controls="primary-mobile-drawer"
            aria-expanded={isDrawerOpen}
            onClick={() => setIsDrawerOpen((prev) => !prev)}
          >
            <span />
          </button>
        )}

        <Link href="/" className="brand">
          <span className="brand-badge">ASM</span>
          <span className="brand-text">
            <strong>اتو سرویس مانی</strong>
            <small>Auto Service Mani</small>
          </span>
        </Link>

        <div className="header-desktop">
          <NavMenu />
          <nav className="nav-links">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="header-search">
          <SearchBar
            size={isMobile ? 'compact' : 'default'}
            placeholder="نام محصول، برند یا خدمت را جستجو کنید..."
          />
        </div>

        <div className="header-actions">
          <Link href="/account" className="account-link">
            حساب من
          </Link>
          <Link href="/cart" className="cart-link">
            سبد خرید
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>
      {mobileDrawer}
    </header>
  );
}
