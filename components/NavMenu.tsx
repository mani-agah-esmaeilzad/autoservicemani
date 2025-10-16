'use client';

import { useState } from 'react';
import Link from 'next/link';

const categories = [
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

  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        className="btn btn-primary"
        style={{ padding: '0.6rem 1.2rem', fontSize: '0.95rem' }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        دسته‌بندی محصولات
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 12px)',
            right: 0,
            background: '#fff',
            borderRadius: '20px',
            padding: '1.25rem',
            boxShadow: '0 25px 50px rgba(0,0,0,0.12)',
            minWidth: '540px',
            display: 'grid',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '1.5rem',
            zIndex: 50
          }}
        >
          {categories.map((column) => (
            <div key={column.title}>
              <div style={{ fontWeight: 700, marginBottom: '0.85rem', color: 'var(--color-accent)' }}>
                {column.title}
              </div>
              <div style={{ display: 'grid', gap: '0.65rem' }}>
                {column.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    style={{ color: 'var(--color-muted)', fontWeight: 500 }}
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
    </div>
  );
}
