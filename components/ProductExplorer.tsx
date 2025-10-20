'use client';

import { useMemo, useState } from 'react';
import type { Category, Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductExplorerProps {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
}

type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc';

export default function ProductExplorer({ products, categories, initialQuery = '' }: ProductExplorerProps) {
  const uniqueBrands = useMemo(() => Array.from(new Set(products.map((product) => product.brand))).sort(), [products]);
  const [query, setQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('recommended');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const resetFilters = () => {
    setQuery('');
    setSelectedCategory('all');
    setSelectedBrand('all');
    setSortKey('recommended');
  };

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return products
      .filter((product) => {
        if (normalizedQuery.length > 0) {
          const haystack = `${product.name} ${product.description} ${product.brand} ${product.tags.join(' ')}`.toLowerCase();
          if (!haystack.includes(normalizedQuery)) {
            return false;
          }
        }

        if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
          return false;
        }

        if (selectedBrand !== 'all' && product.brand !== selectedBrand) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (sortKey) {
          case 'price-asc':
            return a.price - b.price;
          case 'price-desc':
            return b.price - a.price;
          case 'rating-desc':
            return b.rating - a.rating;
          default:
            return b.rating * b.inStock - a.rating * a.inStock;
        }
      });
  }, [products, query, selectedCategory, selectedBrand, sortKey]);

  return (
    <div className="product-explorer product-explorer--reference">
      <aside className={`product-filters product-filters--reference ${filtersOpen ? 'product-filters--open' : ''}`}>
        <div className="product-filters__header">
          <h2>فیلتر هوشمند</h2>
          <button type="button" className="btn btn-ghost product-filters__close" onClick={() => setFiltersOpen(false)}>
            بستن
          </button>
        </div>

        <div className="product-filters__group">
          <label htmlFor="filter-query">جستجو</label>
          <input
            id="filter-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="نام محصول، برند یا کد فنی"
          />
        </div>

        <div className="product-filters__group">
          <label htmlFor="filter-category">دسته‌بندی</label>
          <select id="filter-category" value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)}>
            <option value="all">همه دسته‌ها</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div className="product-filters__group">
          <label htmlFor="filter-brand">برند</label>
          <select id="filter-brand" value={selectedBrand} onChange={(event) => setSelectedBrand(event.target.value)}>
            <option value="all">همه برندها</option>
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <div className="product-filters__group">
          <label htmlFor="filter-sort">ترتیب نمایش</label>
          <select id="filter-sort" value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
            <option value="recommended">پیشنهاد اتو سرویس مانی</option>
            <option value="price-asc">ارزان‌ترین</option>
            <option value="price-desc">گران‌ترین</option>
            <option value="rating-desc">بالاترین امتیاز</option>
          </select>
        </div>

        <button type="button" className="btn btn-ghost" onClick={resetFilters}>
          پاک کردن فیلترها
        </button>
      </aside>

      <section className="product-results product-results--reference">
        <div className="product-results__toolbar">
          <button type="button" className="product-results__filters-toggle" onClick={() => setFiltersOpen(true)}>
            فیلترها
          </button>
          <div className="product-results__info">
            <span>{filteredProducts.length} کالا</span>
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
              <option value="recommended">پیشنهاد اتو سرویس مانی</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating-desc">بالاترین امتیاز</option>
            </select>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="product-results__empty">
            <strong>محصولی با شرایط انتخابی پیدا نشد.</strong>
            <p>فیلترها را تغییر دهید تا نتایج بیشتری ببینید.</p>
          </div>
        ) : (
          <div className="product-results__grid product-results__grid--reference">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {filtersOpen && <div className="product-filters__backdrop" onClick={() => setFiltersOpen(false)} />}
    </div>
  );
}
