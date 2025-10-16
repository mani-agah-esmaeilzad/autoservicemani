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
      <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
        <div>
          <h2 style={{ marginBottom: '0.35rem' }}>{title}</h2>
          {description && <p style={{ color: 'var(--color-muted)', margin: 0 }}>{description}</p>}
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))' }}>
            {chunks[index]?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {chunks.length > 1 && (
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              {chunks.map((_, chunkIndex) => (
                <button
                  key={chunkIndex}
                  type="button"
                  onClick={() => setIndex(chunkIndex)}
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '999px',
                    border: 'none',
                    background: index === chunkIndex ? 'var(--color-primary)' : '#e5e6eb',
                    cursor: 'pointer'
                  }}
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
