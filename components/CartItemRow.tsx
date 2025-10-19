'use client';

import type { CartItem } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';

interface Props {
  item: CartItem;
}

export default function CartItemRow({ item }: Props) {
  const { dispatch } = useCart();

  return (
    <div className="card" style={{ display: 'grid', gridTemplateColumns: '120px 1fr auto', gap: '1.5rem', alignItems: 'center' }}>
      <div style={{ background: '#f7f7f9', borderRadius: '16px', padding: '1rem', display: 'grid', placeItems: 'center' }}>
        <img src={item.product.image} alt={item.product.name} style={{ maxHeight: '90px', objectFit: 'contain' }} />
      </div>
      <div style={{ display: 'grid', gap: '0.35rem' }}>
        <strong>{item.product.name}</strong>
        <span style={{ color: 'var(--color-muted)' }}>برند: {item.product.brand}</span>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <label htmlFor={`quantity-${item.product.id}`} style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            تعداد:
          </label>
          <input
            id={`quantity-${item.product.id}`}
            type="number"
            min={1}
            value={item.quantity}
            onChange={(event) =>
              dispatch({ type: 'UPDATE', productId: item.product.id, quantity: Number(event.target.value) })
            }
            style={{
              width: '72px',
              padding: '0.35rem 0.5rem',
              borderRadius: '10px',
              border: '1px solid #d8d9df',
              textAlign: 'center'
            }}
          />
        </div>
      </div>
      <div style={{ display: 'grid', gap: '0.5rem', textAlign: 'left' }}>
        <strong>{(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان</strong>
        <button
          type="button"
          onClick={() => dispatch({ type: 'REMOVE', productId: item.product.id })}
          style={{
            border: 'none',
            background: 'rgba(225,6,0,0.1)',
            color: 'var(--color-primary)',
            padding: '0.5rem 0.75rem',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          حذف از سبد
        </button>
      </div>
    </div>
  );
}
