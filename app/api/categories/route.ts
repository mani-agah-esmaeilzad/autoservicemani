import { NextResponse } from 'next/server';
import { listCategories } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ categories: listCategories() });
}
