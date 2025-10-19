'use client';

import { useEffect, useRef, useState, type FocusEvent } from 'react';
import Link from 'next/link';
import type { Category } from '@/lib/types';

type NavMenuProps = {
  isActive?: boolean;
  label?: string;
  categories?: Category[];
  isLoading?: boolean;
};

export default function NavMenu({
  isActive = false,
  label = 'فروشگاه',
  categories = [],
  isLoading = false
}: NavMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const visibleCategories = categories.slice(0, 8);

  return (
    <div
      ref={wrapperRef}
      className={`category-menu-wrapper ${isOpen ? 'is-open' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={handleBlur}
    >
      <Link
        href="/store"
        className={`nav-link category-trigger-link ${isActive ? 'active' : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={(event) => {
          if (!isOpen) {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        {label}
        <span className="category-trigger-link__caret" aria-hidden="true" />
      </Link>

      <div className={`category-menu category-menu--simple ${isOpen ? 'open' : ''}`} role="menu">
        <div className="category-menu__content category-menu__content--simple">
          <div className="category-menu__simple-heading">
            <strong>دسته‌بندی محصولات</strong>
            <p>برای شروع خرید یکی از دسته‌های محبوب زیر را انتخاب کنید.</p>
          </div>

          {isLoading && (
            <div className="category-menu__grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={`category-skeleton-${index}`} className="category-menu__card category-menu__card--skeleton">
                  <span className="category-menu__card-icon" />
                  <div className="category-menu__card-body">
                    <span className="category-menu__card-line" />
                    <span className="category-menu__card-line" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isLoading && visibleCategories.length === 0 && (
            <div className="category-menu__empty">
              <strong>هنوز دسته‌بندی فعالی ثبت نشده است.</strong>
              <p>از طریق پنل مدیریت دسته‌بندی‌های جدید اضافه کنید.</p>
            </div>
          )}

          {!isLoading && visibleCategories.length > 0 && (
            <div className="category-menu__grid">
              {visibleCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="category-menu__link"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="category-menu__link-icon" aria-hidden="true">
                    {category.image ? <img src={category.image} alt="" /> : <span>{category.name.slice(0, 1)}</span>}
                  </div>
                  <div className="category-menu__link-text">
                    <strong>{category.name}</strong>
                    {category.description && <small>{category.description}</small>}
                  </div>
                  <span className="category-menu__link-caret" aria-hidden="true" />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="category-menu__footer category-menu__footer--simple">
          <Link href="/store" onClick={() => setIsOpen(false)}>
            مشاهده همه محصولات
          </Link>
        </div>
      </div>
    </div>
  );
}
