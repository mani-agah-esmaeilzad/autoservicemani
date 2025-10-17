import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { deleteProduct, listProducts, upsertProduct } from '@/lib/data';
import type { Product } from '@/lib/types';

export async function GET() {
  const products = await listProducts();
  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Product>;
  if (!payload.name || !payload.categoryId || !payload.brand || !payload.price) {
    return NextResponse.json({ error: 'اطلاعات محصول ناقص است' }, { status: 400 });
  }

  const fallbackImage = payload.image ?? '/images/products/placeholder.svg';

  const product: Product = {
    id: payload.id ?? `prd-${Date.now()}`,
    slug: payload.slug ?? payload.name.toLowerCase().replace(/\s+/g, '-'),
    name: payload.name,
    description: payload.description ?? '',
    price: Number(payload.price),
    brand: payload.brand,
    image: fallbackImage,
    categoryId: payload.categoryId,
    rating: payload.rating ?? 5,
    inStock: Number(payload.inStock ?? 0),
    tags: payload.tags ?? [],
    sku: payload.sku ?? `SKU-${Date.now()}`,
    longDescription: payload.longDescription ?? payload.description ?? '',
    highlights: payload.highlights ?? [],
    gallery:
      payload.gallery?.length
        ? payload.gallery
        : [{ src: fallbackImage, alt: payload.name }],
    specifications: payload.specifications ?? [],
    compatibility: payload.compatibility ?? [],
    warranty: payload.warranty ?? '',
    shipping: payload.shipping ?? '',
    maintenanceTips: payload.maintenanceTips ?? [],
    faqs: payload.faqs ?? [],
    questions: payload.questions ?? []
  };

  const stored = await upsertProduct(product);

  return NextResponse.json({ product: stored });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'شناسه محصول یافت نشد' }, { status: 400 });
  }

  try {
    await deleteProduct(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return NextResponse.json({ error: 'محصولی با این شناسه یافت نشد' }, { status: 404 });
    }
    console.error('Failed to delete product', error);
    return NextResponse.json({ error: 'حذف محصول انجام نشد' }, { status: 500 });
  }
}
