'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import type { Category } from '@/lib/types';

interface CategoryFormState {
  id?: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  featured: boolean;
}

const initialFormState: CategoryFormState = {
  id: undefined,
  name: '',
  slug: '',
  description: '',
  image: '',
  featured: false
};

function slugify(value: string) {
  return value
    .trim()
    .normalize('NFKD')
    .replace(/[\u0640]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\p{L}\p{N}-]+/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<CategoryFormState>(initialFormState);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sortedCategories = useMemo(
    () =>
      categories
        .slice()
        .sort((a, b) => a.name.localeCompare(b.name, 'fa')),
    [categories]
  );

  const loadCategories = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/categories', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error('FAILED_TO_LOAD');
      }
      const data = await response.json();
      setCategories(Array.isArray(data.categories) ? data.categories : []);
      setError(null);
    } catch (loadError) {
      console.error(loadError);
      setError('بارگیری دسته‌بندی‌ها با خطا روبه‌رو شد. اتصال شبکه یا پایگاه‌داده را بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories().catch((loadError) => {
      console.error(loadError);
      setError('بارگیری دسته‌بندی‌ها ممکن نشد.');
      setIsLoading(false);
    });
  }, [loadCategories]);

  const resetForm = useCallback(() => {
    setForm(initialFormState);
    setSuccess(null);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) {
      setError('نام دسته‌بندی الزامی است.');
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload: CategoryFormState = {
      ...form,
      name: form.name.trim(),
      slug: form.slug.trim(),
      description: form.description.trim(),
      image: form.image.trim()
    };

    if (!payload.slug) {
      payload.slug = slugify(payload.name);
    }

    try {
      const response = await fetch('/api/categories', {
        method: payload.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? 'ذخیره دسته‌بندی انجام نشد.');
      }

      if (data.category) {
        setCategories((prev) => {
          const next = prev.filter((category) => category.id !== data.category.id).concat(data.category);
          return next.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
        });
      }

      setSuccess(payload.id ? 'دسته‌بندی با موفقیت به‌روزرسانی شد.' : 'دسته‌بندی جدید اضافه شد.');
      resetForm();
    } catch (saveError) {
      console.error(saveError);
      setError(saveError instanceof Error ? saveError.message : 'ذخیره دسته‌بندی انجام نشد.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (category: Category) => {
    setForm({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      featured: Boolean(category.featured)
    });
    setSuccess(null);
  };

  const handleDelete = async (categoryId: string) => {
    if (!categoryId) {
      return;
    }

    try {
      const response = await fetch(`/api/categories?id=${categoryId}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? 'حذف دسته‌بندی با خطا مواجه شد.');
      }

      setCategories((prev) => prev.filter((category) => category.id !== categoryId));
      if (form.id === categoryId) {
        resetForm();
      }
      setSuccess('دسته‌بندی حذف شد.');
    } catch (deleteError) {
      console.error(deleteError);
      setError(deleteError instanceof Error ? deleteError.message : 'امکان حذف دسته‌بندی وجود ندارد.');
    }
  };

  const toggleFeatured = async (category: Category) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: category.id,
          name: category.name,
          slug: category.slug,
          description: category.description,
          image: category.image,
          featured: !category.featured
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? 'به‌روزرسانی وضعیت ویژه انجام نشد.');
      }

      if (data.category) {
        setCategories((prev) => {
          const next = prev.filter((item) => item.id !== data.category.id).concat(data.category);
          return next.sort((a, b) => a.name.localeCompare(b.name, 'fa'));
        });
      }
      setSuccess(`وضعیت نمایش ویژه «${category.name}» به‌روزرسانی شد.`);
    } catch (updateError) {
      console.error(updateError);
      setError(updateError instanceof Error ? updateError.message : 'به‌روزرسانی انجام نشد.');
    }
  };

  const handleNameChange = (value: string) => {
    setForm((prev) => {
      const nextSlug = !prev.slug || prev.slug === slugify(prev.name) ? slugify(value) : prev.slug;
      return { ...prev, name: value, slug: nextSlug };
    });
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1>مدیریت دسته‌بندی‌ها</h1>
        <p style={{ color: 'var(--color-muted)' }}>
          ساخت، ویرایش و اولویت‌بندی دسته‌بندی‌های فروشگاه برای نمایش در مگا منو و صفحات محصول
        </p>
      </header>

      {error && (
        <div className="card" style={{ background: 'rgba(225, 6, 0, 0.08)', color: '#ad0500' }}>
          {error}
        </div>
      )}

      {success && (
        <div className="card" style={{ background: 'rgba(11, 140, 60, 0.08)', color: '#0b8c3c' }}>
          {success}
        </div>
      )}

      <form className="card" style={{ display: 'grid', gap: '1rem' }} onSubmit={handleSubmit}>
        <h2>{form.id ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی جدید'}</h2>
        <div style={{ display: 'grid', gap: '0.75rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
          <label style={labelStyle}>
            نام دسته‌بندی
            <input value={form.name} onChange={(event) => handleNameChange(event.target.value)} style={inputStyle} required />
          </label>
          <label style={labelStyle}>
            نامک (Slug)
            <input value={form.slug} onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            آدرس تصویر (اختیاری)
            <input value={form.image} onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))} style={inputStyle} />
          </label>
        </div>
        <label style={labelStyle}>
          توضیحات کوتاه (برای نمایش در مگا منو)
          <textarea
            value={form.description}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </label>
        <label style={{ ...labelStyle, alignItems: 'center', flexDirection: 'row', justifyContent: 'space-between' }}>
          <span>نمایش به‌صورت ویژه در مگا منو</span>
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(event) => setForm((prev) => ({ ...prev, featured: event.target.checked }))}
            style={{ width: '20px', height: '20px' }}
          />
        </label>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          {form.id && (
            <button type="button" className="btn btn-ghost" onClick={resetForm}>
              انصراف از ویرایش
            </button>
          )}
          <button type="submit" className="btn" disabled={isSaving}>
            {isSaving ? 'در حال ذخیره...' : form.id ? 'ذخیره تغییرات' : 'افزودن دسته‌بندی'}
          </button>
        </div>
      </form>

      {isLoading ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          در حال آماده‌سازی فهرست دسته‌بندی‌ها...
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>نام</th>
                  <th>نامک</th>
                  <th>نمایش ویژه</th>
                  <th>توضیحات</th>
                  <th>اقدامات</th>
                </tr>
              </thead>
              <tbody>
                {sortedCategories.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-muted)' }}>
                      هنوز دسته‌بندی‌ای ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  sortedCategories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {category.image && (
                            <span className="table-avatar">
                              <img src={category.image} alt="" />
                            </span>
                          )}
                          <div style={{ display: 'grid', gap: '0.25rem' }}>
                            <strong>{category.name}</strong>
                            {category.description && (
                              <span style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>{category.description}</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{category.slug}</td>
                      <td>
                        <span
                          className="badge"
                          style={{
                            background: category.featured ? 'rgba(11, 140, 60, 0.12)' : 'rgba(15, 23, 42, 0.08)',
                            color: category.featured ? '#0b8c3c' : 'var(--color-accent)'
                          }}
                        >
                          {category.featured ? 'ویژه' : 'عادی'}
                        </span>
                      </td>
                      <td style={{ maxWidth: '280px' }}>
                        {category.description ? category.description : <span style={{ color: 'var(--color-muted)' }}>—</span>}
                      </td>
                      <td style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-ghost btn-small" onClick={() => toggleFeatured(category)}>
                          {category.featured ? 'حذف از ویژه' : 'نمایش ویژه'}
                        </button>
                        <button type="button" className="btn btn-ghost btn-small" onClick={() => handleEdit(category)}>
                          ویرایش
                        </button>
                        <button
                          type="button"
                          className="btn btn-small"
                          style={dangerButtonStyle}
                          onClick={() => handleDelete(category.id)}
                        >
                          حذف
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
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

const dangerButtonStyle: CSSProperties = {
  border: '1px solid rgba(225, 6, 0, 0.1)',
  background: 'rgba(225, 6, 0, 0.08)',
  color: '#ad0500'
};
