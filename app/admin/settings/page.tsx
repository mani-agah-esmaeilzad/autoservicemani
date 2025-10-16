'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeName: 'Auto Service Mani',
    supportEmail: 'support@autoservicemani.ir',
    phone: '021-88990011',
    address: 'تهران، اتوبان ستاری، خیابان خودرو، پلاک 18',
    allowReservations: true
  });

  return (
    <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '820px' }}>
      <header>
        <h1>تنظیمات سامانه</h1>
        <p style={{ color: 'var(--color-muted)' }}>مدیریت اطلاعات تماس، برندینگ و تنظیمات خدمات</p>
      </header>

      <form className="card" style={{ display: 'grid', gap: '1rem' }}>
        <label style={labelStyle}>
          نام فروشگاه
          <input
            value={form.storeName}
            onChange={(event) => setForm((prev) => ({ ...prev, storeName: event.target.value }))}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          ایمیل پشتیبانی
          <input
            type="email"
            value={form.supportEmail}
            onChange={(event) => setForm((prev) => ({ ...prev, supportEmail: event.target.value }))}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          تلفن تماس
          <input
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            style={inputStyle}
          />
        </label>
        <label style={labelStyle}>
          آدرس حضوری
          <textarea
            value={form.address}
            onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={form.allowReservations}
            onChange={(event) => setForm((prev) => ({ ...prev, allowReservations: event.target.checked }))}
          />
          فعال‌سازی رزرو آنلاین خدمات
        </label>
        <button type="button" className="btn btn-primary">
          ذخیره تغییرات
        </button>
      </form>
    </div>
  );
}

const labelStyle: CSSProperties = {
  display: 'grid',
  gap: '0.35rem',
  fontWeight: 500
};

const inputStyle: CSSProperties = {
  borderRadius: '12px',
  border: '1px solid #d8d9df',
  padding: '0.6rem 0.85rem',
  fontSize: '1rem'
};
