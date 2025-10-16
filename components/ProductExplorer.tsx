'use client';

import { useMemo, useState } from 'react';
import type { Category, Product } from '@/lib/types';
import ProductCard from './ProductCard';

interface ProductExplorerProps {
  products: Product[];
  categories: Category[];
  initialQuery?: string;
}

type AvailabilityFilter = 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';

type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'rating-desc' | 'stock-desc';

export default function ProductExplorer({ products, categories, initialQuery = '' }: ProductExplorerProps) {
  const uniqueBrands = useMemo(() => Array.from(new Set(products.map((product) => product.brand))).sort(), [products]);
  const priceValues = useMemo(() => products.map((product) => product.price), [products]);
  const minPrice = priceValues.length > 0 ? Math.min(...priceValues) : 0;
  const maxPrice = priceValues.length > 0 ? Math.max(...priceValues) : 0;

  const [query, setQuery] = useState(initialQuery);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [availability, setAvailability] = useState<AvailabilityFilter>('all');
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
  const [sortKey, setSortKey] = useState<SortKey>('recommended');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const toggleSelection = (value: string, list: string[], setter: (values: string[]) => void) => {
    setter(list.includes(value) ? list.filter((item) => item !== value) : [...list, value]);
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setAvailability('all');
    setMinRating(0);
    setPriceRange([minPrice, maxPrice]);
    setSortKey('recommended');
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        if (query.trim().length > 0) {
          const searchText = `${product.name} ${product.description} ${product.brand} ${product.tags.join(' ')}`.toLowerCase();
          if (!searchText.includes(query.trim().toLowerCase())) {
            return false;
          }
        }
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.categoryId)) {
          return false;
        }
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
          return false;
        }
        if (minRating > 0 && product.rating < minRating) {
          return false;
        }
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
          return false;
        }
        if (availability === 'in-stock' && product.inStock <= 0) {
          return false;
        }
        if (availability === 'low-stock' && (product.inStock > 5 || product.inStock === 0)) {
          return false;
        }
        if (availability === 'out-of-stock' && product.inStock > 0) {
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
          case 'stock-desc':
            return b.inStock - a.inStock;
          default:
            return b.rating * b.inStock - a.rating * a.inStock;
        }
      });
  }, [availability, minRating, priceRange, products, query, selectedBrands, selectedCategories, sortKey]);

  return (
    <div className="product-explorer">
      <aside className={`product-filters ${filtersOpen ? 'product-filters--open' : ''}`}>
        <div className="product-filters__header">
          <h2>فیلترهای پیشرفته</h2>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button type="button" onClick={resetFilters} className="btn btn-ghost">
              بازنشانی
            </button>
            <button type="button" className="btn btn-ghost product-filters__close" onClick={() => setFiltersOpen(false)}>
              بستن
            </button>
          </div>
        </div>
        <div className="product-filters__group">
          <label htmlFor="filter-query">جستجوی سریع</label>
          <input
            id="filter-query"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="نام محصول، برند یا مشخصات..."
          />
        </div>
        <div className="product-filters__group">
          <span className="product-filters__title">دسته‌بندی محصولات</span>
          <div className="product-filters__options">
            {categories.map((category) => (
              <label key={category.id} className="product-filters__option">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => toggleSelection(category.id, selectedCategories, setSelectedCategories)}
                />
                <span>{category.name}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="product-filters__group">
          <span className="product-filters__title">برند</span>
          <div className="product-filters__options">
            {uniqueBrands.map((brand) => (
              <label key={brand} className="product-filters__option">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleSelection(brand, selectedBrands, setSelectedBrands)}
                />
                <span>{brand}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="product-filters__group">
          <span className="product-filters__title">بازه قیمت (تومان)</span>
          <div className="product-filters__range">
            <input
              type="number"
              min={minPrice}
              max={priceRange[1]}
              value={priceRange[0]}
              onChange={(event) => setPriceRange([Number(event.target.value), priceRange[1]])}
            />
            <input
              type="number"
              min={priceRange[0]}
              max={maxPrice}
              value={priceRange[1]}
              onChange={(event) => setPriceRange([priceRange[0], Number(event.target.value)])}
            />
          </div>
        </div>
        <div className="product-filters__group">
          <span className="product-filters__title">موجودی</span>
          <div className="product-filters__options product-filters__options--vertical">
            <label className="product-filters__option">
              <input
                type="radio"
                name="availability"
                value="all"
                checked={availability === 'all'}
                onChange={() => setAvailability('all')}
              />
              <span>همه کالاها</span>
            </label>
            <label className="product-filters__option">
              <input
                type="radio"
                name="availability"
                value="in-stock"
                checked={availability === 'in-stock'}
                onChange={() => setAvailability('in-stock')}
              />
              <span>فقط موجود</span>
            </label>
            <label className="product-filters__option">
              <input
                type="radio"
                name="availability"
                value="low-stock"
                checked={availability === 'low-stock'}
                onChange={() => setAvailability('low-stock')}
              />
              <span>رو به اتمام (&lt; 6 عدد)</span>
            </label>
            <label className="product-filters__option">
              <input
                type="radio"
                name="availability"
                value="out-of-stock"
                checked={availability === 'out-of-stock'}
                onChange={() => setAvailability('out-of-stock')}
              />
              <span>ناموجود</span>
            </label>
          </div>
        </div>
        <div className="product-filters__group">
          <label htmlFor="filter-rating" className="product-filters__title">
            حداقل امتیاز کاربران
          </label>
          <select id="filter-rating" value={minRating} onChange={(event) => setMinRating(Number(event.target.value))}>
            <option value={0}>بدون محدودیت</option>
            <option value={3}>3 ستاره و بالاتر</option>
            <option value={4}>4 ستاره و بالاتر</option>
            <option value={4.5}>4.5 ستاره و بالاتر</option>
          </select>
        </div>
      </aside>
      <div className="product-results">
        <div className="product-results__toolbar">
          <button type="button" className="product-results__filters-toggle" onClick={() => setFiltersOpen((prev) => !prev)}>
            فیلترها
          </button>
          <div className="product-results__info">
            <span>{filteredProducts.length} کالا</span>
            <select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
              <option value="recommended">پیشنهاد اتو سرویس مانی</option>
              <option value="price-asc">ارزان‌ترین</option>
              <option value="price-desc">گران‌ترین</option>
              <option value="rating-desc">بالاترین امتیاز</option>
              <option value="stock-desc">بیشترین موجودی</option>
            </select>
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <div className="product-results__empty">
            <strong>محصولی با فیلترهای انتخابی یافت نشد.</strong>
            <p>فیلترها را تغییر دهید یا دسته‌بندی دیگری را امتحان کنید.</p>
          </div>
        ) : (
          <div className="product-results__grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      {filtersOpen && <div className="product-filters__backdrop" onClick={() => setFiltersOpen(false)} />}
    </div>
  );
}
