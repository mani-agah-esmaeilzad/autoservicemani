'use client';

import { useRef } from 'react';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductCarouselProps {
  products: Product[];
  title: string;
  description?: string;
}

export default function ProductCarousel({ products, title, description }: ProductCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  if (products.length === 0) {
    return null;
  }

  const scrollBy = (direction: number) => {
    if (!scrollerRef.current) {
      return;
    }

    scrollerRef.current.scrollBy({ left: direction * 320, behavior: 'smooth' });
  };

  return (
    <section className="section section--carousel" aria-labelledby="product-carousel-heading">
      <div className="container product-carousel-shell">
        <header className="product-carousel-shell__header">
          <div>
            <span className="badge">منتخب هفته</span>
            <h2 id="product-carousel-heading">{title}</h2>
            {description && <p>{description}</p>}
          </div>
          <div className="product-carousel-shell__actions">
            <button type="button" onClick={() => scrollBy(-1)} aria-label="اسکرول به راست">
              ◀
            </button>
            <button type="button" onClick={() => scrollBy(1)} aria-label="اسکرول به چپ">
              ▶
            </button>
            <Link href="/store" className="btn btn-ghost btn-small">
              مشاهده همه
            </Link>
          </div>
        </header>

        <div ref={scrollerRef} className="product-carousel-shell__scroller" role="list">
          {products.map((product) => (
            <div key={product.id} role="listitem" className="product-carousel-shell__item">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
