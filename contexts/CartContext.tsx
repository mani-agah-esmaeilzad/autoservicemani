'use client';

import { createContext, useContext, useMemo, useReducer } from 'react';
import type { CartItem, Product } from '@/lib/types';

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: 'ADD'; product: Product; quantity?: number }
  | { type: 'REMOVE'; productId: string }
  | { type: 'CLEAR' }
  | { type: 'UPDATE'; productId: string; quantity: number };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
}>({
  state: { items: [] },
  dispatch: () => undefined
});

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find((item) => item.product.id === action.product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.product.id === action.product.id
              ? { ...item, quantity: item.quantity + (action.quantity ?? 1) }
              : item
          )
        };
      }
      return {
        items: [...state.items, { product: action.product, quantity: action.quantity ?? 1 }]
      };
    }
    case 'REMOVE':
      return { items: state.items.filter((item) => item.product.id !== action.productId) };
    case 'UPDATE':
      return {
        items: state.items.map((item) =>
          item.product.id === action.productId
            ? { ...item, quantity: Math.max(1, action.quantity) }
            : item
        )
      };
    case 'CLEAR':
      return { items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
