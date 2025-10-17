import { NextRequest, NextResponse } from "next/server";

interface RouteContext {
  params: { productId: string };
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { listProductQuestions } = await import("@/lib/data");
    const questions = await listProductQuestions(params.productId);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error("Error in GET /api/products/[id]/questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const { addProductQuestion, findProductBySlug } = await import("@/lib/data");
    const body = await request.json();
    const author = typeof body.author === "string" ? body.author.trim() : "";
    const question = typeof body.question === "string" ? body.question.trim() : "";

    if (!author || !question) {
      return NextResponse.json({ error: "نام و متن سوال الزامی است." }, { status: 400 });
    }

    const product = await findProductBySlug(params.productId);
    if (!product) {
      return NextResponse.json({ error: "محصول یافت نشد." }, { status: 404 });
    }

    const entry = await addProductQuestion(product.id, question, author);
    if (!entry) {
      return NextResponse.json({ error: "ثبت سوال انجام نشد." }, { status: 500 });
    }

    return NextResponse.json({ question: entry });
  } catch (error) {
    console.error("Error in POST /api/products/[id]/questions:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
