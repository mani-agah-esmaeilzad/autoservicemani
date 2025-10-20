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

  const visibleCategories = categories.slice(0, 10);

  return (
    <div
      ref={wrapperRef}
      className={`category-menu-wrapper category-menu-wrapper--reference ${isOpen ? 'is-open' : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      onFocusCapture={() => setIsOpen(true)}
      onBlurCapture={handleBlur}
    >
      <Link
        href="/store"
        className={`nav-link category-trigger-link category-trigger-link--reference ${isActive ? 'active' : ''}`}
        aria-haspopup="true"
        aria-expanded={isOpen}
        onClick={(event) => {
          if (!isOpen) {
            event.preventDefault();
            setIsOpen(true);
          }
        }}
      >
        <span className="category-trigger-link__dot" aria-hidden="true" />
        {label}
        <span className="category-trigger-link__caret" aria-hidden="true" />
      </Link>

      <div className={`category-menu category-menu--reference ${isOpen ? 'open' : ''}`} role="menu">
        <div className="category-menu__header">
          <h3>دسته‌بندی محصولات</h3>
          <p>با انتخاب دسته مناسب، پیشنهادهای شخصی‌سازی‌شده را مشاهده کنید.</p>
        </div>

        <div className="category-menu__body">
          {isLoading && (
            <div className="category-menu__list category-menu__list--loading">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={`category-skeleton-${index}`} className="category-menu__skeleton" />
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
            <ul className="category-menu__list">
              {visibleCategories.map((category) => (
                <li key={category.id}>
                  <Link href={`/categories/${category.slug}`} onClick={() => setIsOpen(false)}>
                    <span className="category-menu__icon" aria-hidden="true">
                      {category.image ? <img src={category.image} alt="" /> : <span>{category.name.slice(0, 1)}</span>}
                    </span>
                    <div className="category-menu__text">
                      <strong>{category.name}</strong>
                      {category.description && <small>{category.description}</small>}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="category-menu__footer">
          <Link href="/store" onClick={() => setIsOpen(false)}>
            مشاهده تمام محصولات
          </Link>
        </footer>
      </div>
    </div>
  );
}
