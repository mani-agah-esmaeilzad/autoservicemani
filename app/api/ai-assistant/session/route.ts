import { NextResponse } from 'next/server';
import { createAiSession, listAiSessions } from '@/lib/data';

export async function GET() {
  return NextResponse.json({ sessions: listAiSessions() });
}

export async function POST(request: Request) {
  let topic = '';
  try {
    const body = await request.json();
    if (typeof body?.topic === 'string') {
      topic = body.topic;
    }
  } catch (error) {
    topic = '';
  }

  const session = createAiSession(topic);
  return NextResponse.json({ session });
}
