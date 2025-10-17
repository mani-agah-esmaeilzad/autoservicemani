import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { listCategories } = await import("@/lib/data");
    const categories = await listCategories();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Error in /api/categories:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
