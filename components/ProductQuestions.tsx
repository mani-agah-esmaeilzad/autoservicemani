'use client';

import { FormEvent, useState, useTransition } from 'react';
import type { ProductQuestion } from '@/lib/types';

interface ProductQuestionsProps {
  productId: string;
  initialQuestions: ProductQuestion[];
}

export default function ProductQuestions({ productId, initialQuestions }: ProductQuestionsProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [author, setAuthor] = useState('');
  const [question, setQuestion] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    if (question.trim().length < 10 || author.trim().length < 2) {
      setError('لطفاً نام و سوال خود را با جزئیات وارد کنید.');
      return;
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/products/${productId}/questions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ author, question })
        });
        const payload = (await response.json()) as { question?: ProductQuestion; error?: string };

        if (!response.ok || !payload.question) {
          throw new Error(payload.error ?? 'ارسال سوال با خطا روبه‌رو شد.');
        }

        setQuestions((prev) => [payload.question!, ...prev]);
        setAuthor('');
        setQuestion('');
        setSuccess('سوال شما ثبت شد و پس از بررسی کارشناسان پاسخ داده می‌شود.');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'مشکلی رخ داد، لطفاً مجدداً تلاش کنید.');
      }
    });
  };

  return (
    <div className="product-questions">
      <header>
        <div>
          <h3>پرسش و پاسخ کاربران</h3>
          <p>سوالات فنی خود را مطرح کنید، تیم اتو سرویس مانی با کمک Google AI پاسخ می‌دهد.</p>
        </div>
      </header>

      <form className="product-questions__form" onSubmit={handleSubmit}>
        <div className="product-questions__fields">
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="نام و نام خانوادگی"
            aria-label="نام ارسال کننده"
            required
          />
          <textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="سوال فنی خود را بنویسید..."
            rows={3}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isPending}>
          {isPending ? 'در حال ارسال...' : 'ثبت سوال'}
        </button>
      </form>
      {error && <div className="alert alert-error">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="product-questions__list">
        {questions.length === 0 ? (
          <p className="product-questions__empty">هنوز سوالی برای این محصول ثبت نشده است.</p>
        ) : (
          questions.map((item) => (
            <article key={item.id} className="product-questions__item">
              <div className="product-questions__item-header">
                <strong>{item.author}</strong>
                <span>{new Date(item.createdAt).toLocaleDateString('fa-IR')}</span>
              </div>
              <p className="product-questions__question">{item.question}</p>
              {item.answer ? (
                <div className="product-questions__answer">
                  <strong>پاسخ کارشناس</strong>
                  <p>{item.answer}</p>
                </div>
              ) : (
                <span className="product-questions__pending">در انتظار پاسخ کارشناسان</span>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  );
}
