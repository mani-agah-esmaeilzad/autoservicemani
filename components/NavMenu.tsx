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

      <div className={`category-menu ${isOpen ? 'open' : ''}`} role="menu">
        <div className="category-menu__content">
          <div className="category-menu__header">
            <strong>دسته‌بندی محصولات</strong>
            <p>برای شروع خرید یکی از دسته‌های محبوب زیر را انتخاب کنید.</p>
          </div>

          {isLoading && (
            <div className="category-menu__loading">در حال بارگذاری دسته‌بندی‌ها...</div>
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
                  <Link
                    href={`/categories/${category.slug}`}
                    className="category-menu__item"
                    onClick={() => setIsOpen(false)}
                  >
                    <span>{category.name}</span>
                    {category.description && <small>{category.description}</small>}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="category-menu__footer">
          <Link href="/store" onClick={() => setIsOpen(false)}>
            مشاهده همه محصولات
          </Link>
        </div>
      </div>
    </div>
  );
}
