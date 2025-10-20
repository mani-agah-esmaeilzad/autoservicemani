'use client';

import type { Product } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  label?: string;
}

export default function AddToCartButton({ product, className, label = 'افزودن به سبد خرید' }: AddToCartButtonProps) {
  const { dispatch } = useCart();

  return (
    <button
      type="button"
      className={`btn btn-primary ${className ?? ''}`.trim()}
      onClick={() => dispatch({ type: 'ADD', product })}
    >
      {label}
    </button>
  );
}
