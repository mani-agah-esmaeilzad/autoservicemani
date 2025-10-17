'use client';

import { FormEvent, useEffect, useId, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SearchBarProps {
  placeholder?: string;
  size?: 'default' | 'compact';
  className?: string;
}

export default function SearchBar({ placeholder = 'جستجو در محصولات، برندها و خدمات...', size = 'default', className }: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputId = useId();
  const [value, setValue] = useState(searchParams?.get('query') ?? '');

  useEffect(() => {
    setValue(searchParams?.get('query') ?? '');
  }, [searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length === 0) {
      router.push('/store');
      return;
    }
    router.push(`/store?query=${encodeURIComponent(trimmed)}`);
  };

  return (
    <form className={`search-bar search-bar--${size} ${className ?? ''}`.trim()} onSubmit={handleSubmit} role="search">
      <label className="search-bar__icon" htmlFor={inputId}>
        <span aria-hidden>🔍</span>
      </label>
      <input
        id={inputId}
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="search-bar__input"
        aria-label={placeholder}
      />
      <button type="submit" className="search-bar__submit">
        جستجو
      </button>
    </form>
  );
}
