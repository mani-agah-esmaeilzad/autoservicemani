import { NextResponse } from 'next/server';
import { createOrder, listOrders } from '@/lib/data';
import type { Order } from '@/lib/types';

export async function GET() {
  return NextResponse.json({ orders: listOrders() });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Order> & { items?: Order['items'] };

  if (!payload.customerName || !payload.customerEmail || !payload.items || payload.items.length === 0) {
    return NextResponse.json({ error: 'اطلاعات سفارش ناقص است' }, { status: 400 });
  }

  const total = payload.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order: Order = {
    id: payload.id ?? `ord-${Date.now()}`,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    total,
    status: 'در انتظار',
    createdAt: new Date().toISOString(),
    items: payload.items
  };

  createOrder(order);

  return NextResponse.json({ order }, { status: 201 });
}
