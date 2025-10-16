'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export const categoryGroups = [
  {
    title: 'روغن‌ها و مایعات',
    links: [
      { href: '/categories/engine-oils', label: 'روغن موتور' },
      { href: '/categories/transmission', label: 'روغن گیربکس' },
      { href: '/categories/brake-fluid', label: 'روغن ترمز' }
    ]
  },
  {
    title: 'مصرفی و قطعات',
    links: [
      { href: '/categories/filters', label: 'فیلترها' },
      { href: '/categories/spark-plugs', label: 'شمع و ایگنیشن' },
      { href: '/categories/belts', label: 'تسمه‌ها' }
    ]
  },
  {
    title: 'لوازم جانبی و مراقبت',
    links: [
      { href: '/categories/car-care', label: 'مراقبت خودرو' },
      { href: '/categories/accessories', label: 'لوازم جانبی' },
      { href: '/categories/electronics', label: 'الکترونیکی' }
    ]
  }
];

export default function NavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updateViewport = () => setIsMobile(window.innerWidth <= 768);
    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof document === 'undefined') {
      return;
    }

    const shouldLock = isOpen && isMobile;
    document.body.classList.toggle('no-scroll', shouldLock);
    return () => {
      document.body.classList.remove('no-scroll');
    };
  }, [isOpen, isMobile, isMounted]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div className="category-menu-wrapper">
      <button
        type="button"
        className="category-trigger"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        دسته‌بندی محصولات
      </button>

      {isMounted && (
        <div className={`category-menu ${isOpen ? 'open' : ''}`}>
          <div className="category-menu__close">
            <button type="button" onClick={() => setIsOpen(false)}>
              بستن
            </button>
          </div>
          {categoryGroups.map((group) => (
            <div key={group.title} className="category-menu__group">
              <h3>{group.title}</h3>
              <div className="category-menu__links">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="category-menu__link"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOpen && isMobile && <div className="drawer-backdrop" onClick={() => setIsOpen(false)} />}
    </div>
  );
}
