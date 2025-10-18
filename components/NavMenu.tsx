'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type MouseEvent as ReactMouseEvent
} from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';

const accentPalette = ['var(--color-primary)', '#0b8c3c', '#0053d6', '#f97316', '#0ea5e9'];
const fallbackBlurbs = [
  'ارسال سریع و پشتیبانی فنی در تمام مراحل خرید',
  'سازگار با خودروهای محبوب بازار ایران',
  'با ضمانت اصالت و تاریخ تولید به‌روز',
  'پیشنهاد کارشناسان اتوسرویس مانی برای سرویس دوره‌ای',
  'امکان رزرو سرویس حضوری همراه با خرید'
];

const collectionHighlights = [
  {
    title: 'پکیج سرویس دوره‌ای',
    href: '/store?collection=maintenance',
    accent: 'var(--color-primary)',
    blurb: 'کامل‌ترین انتخاب برای سرویس ۱۰ هزار کیلومتر همراه با فیلتر و مکمل.'
  },
  {
    title: 'کیت دیتیلینگ حرفه‌ای',
    href: '/store?collection=detailing',
    accent: '#f97316',
    blurb: 'درخشش بدنه و کابین با مجموعه کامل شوینده، واکس و نانوپوشش.'
  },
  {
    title: 'سفر بدون دغدغه',
    href: '/store?collection=travel',
    accent: '#0ea5e9',
    blurb: 'از جامپ‌استارتر تا کیت کمک‌های اولیه برای مسیرهای طولانی.'
  }
];

type NavMenuProps = {
  isActive?: boolean;
  label?: string;
  categories?: Category[];
  isLoading?: boolean;
};

function resolveAccent(index: number) {
  return accentPalette[index % accentPalette.length];
}

function resolveBlurb(category: Category, index: number) {
  if (category.description?.trim()) {
    return category.description.trim();
  }
  return fallbackBlurbs[index % fallbackBlurbs.length];
}

export default function NavMenu({
  isActive = false,
  label = 'فروشگاه',
  categories = [],
  isLoading = false
}: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const featuredCategories = useMemo(() => {
    if (!categories.length) {
      return [] as Category[];
    }
    const featured = categories.filter((category) => category.featured);
    if (featured.length >= 6) {
      return featured.slice(0, 6);
    }
    const remainder = categories.filter((category) => !category.featured);
    return [...featured, ...remainder].slice(0, 6);
  }, [categories]);

  const supportingCategories = useMemo(
    () => categories.filter((category) => !featuredCategories.some((item) => item.id === category.id)),
    [categories, featuredCategories]
  );

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
        <span className="category-trigger-link__caret" aria-hidden="true" />
      </Link>

      <div className={`category-menu ${isOpen ? 'open' : ''}`} role="menu">
        <div className="category-menu__content">
          <aside className="category-menu__summary">
            <div className="category-menu__summary-badge">کاتالوگ هوشمند</div>
            <h3>همه تجهیزات سرویس خودرو در یک نگاه</h3>
            <p>
              جدیدترین قطعات مصرفی، روغن‌های تخصصی و ابزار حرفه‌ای با امکان مشاوره آنلاین برای هر مدل خودرو.
            </p>
            <ul className="category-menu__summary-list">
              <li>پیشنهاد شخصی‌سازی شده براساس خودروی شما</li>
              <li>رزرو سرویس حضوری همزمان با خرید کالا</li>
              <li>ضمانت اصالت و تاریخ تولید تازه تمامی کالاها</li>
            </ul>
            <div className="category-menu__summary-actions">
              <Link href="/assistant" className="btn btn-ghost btn-small" onClick={() => setIsOpen(false)}>
                گفتگو با دستیار هوشمند
              </Link>
              <Link href="/services" className="btn btn-link" onClick={() => setIsOpen(false)}>
                مشاهده خدمات حضوری
              </Link>
            </div>
            <div className="category-menu__summary-illustration" aria-hidden="true" />
          </aside>

          <div className="category-menu__grid">
            {isLoading && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`category-skeleton-${index}`} className="category-menu__card category-menu__card--skeleton">
                    <span className="category-menu__card-icon" />
                    <div className="category-menu__card-body">
                      <span className="category-menu__card-line" />
                      <span className="category-menu__card-line" />
                    </div>
                  </div>
                ))}
              </>
            )}

            {!isLoading && featuredCategories.length === 0 && (
              <div className="category-menu__empty">
                <strong>هنوز دسته‌بندی فعالی ثبت نشده است.</strong>
                <p>برای نمایش گزینه‌ها در مگا منو، از طریق پنل مدیریت دسته‌بندی‌های جدید بسازید.</p>
              </div>
            )}

            {!isLoading &&
              featuredCategories.map((category, index) => {
                const accent = resolveAccent(index);
                const blurb = resolveBlurb(category, index);
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="category-menu__card"
                    onClick={() => setIsOpen(false)}
                  >
                    <span
                      className="category-menu__card-icon"
                      style={{
                        background: `linear-gradient(135deg, ${accent} 0%, rgba(255,255,255,0.12) 100%)`
                      }}
                    >
                      {category.image ? (
                        <img src={category.image} alt="" />
                      ) : (
                        <span className="category-menu__card-initial" aria-hidden="true">
                          {category.name.slice(0, 1)}
                        </span>
                      )}
                    </span>
                    <div className="category-menu__card-body">
                      <strong>{category.name}</strong>
                      <p>{blurb}</p>
                    </div>
                    <span className="category-menu__card-caret" aria-hidden="true" />
                  </Link>
                );
              })}
          </div>
        </div>
        <footer className="category-menu__footer">
          <div className="category-menu__footer-highlights">
            {collectionHighlights.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="category-menu__collection"
                onClick={() => setIsOpen(false)}
              >
                <span className="category-menu__collection-accent" style={{ background: item.accent }} />
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.blurb}</p>
                </div>
                <span className="category-menu__collection-caret" aria-hidden="true" />
              </Link>
            ))}
          </div>
          {categories.length > 0 && (
            <div className="category-menu__footer-tags" role="list">
              {featuredCategories.map((category) => (
                <Link
                  key={`tag-${category.id}`}
                  href={`/categories/${category.slug}`}
                  className="category-menu__tag"
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              {supportingCategories.map((category) => (
                <Link
                  key={`tag-${category.id}`}
                  href={`/categories/${category.slug}`}
                  className="category-menu__tag category-menu__tag--ghost"
                  onClick={() => setIsOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}
