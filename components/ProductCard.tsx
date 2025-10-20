'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { dispatch } = useCart();

  return (
    <article className="product-card product-card--reference">
      <Link href={`/products/${product.slug}`} className="product-card__media" aria-label={product.name}>
        <img src={product.image} alt={product.name} />
      </Link>
      <div className="product-card__content">
        <Link href={`/products/${product.slug}`} className="product-card__title">
          {product.name}
        </Link>
        <div className="product-card__meta">
          <span className="product-card__brand">{product.brand}</span>
          <span className="product-card__rating">⭐ {product.rating.toFixed(1)}</span>
        </div>
        <div className="product-card__price">
          <strong>{product.price.toLocaleString('fa-IR')} تومان</strong>
          <small>موجودی: {product.inStock}</small>
        </div>
      </div>
      <button type="button" className="btn btn-primary btn-small" onClick={() => dispatch({ type: 'ADD', product })}>
        افزودن به سبد خرید
      </button>
    </article>
  );
}
