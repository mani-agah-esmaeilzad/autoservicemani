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
    <div className="product-card">
      <Link href={`/products/${product.slug}`} className="product-card__media">
        <img src={product.image} alt={product.name} style={{ maxHeight: '180px', objectFit: 'contain' }} />
      </Link>
      <div className="product-card__info">
        <Link href={`/products/${product.slug}`} style={{ fontWeight: 600, fontSize: '1.08rem' }}>
          {product.name}
        </Link>
        <span className="product-card__brand">{product.brand}</span>
        <div className="product-card__meta">
          <strong>{product.price.toLocaleString('fa-IR')} تومان</strong>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>⭐ {product.rating}</span>
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={() => dispatch({ type: 'ADD', product })}>
        افزودن به سبد
      </button>
    </div>
  );
}
