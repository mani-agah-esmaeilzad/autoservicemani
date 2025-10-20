'use client';

import { useMemo } from 'react';
import type { Brand } from '@/lib/types';

interface BrandCarouselProps {
  brands: Brand[];
}

export default function BrandCarousel({ brands }: BrandCarouselProps) {
  const trackItems = useMemo(() => [...brands, ...brands], [brands]);

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="section section--brands" aria-label="برندهای همکار مانی اویل">
      <div className="container brand-showcase">
        <header className="brand-showcase__header">
          <h2>برندهای مورد اعتماد رانندگان</h2>
          <p>روغن‌ها و فیلترهای اورجینال از برندهای جهانی با تاریخ تولید جدید و زنجیره تامین رسمی.</p>
        </header>
        <div className="brand-showcase__scroller" aria-hidden>
          <div className="brand-showcase__track">
            {trackItems.map((brand, index) => (
              <div key={`${brand.id}-${index}`} className="brand-showcase__item">
                <div className="brand-showcase__logo">
                  <img src={brand.logo} alt={`لوگوی ${brand.name}`} />
                </div>
                <div className="brand-showcase__meta">
                  <strong>{brand.name}</strong>
                  <span>{brand.tagline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
