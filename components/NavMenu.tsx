'use client';

import { useEffect, useRef, useState, type FocusEvent, type MouseEvent as ReactMouseEvent } from 'react';
import Link from 'next/link';

type MegaMenuLink = {
  href: string;
  label: string;
  icon: string;
  description: string;
};

export const categoryGroups: Array<{ title: string; accent: string; links: MegaMenuLink[] }> = [
  {
    title: 'روغن‌ها و مایعات',
    accent: 'var(--color-primary)',
    links: [
      {
        href: '/categories/engine-oils',
        label: 'روغن موتور',
        icon: '/images/categories/engine-oil.svg',
        description: 'سنتتیک، نیمه‌سنتتیک و ویژه فیلتر DPF'
      },
      {
        href: '/categories/transmission',
        label: 'روغن گیربکس',
        icon: '/images/categories/transmission.svg',
        description: 'ATF، CVT و روغن دنده دستی'
      },
      {
        href: '/categories/brake-fluid',
        label: 'روغن ترمز',
        icon: '/images/categories/brake-fluid.svg',
        description: 'استاندارد DOT و مایع خنک‌کننده'
      }
    ]
  },
  {
    title: 'مصرفی و قطعات',
    accent: '#0b8c3c',
    links: [
      {
        href: '/categories/filters',
        label: 'فیلترها',
        icon: '/images/categories/filter.svg',
        description: 'هوا، روغن، کابین و فیلتر سوخت'
      },
      {
        href: '/categories/spark-plugs',
        label: 'شمع و ایگنیشن',
        icon: '/images/categories/ignition.svg',
        description: 'شمع سوزنی، کوئل و سیم‌های ولتاژ'
      },
      {
        href: '/categories/belts',
        label: 'تسمه‌ها',
        icon: '/images/categories/belt.svg',
        description: 'تسمه تایم، دینام و هرزگردها'
      }
    ]
  },
  {
    title: 'لوازم جانبی و مراقبت',
    accent: '#0053d6',
    links: [
      {
        href: '/categories/car-care',
        label: 'مراقبت خودرو',
        icon: '/images/categories/car-care.svg',
        description: 'شست‌وشو، واکس، پولیش و نانو پوشش'
      },
      {
        href: '/categories/accessories',
        label: 'لوازم جانبی',
        icon: '/images/categories/accessories.svg',
        description: 'نورپردازی، نظم‌دهنده و آپشن‌های کابین'
      },
      {
        href: '/categories/electronics',
        label: 'تجهیزات الکترونیکی',
        icon: '/images/categories/electronics.svg',
        description: 'دوربین، دیاگ همراه و باتری یدکی'
      }
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
                  <span className="category-menu__link-icon" aria-hidden="true">
                    <span className="category-menu__link-icon-swatch" style={{ background: group.accent }} />
                    <img src={link.icon} alt="" />
                  </span>
                  <span className="category-menu__link-text">
                    <strong>{link.label}</strong>
                    <span>{link.description}</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
