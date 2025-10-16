'use client';

import { useMemo, useState } from 'react';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface Props {
  products: Product[];
  title: string;
  description?: string;
}

const ITEMS_PER_VIEW = 4;

export default function ProductCarousel({ products, title, description }: Props) {
  const [index, setIndex] = useState(0);
  const chunks = useMemo(() => {
    const chunked: Product[][] = [];
    for (let i = 0; i < products.length; i += ITEMS_PER_VIEW) {
      chunked.push(products.slice(i, i + ITEMS_PER_VIEW));
    }
    return chunked;
  }, [products]);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="section" style={{ paddingTop: '0' }}>
      <div className="container" style={{ display: 'grid', gap: '1.75rem' }}>
        <div className="carousel-header">
          <h2 style={{ margin: 0 }}>{title}</h2>
          {description && <p style={{ color: 'var(--color-muted)', margin: 0 }}>{description}</p>}
        </div>
        <div style={{ display: 'grid', gap: '1.25rem' }}>
          <div className="carousel-grid">
            {chunks[index]?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {chunks.length > 1 && (
            <div className="carousel-dots">
              {chunks.map((_, chunkIndex) => (
                <button
                  key={chunkIndex}
                  type="button"
                  onClick={() => setIndex(chunkIndex)}
                  className={`carousel-dot ${index === chunkIndex ? 'active' : ''}`}
                  aria-label={`مشاهده اسلاید ${chunkIndex + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
