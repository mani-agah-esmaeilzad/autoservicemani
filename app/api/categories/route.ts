import { Prisma } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { deleteCategory, listCategories, upsertCategory } from '@/lib/data';
import type { CategoryInput } from '@/lib/types';

function mapCategoryError(error: unknown): NextResponse {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'این نامک از قبل ثبت شده است. لطفاً نامک دیگری انتخاب کنید.' },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: 'خطای پایگاه داده هنگام ذخیره دسته‌بندی رخ داد.' },
      { status: 500 }
    );
  }

  if (error instanceof Error) {
    if (error.message === 'CATEGORY_NAME_REQUIRED') {
      return NextResponse.json(
        { error: 'ثبت دسته‌بندی بدون عنوان امکان‌پذیر نیست.' },
        { status: 400 }
      );
    }
    if (error.message === 'CATEGORY_SLUG_EXISTS') {
      return NextResponse.json(
        { error: 'این نامک از قبل در حال استفاده است.' },
        { status: 409 }
      );
    }
    if (error.message === 'PRISMA_UNAVAILABLE') {
      return NextResponse.json(
        { error: 'اتصال به پایگاه داده برقرار نشد. لطفاً تنظیمات دیتابیس را بررسی کنید.' },
        { status: 503 }
      );
    }
  }

  return NextResponse.json(
    { error: 'ذخیره دسته‌بندی با خطا روبه‌رو شد. لطفاً بعداً دوباره تلاش کنید.' },
    { status: 500 }
  );
}

async function handleUpsertRequest(payload: CategoryInput) {
  try {
    const category = await upsertCategory(payload);
    return NextResponse.json({ category });
  } catch (error) {
    return mapCategoryError(error);
  }
}

export async function GET() {
  const categories = await listCategories();
  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const payload = (await request.json()) as CategoryInput;
  return handleUpsertRequest(payload);
}

export async function PATCH(request: NextRequest) {
  const payload = (await request.json()) as CategoryInput;
  if (!payload.id) {
    return NextResponse.json(
      { error: 'شناسه دسته‌بندی برای به‌روزرسانی الزامی است.' },
      { status: 400 }
    );
  }

  return handleUpsertRequest(payload);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'حذف دسته‌بندی بدون شناسه امکان‌پذیر نیست.' },
      { status: 400 }
    );
  }

  await deleteCategory(id);
  return NextResponse.json({ success: true });
}
