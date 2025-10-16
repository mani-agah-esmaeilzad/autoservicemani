'use client';

import { FormEvent, useState } from 'react';
import type { CSSProperties } from 'react';
import { listCategories, listProducts, upsertProduct, deleteProduct } from '@/lib/data';
import type { Product } from '@/lib/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(() => listProducts());
  const categories = listCategories();
  const [form, setForm] = useState<Partial<Product>>({ categoryId: categories[0]?.id });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.categoryId || !form.price || !form.brand) return;

    setIsSaving(true);
    const newProduct: Product = {
      id: form.id ?? `prd-${Date.now()}`,
      slug: form.slug ?? (form.name || '').toLowerCase().replace(/\s+/g, '-'),
      name: form.name,
      description: form.description ?? '',
      price: Number(form.price),
      brand: form.brand,
      image: form.image ?? '/images/products/placeholder.svg',
      categoryId: form.categoryId,
      rating: form.rating ?? 5,
      inStock: Number(form.inStock ?? 10),
      tags: form.tags ?? []
    };

    upsertProduct(newProduct);
    setProducts(listProducts());
    setForm({ categoryId: categories[0]?.id });
    setIsSaving(false);
  };

  const startEdit = (product: Product) => {
    setForm({ ...product, tags: product.tags.slice() });
  };

  const removeProduct = (productId: string) => {
    deleteProduct(productId);
    setProducts(listProducts());
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      <header>
        <h1>مدیریت محصولات</h1>
        <p style={{ color: 'var(--color-muted)' }}>افزودن، ویرایش و حذف محصولات فروشگاه</p>
      </header>

      <form className="card" style={{ display: 'grid', gap: '1rem' }} onSubmit={handleSubmit}>
        <h2>{form.id ? 'ویرایش محصول' : 'افزودن محصول جدید'}</h2>
        <div style={{ display: 'grid', gap: '0.5rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
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
          دسته‌بندی
          <select
            value={form.categoryId ?? ''}
            onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
            style={inputStyle}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label style={labelStyle}>
          توضیحات محصول
          <textarea
            value={form.description ?? ''}
            onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </label>
        <label style={labelStyle}>
          برچسب‌ها (با کاما جدا کنید)
          <input
            value={form.tags?.join(', ') ?? ''}
            onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value.split(',').map((tag) => tag.trim()).filter(Boolean) }))}
            style={inputStyle}
          />
        </label>
        <button type="submit" className="btn btn-primary" disabled={isSaving}>
          {isSaving ? 'در حال ذخیره...' : 'ذخیره محصول'}
        </button>
      </form>

      <div className="card" style={{ overflowX: 'auto' }}>
        <table className="table">
          <thead>
            <tr>
              <th>نام</th>
              <th>برند</th>
              <th>قیمت</th>
              <th>موجودی</th>
              <th>دسته‌بندی</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>{product.brand}</td>
                <td>{product.price.toLocaleString('fa-IR')} تومان</td>
                <td>{product.inStock}</td>
                <td>{categories.find((category) => category.id === product.categoryId)?.name ?? '-'}</td>
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
            ))}
          </tbody>
        </table>
      </div>
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
