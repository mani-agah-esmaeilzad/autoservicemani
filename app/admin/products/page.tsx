'use client';

import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Category, Product, ProductSpecification } from '@/lib/types';
export const dynamic = "force-dynamic";

type ProductFormState = Partial<Product>;

function parseSpecifications(input: string): ProductSpecification[] {
  return input
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(':');
      return { label: label?.trim() ?? '', value: rest.join(':').trim() };
    })
    .filter((spec) => spec.label && spec.value);
}

function formatSpecifications(specs: ProductSpecification[] | undefined) {
  return specs?.map((spec) => `${spec.label}: ${spec.value}`).join('\n') ?? '';
}

export default function AdminProductsPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductFormState>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    const response = await fetch('/api/products', { cache: 'no-store' });
    const data = await response.json();
    setProducts(data.products ?? []);
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [categoryRes, productRes] = await Promise.all([
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/products', { cache: 'no-store' })
      ]);

      const categoryJson = await categoryRes.json();
      const productJson = await productRes.json();

      setCategories(categoryJson.categories ?? []);
      setProducts(productJson.products ?? []);
      setError(null);
    } catch (loadError) {
      console.error(loadError);
      setError('بارگیری اطلاعات با خطا مواجه شد. اتصال شبکه یا تنظیمات پایگاه‌داده را بررسی کنید.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData().catch((loadError) => {
      console.error(loadError);
      setError('بارگیری اطلاعات با خطا مواجه شد.');
      setIsLoading(false);
    });
  }, [loadData]);

  useEffect(() => {
    if (categories.length > 0 && !form.categoryId) {
      setForm((prev) => ({ ...prev, categoryId: prev.categoryId ?? categories[0].id }));
    }
  }, [categories, form.categoryId]);

  const resetForm = useCallback(() => {
    setForm({ categoryId: categories[0]?.id });
  }, [categories]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.categoryId || !form.price || !form.brand) {
      setError('برای ثبت محصول جدید، نام، دسته‌بندی، قیمت و برند الزامی است.');
      return;
    }

    setIsSaving(true);
    const existing = form.id ? products.find((item) => item.id === form.id) : undefined;
    const gallery =
      form.gallery && form.gallery.length > 0
        ? form.gallery
        : existing?.gallery ?? [{ src: form.image ?? '/images/products/placeholder.svg', alt: form.name }];

    const newProduct: Product = {
      id: form.id ?? `prd-${Date.now()}`,
      slug: form.slug ?? (form.name || '').toLowerCase().replace(/\s+/g, '-'),
      name: form.name,
      description: form.description ?? '',
      price: Number(form.price),
      brand: form.brand,
      image: form.image ?? '/images/products/placeholder.svg',
      categoryId: form.categoryId,
      rating: form.rating ?? existing?.rating ?? 5,
      inStock: Number(form.inStock ?? existing?.inStock ?? 10),
      tags: form.tags ?? existing?.tags ?? [],
      sku: form.sku ?? existing?.sku ?? `SKU-${Date.now()}`,
      longDescription: form.longDescription ?? form.description ?? existing?.longDescription ?? '',
      highlights: form.highlights ?? existing?.highlights ?? [],
      gallery,
      specifications: form.specifications ?? existing?.specifications ?? [],
      compatibility: form.compatibility ?? existing?.compatibility ?? [],
      warranty: form.warranty ?? existing?.warranty ?? 'گارانتی اصالت Auto Service Mani',
      shipping: form.shipping ?? existing?.shipping ?? 'ارسال استاندارد 2 تا 4 روز کاری',
      maintenanceTips: form.maintenanceTips ?? existing?.maintenanceTips ?? [],
      faqs: form.faqs ?? existing?.faqs ?? [],
      questions: form.questions ?? existing?.questions ?? []
    };

    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct)
      });

      if (!response.ok) {
        throw new Error(`FAILED_TO_SAVE_PRODUCT_${response.status}`);
      }

      await refreshProducts();
      resetForm();
      setError(null);
    } catch (saveError) {
      console.error(saveError);
      setError('ذخیره محصول با مشکل مواجه شد. لطفاً دوباره تلاش کنید.');
    } finally {
      setIsSaving(false);
    }
  };

  const startEdit = (product: Product) => {
    setForm({
      ...product,
      tags: product.tags.slice(),
      highlights: product.highlights.slice(),
      compatibility: product.compatibility.slice(),
      maintenanceTips: product.maintenanceTips.slice(),
      specifications: product.specifications.map((spec) => ({ ...spec })),
      gallery: product.gallery.map((item) => ({ ...item })),
      faqs: product.faqs.map((faq) => ({ ...faq })),
      questions: product.questions.map((question) => ({ ...question }))
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const removeProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/products?id=${productId}`, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error(`FAILED_TO_DELETE_PRODUCT_${response.status}`);
      }
      await refreshProducts();
      if (form.id === productId) {
        resetForm();
      }
    } catch (deleteError) {
      console.error(deleteError);
      setError('حذف محصول انجام نشد.');
    }
  };

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => (
        <option key={category.id} value={category.id}>
          {category.name}
        </option>
      )),
    [categories]
  );

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1>مدیریت محصولات</h1>
        <p style={{ color: 'var(--color-muted)' }}>افزودن، ویرایش و تکمیل اطلاعات محصولات فروشگاه</p>
      </header>

      {error ? (
        <div className="card" style={{ background: 'rgba(225, 6, 0, 0.08)', color: '#ad0500' }}>
          {error}
        </div>
      ) : null}

      {isLoading ? (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          در حال بارگذاری اطلاعات محصولات و دسته‌بندی‌ها...
        </div>
      ) : (
        <>
          <form className="card" style={{ display: 'grid', gap: '1rem' }} onSubmit={handleSubmit}>
            <h2>{form.id ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>
            <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
              <label style={labelStyle}>
                نام محصول
                <input
                  value={form.name ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                  style={inputStyle}
                  required
                />
              </label>
              <label style={labelStyle}>
                برند
                <input
                  value={form.brand ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, brand: event.target.value }))}
                  style={inputStyle}
                  required
                />
              </label>
              <label style={labelStyle}>
                کد SKU
                <input
                  value={form.sku ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, sku: event.target.value }))}
                  style={inputStyle}
                />
              </label>
              <label style={labelStyle}>
                قیمت
                <input
                  type="number"
                  value={form.price ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, price: Number(event.target.value) }))}
                  style={inputStyle}
                  required
                />
              </label>
              <label style={labelStyle}>
                موجودی
                <input
                  type="number"
                  value={form.inStock ?? ''}
                  onChange={(event) => setForm((prev) => ({ ...prev, inStock: Number(event.target.value) }))}
                  style={inputStyle}
                />
              </label>
            </div>
            <label style={labelStyle}>
              تصویر شاخص (URL)
              <input
                value={form.image ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, image: event.target.value }))}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              دسته‌بندی
              <select
                value={form.categoryId ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                style={inputStyle}
                required
              >
                {categoryOptions}
              </select>
            </label>
            <label style={labelStyle}>
              توضیحات کوتاه
              <textarea
                value={form.description ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>
            <label style={labelStyle}>
              توضیحات کامل
              <textarea
                value={form.longDescription ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, longDescription: event.target.value }))}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>
            <label style={labelStyle}>
              برچسب‌ها (با کاما جدا کنید)
              <input
                value={form.tags?.join(', ') ?? ''}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean)
                  }))
                }
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              ویژگی‌های شاخص (هر مورد در یک خط)
              <textarea
                value={form.highlights?.join('\n') ?? ''}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    highlights: event.target.value.split('\n').map((line) => line.trim()).filter(Boolean)
                  }))
                }
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>
            <label style={labelStyle}>
              مشخصات فنی (فرمت: عنوان: مقدار)
              <textarea
                value={formatSpecifications(form.specifications)}
                onChange={(event) => setForm((prev) => ({ ...prev, specifications: parseSpecifications(event.target.value) }))}
                rows={4}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>
            <label style={labelStyle}>
              سازگاری (هر مورد در یک خط)
              <textarea
                value={form.compatibility?.join('\n') ?? ''}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    compatibility: event.target.value.split('\n').map((line) => line.trim()).filter(Boolean)
                  }))
                }
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>
            <label style={labelStyle}>
              نکات نگهداری (هر مورد در یک خط)
              <textarea
                value={form.maintenanceTips?.join('\n') ?? ''}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    maintenanceTips: event.target.value.split('\n').map((line) => line.trim()).filter(Boolean)
                  }))
                }
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>
            <label style={labelStyle}>
              شرایط ارسال
              <input
                value={form.shipping ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, shipping: event.target.value }))}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              شرایط گارانتی
              <input
                value={form.warranty ?? ''}
                onChange={(event) => setForm((prev) => ({ ...prev, warranty: event.target.value }))}
                style={inputStyle}
              />
            </label>
            <label style={labelStyle}>
              گالری تصاویر (هر خط: آدرس یا آدرس|توضیح)
              <textarea
                value={form.gallery?.map((item) => `${item.src}${item.alt ? ` | ${item.alt}` : ''}`).join('\n') ?? ''}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    gallery: event.target.value
                      .split('\n')
                      .map((line) => line.trim())
                      .filter(Boolean)
                      .map((line) => {
                        const [src, alt] = line.split('|').map((part) => part.trim());
                        return { src, alt: alt || form.name || 'تصویر محصول' };
                      })
                  }))
                }
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </label>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              {form.id ? (
                <button type="button" className="btn" style={outlineButtonStyle} onClick={resetForm}>
                  انصراف از ویرایش
                </button>
              ) : null}
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'در حال ذخیره...' : 'ذخیره محصول'}
              </button>
            </div>
          </form>

          <div className="card" style={{ overflowX: 'auto' }}>
            <table className="table">
              <thead>
                <tr>
                  <th>نام</th>
                  <th>برند</th>
                  <th>دسته‌بندی</th>
                  <th>قیمت</th>
                  <th>موجودی</th>
                  <th>امتیاز</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ textAlign: 'center', padding: '1.5rem' }}>
                      هنوز محصولی ثبت نشده است.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.name}</td>
                      <td>{product.brand}</td>
                      <td>{categories.find((category) => category.id === product.categoryId)?.name ?? '—'}</td>
                      <td>{product.price.toLocaleString('fa-IR')} تومان</td>
                      <td>{product.inStock}</td>
                      <td>
                        <span className="badge" style={{ background: 'rgba(48, 209, 88, 0.12)', color: '#0b8c3c' }}>
                          {product.rating.toFixed(1)}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '0.5rem' }}>
                        <button type="button" className="btn" style={outlineButtonStyle} onClick={() => startEdit(product)}>
                          ویرایش
                        </button>
                        <button
                          type="button"
                          className="btn"
                          style={dangerButtonStyle}
                          onClick={() => removeProduct(product.id)}
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
        </>
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

const outlineButtonStyle: CSSProperties = {
  border: '1px solid var(--color-primary)',
  color: 'var(--color-primary)',
  background: 'transparent'
};

const dangerButtonStyle: CSSProperties = {
  border: '1px solid rgba(225,6,0,0.1)',
  color: '#fff',
  background: 'var(--color-primary)'
};
