import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { listAiSessions } = await import("@/lib/data");
    const sessions = await listAiSessions();
    return NextResponse.json({ sessions });
  } catch (error) {
    console.error("Error in GET /api/ai-assistant/session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { createAiSession } = await import("@/lib/data");

    let topic = "";
    try {
      const body = await request.json();
      if (typeof body?.topic === "string") {
        topic = body.topic;
      }
    } catch (error) {
      topic = "";
    }

    const session = await createAiSession(topic);
    return NextResponse.json({ session });
  } catch (error) {
    console.error("Error in POST /api/ai-assistant/session:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
