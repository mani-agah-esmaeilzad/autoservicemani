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
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <Link href={`/products/${product.slug}`} style={{ display: 'block', borderRadius: 'var(--radius-md)', overflow: 'hidden', background: '#f7f7f9', minHeight: '220px' }}>
        <div style={{ padding: '1.5rem', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={product.image} alt={product.name} style={{ maxHeight: '180px', objectFit: 'contain' }} />
        </div>
      </Link>
      <div style={{ display: 'grid', gap: '0.5rem', flex: 1 }}>
        <Link href={`/products/${product.slug}`} style={{ fontWeight: 600, fontSize: '1.1rem' }}>
          {product.name}
        </Link>
        <span style={{ color: 'var(--color-muted)' }}>{product.brand}</span>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>{product.price.toLocaleString('fa-IR')} تومان</strong>
          <span style={{ color: 'var(--color-primary)', fontWeight: 600 }}>⭐ {product.rating}</span>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        onClick={() => dispatch({ type: 'ADD', product })}
      >
        افزودن به سبد
      </button>
    </div>
  );
}
