'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';

export default function AdminSettingsPage() {
  const [form, setForm] = useState({
    storeName: 'Mani Oil',
    supportEmail: 'support@manioil.ir',
    phone: '021-88990011',
    address: 'تهران، بلوار آیت‌الله کاشانی، مرکز خرید مانی اویل',
    allowReservations: true,
    enableAiAssistant: true,
    enableVoiceReplies: true,
    knowledgeBaseUrl: 'https://manioil.ir/knowledge-base',
    aiEscalationThreshold: 70,
    assistantKeyConfigured: false
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
          نمایش پک‌های پیشنهادی در فروشگاه
        </label>
        <button type="button" className="btn btn-primary">
          ذخیره تغییرات
        </button>
      </form>

      <section className="card" style={{ display: 'grid', gap: '1rem' }}>
        <header>
          <h2>پیکربندی دستیار هوش مصنوعی</h2>
          <p style={{ color: 'var(--color-muted)', margin: 0 }}>
            اتصال به دستیار هوشمند و نحوه پاسخ‌گویی صوتی را از این قسمت مدیریت کنید.
          </p>
        </header>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={form.assistantKeyConfigured}
            onChange={(event) => setForm((prev) => ({ ...prev, assistantKeyConfigured: event.target.checked }))}
          />
          کلید ASM_ASSISTANT_API_KEY روی سرور تنظیم شده است
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={form.enableAiAssistant}
            onChange={(event) => setForm((prev) => ({ ...prev, enableAiAssistant: event.target.checked }))}
          />
          فعال‌سازی دستیار خودکار در وب‌سایت
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input
            type="checkbox"
            checked={form.enableVoiceReplies}
            onChange={(event) => setForm((prev) => ({ ...prev, enableVoiceReplies: event.target.checked }))}
          />
          پخش پاسخ صوتی برای کاربران
        </label>
        <label style={labelStyle}>
          منبع دانش‌نامه داخلی
          <input
            value={form.knowledgeBaseUrl}
            onChange={(event) => setForm((prev) => ({ ...prev, knowledgeBaseUrl: event.target.value }))}
            style={inputStyle}
            placeholder="https://"
          />
        </label>
        <label style={labelStyle}>
          آستانه ارجاع به پشتیبانی (درصد رضایت)
          <input
            type="number"
            min={40}
            max={100}
            value={form.aiEscalationThreshold}
            onChange={(event) =>
              setForm((prev) => ({ ...prev, aiEscalationThreshold: Number(event.target.value) }))
            }
            style={inputStyle}
          />
        </label>
        <button type="button" className="btn btn-ghost">
          ذخیره تنظیمات هوش مصنوعی
        </button>
      </section>
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
