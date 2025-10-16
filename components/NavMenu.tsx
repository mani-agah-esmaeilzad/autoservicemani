'use client';

import { useEffect, useRef, useState, type FocusEvent, type MouseEvent as ReactMouseEvent } from 'react';
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

type NavMenuProps = {
  isActive?: boolean;
  label?: string;
};

export default function NavMenu({ isActive = false, label = 'فروشگاه' }: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const updatePointerMode = () => {
      setIsTouchDevice(window.matchMedia('(pointer: coarse)').matches);
    };

    updatePointerMode();
    window.addEventListener('resize', updatePointerMode);
    return () => window.removeEventListener('resize', updatePointerMode);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const handleTriggerClick = (event: ReactMouseEvent<HTMLAnchorElement>) => {
    if (isTouchDevice && !isOpen) {
      event.preventDefault();
      setIsOpen(true);
      return;
    }

    setIsOpen(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={`category-menu-wrapper ${isOpen ? 'is-open' : ''}`}
      onMouseEnter={() => {
        if (!isTouchDevice) {
          setIsOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (!isTouchDevice) {
          setIsOpen(false);
        }
      }}
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={handleBlur}
    >
      <Link
        href="/store"
        className={`nav-link category-trigger-link ${isActive ? 'active' : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
        onFocus={() => setIsOpen(true)}
      >
        {label}
      </Link>

      <div className={`category-menu ${isOpen ? 'open' : ''}`} role="menu">
        {categoryGroups.map((group) => (
          <div key={group.title} className="category-menu__group">
            <h3>{group.title}</h3>
            <div className="category-menu__links">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="category-menu__link"
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
