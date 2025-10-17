'use client';

import { FormEvent, useState } from 'react';
import type { CSSProperties } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/contexts/CartContext';

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const router = useRouter();
  const { state, dispatch } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const total = state.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (state.items.length === 0) return;

    const formData = new FormData(event.currentTarget);
    setIsSubmitting(true);

    const response = await fetch('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        customerName: formData.get('name'),
        customerEmail: formData.get('email'),
        address: formData.get('address'),
        items: state.items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          price: item.product.price
        }))
      }),
      headers: { 'Content-Type': 'application/json' }
    });

    setIsSubmitting(false);

    if (response.ok) {
      dispatch({ type: 'CLEAR' });
      router.push('/checkout/success');
    }
  };

  return (
    <div className="section">
      <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <form className="card" style={{ display: 'grid', gap: '1rem' }} onSubmit={handleSubmit}>
          <h1>تکمیل سفارش</h1>
          <p style={{ color: 'var(--color-muted)', marginTop: '-0.25rem' }}>
            اطلاعات تماس و آدرس تحویل را وارد کنید تا سفارش شما ثبت شود.
          </p>

          <label style={{ display: 'grid', gap: '0.35rem' }}>
            نام و نام خانوادگی
            <input name="name" required placeholder="مثال: علی رضایی" style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            ایمیل
            <input name="email" type="email" required placeholder="you@example.com" style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            شماره تماس
            <input name="phone" required placeholder="09120000000" style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            آدرس کامل
            <textarea name="address" required rows={4} placeholder="تهران، خیابان ..." style={{ ...inputStyle, resize: 'vertical' }} />
          </label>

          <button type="submit" className="btn btn-primary" disabled={isSubmitting || state.items.length === 0}>
            {isSubmitting ? 'در حال ثبت سفارش...' : 'ثبت سفارش'}
          </button>
        </form>

        <div className="card" style={{ display: 'grid', gap: '1rem', alignSelf: 'start' }}>
          <h2>خلاصه سفارش</h2>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {state.items.map((item) => (
              <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-muted)' }}>
                <span>
                  {item.product.name}
                  <span style={{ fontSize: '0.85rem', marginRight: '0.25rem' }}>× {item.quantity}</span>
                </span>
                <span>{(item.product.price * item.quantity).toLocaleString('fa-IR')} تومان</span>
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid #ececf1', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <strong>مجموع</strong>
            <strong>{total.toLocaleString('fa-IR')} تومان</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputStyle: CSSProperties = {
  borderRadius: '12px',
  border: '1px solid #d8d9df',
  padding: '0.65rem 0.85rem',
  fontSize: '1rem'
};
