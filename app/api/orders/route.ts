import { NextResponse } from "next/server";
import type { Order } from "@/lib/types";

export async function GET() {
  try {
    const { listOrders } = await import("@/lib/data");
    const orders = await listOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Error in GET /api/orders:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Partial<Order> & {
    items?: Order["items"];
  };

  if (
    !payload.customerName ||
    !payload.customerEmail ||
    !payload.items ||
    payload.items.length === 0
  ) {
    return NextResponse.json(
      { error: "اطلاعات سفارش ناقص است" },
      { status: 400 }
    );
  }

  const total = payload.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order: Order = {
    id: payload.id ?? `ord-${Date.now()}`,
    customerName: payload.customerName,
    customerEmail: payload.customerEmail,
    total,
    status: "در انتظار",
    createdAt: new Date().toISOString(),
    items: payload.items,
  };

  try {
    const { createOrder } = await import("@/lib/data");
    const stored = await createOrder(order);
    return NextResponse.json({ order: stored }, { status: 201 });
  } catch (error) {
    console.error("Failed to create order", error);
    return NextResponse.json(
      { error: "ثبت سفارش انجام نشد" },
      { status: 500 }
    );
  }
}
