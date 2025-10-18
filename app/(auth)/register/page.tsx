'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await register({
        name: formState.name.trim(),
        email: formState.email.trim(),
        phone: formState.phone.trim() || undefined,
        password: formState.password
      });
      router.push('/account');
    } catch (submissionError) {
      if (submissionError instanceof Error) {
        setError(submissionError.message);
      } else {
        setError('ثبت‌نام انجام نشد. لطفاً دوباره تلاش کنید.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="section">
      <div className="container auth-page">
        <div className="card auth-card">
          <header className="auth-card__header">
            <span className="badge">ثبت‌نام در اتو سرویس مانی</span>
            <h1>به خانواده مشتریان ما بپیوندید</h1>
            <p>با ساخت حساب کاربری، سفارش‌ها و گفتگوهای دستیار هوشمند را در یک داشبورد مدیریت کنید.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              نام و نام خانوادگی
              <input
                type="text"
                required
                value={formState.name}
                onChange={(event) => setFormState((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="نام کامل"
              />
            </label>
            <label>
              ایمیل
              <input
                type="email"
                required
                value={formState.email}
                onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                placeholder="example@email.com"
              />
            </label>
            <label>
              شماره تماس (اختیاری)
              <input
                type="tel"
                value={formState.phone}
                onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
                placeholder="09xxxxxxxxx"
              />
            </label>
            <label>
              رمز عبور
              <input
                type="password"
                required
                minLength={6}
                value={formState.password}
                onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="حداقل 6 کاراکتر"
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ایجاد حساب...' : 'ایجاد حساب'}
            </button>
          </form>

          <footer className="auth-card__footer">
            <span>حساب دارید؟</span>
            <Link href="/login">وارد شوید</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
