'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [formState, setFormState] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email: formState.email.trim(), password: formState.password });
      router.push('/account');
    } catch (submissionError) {
      if (submissionError instanceof Error) {
        setError(submissionError.message);
      } else {
        setError('ورود انجام نشد. لطفاً دوباره تلاش کنید.');
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
            <span className="badge">ورود به اتو سرویس مانی</span>
            <h1>حساب کاربری خود را مدیریت کنید</h1>
            <p>برای مشاهده سفارش‌ها، پیگیری تیکت‌ها و دسترسی به دستیار هوشمند وارد شوید.</p>
          </header>

          <form className="auth-form" onSubmit={handleSubmit}>
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
              رمز عبور
              <input
                type="password"
                required
                value={formState.password}
                onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                placeholder="رمز عبور"
              />
            </label>

            {error && <div className="form-error">{error}</div>}

            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'در حال ورود...' : 'ورود'}
            </button>
          </form>

          <footer className="auth-card__footer">
            <span>حساب ندارید؟</span>
            <Link href="/register">همین حالا ثبت‌نام کنید</Link>
          </footer>
        </div>
      </div>
    </div>
  );
}
