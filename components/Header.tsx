'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import NavMenu, { categoryGroups } from './NavMenu';
import SearchBar from './SearchBar';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';

const navLinks = [
  { href: '/', label: 'صفحه اصلی' },
  { href: '/store', label: 'فروشگاه' },
  { href: '/assistant', label: 'دستیار هوشمند' },
  { href: '/about', label: 'درباره ما' },
  { href: '/contact', label: 'تماس با ما' }
];

export default function Header() {
  const pathname = usePathname();
  const {
    state: { items }
  } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [portalElement, setPortalElement] = useState<HTMLElement | null>(null);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const accountMenuRef = useRef<HTMLDivElement | null>(null);

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
    setIsAccountMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!accountMenuRef.current?.contains(event.target as Node)) {
        setIsAccountMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

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
          <div className="account-actions" ref={accountMenuRef}>
            <button
              type="button"
              className={`icon-button ${isAccountMenuOpen ? 'is-active' : ''}`}
              aria-haspopup="true"
              aria-expanded={isAccountMenuOpen}
              aria-label="مدیریت حساب"
              onClick={() => setIsAccountMenuOpen((prev) => !prev)}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M12 12c2.761 0 5-2.462 5-5.5S14.761 1 12 1 7 3.462 7 6.5 9.239 12 12 12zm0 2c-3.866 0-7 3.038-7 6.667C5 21.403 5.597 22 6.333 22h11.334C18.403 22 19 21.403 19 20.667 19 17.038 15.866 14 12 14z"
                  fill="currentColor"
                />
              </svg>
            </button>
            {isAccountMenuOpen && (
              <div className="account-menu" role="menu">
                <div className="account-menu__header">
                  <span className="badge">حساب کاربری</span>
                  <strong>{isAuthenticated ? user?.name : 'کاربر مهمان'}</strong>
                  <small>{isAuthenticated ? user?.email : 'برای مدیریت سفارش‌ها وارد شوید'}</small>
                </div>
                <div className="account-menu__links">
                  {isAuthenticated ? (
                    <>
                      <Link href="/account" role="menuitem" onClick={() => setIsAccountMenuOpen(false)}>
                        مدیریت حساب
                      </Link>
                      <Link href="/cart" role="menuitem" onClick={() => setIsAccountMenuOpen(false)}>
                        سفارش‌های من
                      </Link>
                      <button
                        type="button"
                        role="menuitem"
                        onClick={() => {
                          logout();
                          setIsAccountMenuOpen(false);
                        }}
                      >
                        خروج از حساب
                      </button>
                    </>
                  ) : (
                    <>
                      <Link href="/login" role="menuitem" onClick={() => setIsAccountMenuOpen(false)}>
                        ورود به سامانه
                      </Link>
                      <Link href="/register" role="menuitem" onClick={() => setIsAccountMenuOpen(false)}>
                        ایجاد حساب جدید
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link href="/cart" className="icon-button cart-button" aria-label="سبد خرید">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M7 4h-2l-1 2v2h2l2.68 7.805A2 2 0 0010.58 17h6.94a2 2 0 001.9-1.368L22 6H7"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="10" cy="20" r="1.5" fill="currentColor" />
              <circle cx="18" cy="20" r="1.5" fill="currentColor" />
            </svg>
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>
        </div>
      </div>
      {mobileDrawer}
    </header>
  );
}
