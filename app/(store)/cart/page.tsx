'use client';

import Link from 'next/link';
import CartItemRow from '@/components/CartItemRow';
import { useCart } from '@/contexts/CartContext';

export default function CartPage() {
  const {
    state: { items }
  } = useCart();

  const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="section">
      <div className="container" style={{ display: 'grid', gap: '1.5rem' }}>
        <header>
          <h1>سبد خرید شما</h1>
          <p style={{ color: 'var(--color-muted)' }}>بررسی و نهایی‌سازی سفارش قبل از پرداخت</p>
        </header>

        {items.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <p>سبد خرید شما خالی است.</p>
            <Link href="/store" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              بازگشت به فروشگاه
            </Link>
          </div>
        ) : (
          <>
            <div className="grid" style={{ gap: '1rem' }}>
              {items.map((item) => (
                <CartItemRow key={item.product.id} item={item} />
              ))}
            </div>
            <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>مبلغ قابل پرداخت</strong>
                <p style={{ color: 'var(--color-muted)' }}>شامل هزینه ارسال بر اساس آدرس مقصد</p>
              </div>
              <div style={{ display: 'grid', gap: '0.5rem', textAlign: 'left' }}>
                <strong style={{ fontSize: '1.4rem' }}>{total.toLocaleString('fa-IR')} تومان</strong>
                <Link href="/checkout" className="btn btn-primary">
                  ادامه فرآیند خرید
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
