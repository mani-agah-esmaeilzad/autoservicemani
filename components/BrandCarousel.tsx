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
    <section className="section brand-carousel" aria-label="برندهای همکار Auto Service Mani">
      <div className="container">
        <header className="brand-carousel__header">
          <div>
            <span className="badge">همکاران استراتژیک</span>
            <h2>برندهای معتبر در فروشگاه ما</h2>
          </div>
          <p className="brand-carousel__description">
            تامین کالا از برندهای جهانی با ضمانت اصالت و زنجیره تامین مستقیم.
          </p>
        </header>
        <div className="brand-carousel__viewport" role="presentation">
          <div className="brand-carousel__track">
            {trackItems.map((brand, index) => (
              <article key={`${brand.id}-${index}`} className="brand-card" aria-label={brand.name}>
                <img src={brand.logo} alt={`لوگوی ${brand.name}`} />
                <div className="brand-card__meta">
                  <strong>{brand.name}</strong>
                  <span>{brand.tagline}</span>
                  <small>
                    تاسیس {brand.founded} • {brand.country}
                  </small>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
