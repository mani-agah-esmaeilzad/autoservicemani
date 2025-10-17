import Link from 'next/link';

export default function CheckoutSuccessPage() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'grid', gap: '1.5rem', maxWidth: '680px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
          <h1>سفارش شما با موفقیت ثبت شد</h1>
          <p style={{ color: 'var(--color-muted)' }}>
            کارشناسان ما به زودی با شما تماس خواهند گرفت تا زمان‌بندی ارسال یا ارائه خدمات حضوری هماهنگ شود.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
            <Link href="/store" className="btn btn-primary">
              ادامه خرید
            </Link>
            <Link href="/account" className="btn" style={{ border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
              پیگیری سفارش‌ها
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
