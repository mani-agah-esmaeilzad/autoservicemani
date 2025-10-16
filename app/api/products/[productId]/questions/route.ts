import { NextRequest, NextResponse } from 'next/server';
import {
  addProductQuestion,
  findProductBySlug,
  listProductQuestions
} from '@/lib/data';

interface RouteContext {
  params: { productId: string };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const questions = listProductQuestions(params.productId);
  return NextResponse.json({ questions });
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const body = await request.json();
  const author = typeof body.author === 'string' ? body.author.trim() : '';
  const question = typeof body.question === 'string' ? body.question.trim() : '';

  if (!author || !question) {
    return NextResponse.json({ error: 'نام و متن سوال الزامی است.' }, { status: 400 });
  }

  const product = findProductBySlug(params.productId);
  if (!product) {
    return NextResponse.json({ error: 'محصول یافت نشد.' }, { status: 404 });
  }

  const entry = addProductQuestion(product.slug, question, author);
  if (!entry) {
    return NextResponse.json({ error: 'ثبت سوال انجام نشد.' }, { status: 500 });
  }

  return NextResponse.json({ question: entry });
}
