import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="section">
      <div className="container" style={{ textAlign: 'center', display: 'grid', gap: '1rem', justifyItems: 'center' }}>
        <div style={{ fontSize: '4rem' }}>😕</div>
        <h1>صفحه مورد نظر یافت نشد</h1>
        <p style={{ color: 'var(--color-muted)' }}>
          به نظر می‌رسد صفحه‌ای که به دنبال آن هستید در دسترس نیست. می‌توانید به صفحه اصلی یا فروشگاه بازگردید.
        </p>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-primary">
            بازگشت به خانه
          </Link>
          <Link href="/store" className="btn" style={{ border: '1px solid var(--color-primary)', color: 'var(--color-primary)' }}>
            مشاهده فروشگاه
          </Link>
        </div>
      </div>
    </div>
  );
}
