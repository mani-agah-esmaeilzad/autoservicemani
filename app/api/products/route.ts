import { NextResponse } from 'next/server';
import { listProducts, upsertProduct } from '@/lib/data';
import type { Product } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ products: listProducts() });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Product>;
  if (!payload.name || !payload.categoryId || !payload.brand || !payload.price) {
    return NextResponse.json({ error: 'اطلاعات محصول ناقص است' }, { status: 400 });
  }

  const product: Product = {
    id: payload.id ?? `prd-${Date.now()}`,
    slug: payload.slug ?? payload.name.toLowerCase().replace(/\s+/g, '-'),
    name: payload.name,
    description: payload.description ?? '',
    price: Number(payload.price),
    brand: payload.brand,
    image: payload.image ?? '/images/products/placeholder.svg',
    categoryId: payload.categoryId,
    rating: payload.rating ?? 5,
    inStock: Number(payload.inStock ?? 0),
    tags: payload.tags ?? []
  };

  upsertProduct(product);

  return NextResponse.json({ product });
}
