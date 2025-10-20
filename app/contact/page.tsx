import type { CSSProperties } from 'react';

export const metadata = {
  title: 'تماس با مانی اویل',
  description: 'مسیرهای ارتباطی با تیم فروش و پشتیبانی Mani Oil'
};

export default function ContactPage() {
  return (
    <div className="section">
      <div className="container" style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}>
        <div className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <h1>ارتباط با ما</h1>
          <p style={{ color: 'var(--color-muted)' }}>
            تیم پشتیبانی مانی اویل آماده پاسخگویی به سوالات، پیگیری سفارش‌ها و ارائه مشاوره خرید است.
          </p>
          <div>
            <strong>آدرس فروشگاه مرکزی</strong>
            <p style={{ color: 'var(--color-muted)' }}>تهران، بلوار آیت‌الله کاشانی، مرکز خرید مانی اویل</p>
          </div>
          <div>
            <strong>تلفن</strong>
            <p style={{ color: 'var(--color-muted)' }}>021-88990011 | 021-88990022</p>
          </div>
          <div>
            <strong>ایمیل</strong>
            <p style={{ color: 'var(--color-muted)' }}>support@manioil.ir</p>
          </div>
        </div>

        <form className="card" style={{ display: 'grid', gap: '0.75rem' }}>
          <h2>فرم پیام آنلاین</h2>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            نام و نام خانوادگی
            <input placeholder="نام شما" style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            ایمیل
            <input type="email" placeholder="you@example.com" style={inputStyle} />
          </label>
          <label style={{ display: 'grid', gap: '0.35rem' }}>
            پیام شما
            <textarea rows={4} placeholder="متن پیام" style={{ ...inputStyle, resize: 'vertical' }} />
          </label>
          <button type="submit" className="btn btn-primary">
            ارسال پیام
          </button>
        </form>
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
