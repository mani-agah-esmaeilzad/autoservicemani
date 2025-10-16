import { NextResponse } from 'next/server';
import { appendAiMessage, getAiSession, updateAiSession } from '@/lib/data';
import type { ChatMessage } from '@/lib/types';

export async function POST(request: Request) {
  const body = await request.json();
  const sessionId = String(body.sessionId ?? '').trim();
  const prompt = String(body.message ?? '').trim();

  if (!sessionId) {
    return NextResponse.json({ error: 'SESSION_ID_REQUIRED' }, { status: 400 });
  }

  if (!prompt) {
    return NextResponse.json({ error: 'MESSAGE_REQUIRED' }, { status: 400 });
  }

  const sessionExists = getAiSession(sessionId);
  if (!sessionExists) {
    return NextResponse.json({ error: 'SESSION_NOT_FOUND' }, { status: 404 });
  }

  const now = new Date();
  const userMessage: ChatMessage = {
    id: `msg-${now.getTime()}-user`,
    role: 'user',
    content: prompt,
    createdAt: now.toISOString()
  };

  const sessionWithUser = appendAiMessage(sessionId, userMessage);
  if (!sessionWithUser) {
    return NextResponse.json({ error: 'FAILED_TO_APPEND_MESSAGE' }, { status: 500 });
  }

  let assistantReply = '';
  const apiKey = process.env.ASM_ASSISTANT_API_KEY;
  const endpoint = process.env.ASM_ASSISTANT_API_ENDPOINT;

  if (!apiKey || !endpoint) {
    assistantReply =
      'برای دریافت پاسخ‌های زنده از دستیار هوشمند لازم است متغیرهای ASM_ASSISTANT_API_KEY و ASM_ASSISTANT_API_ENDPOINT تنظیم شوند. در حالت نمایشی فعلی، این پاسخ به صورت داخلی تولید شده است: برای انتخاب روغن مناسب، دفترچه خودرو، شرایط آب و هوا و نحوه کارکرد موتور را در نظر بگیرید و از ویسکوزیته پیشنهادی سازنده خارج نشوید.';
  } else {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          sessionId,
          messages: sessionWithUser.messages.map((message) => ({
            role: message.role,
            content: message.content
          }))
        })
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload?.error ?? 'assistant_response_error');
      }

      const payload = (await response.json()) as { reply?: string };
      assistantReply = payload?.reply?.trim() ?? '';
    } catch (error) {
      console.error('Intelligent assistant request failed', error);
      assistantReply =
        'در حال حاضر اتصال به دستیار هوشمند Auto Service Mani با مشکل مواجه شده است. لطفاً بعداً مجدداً تلاش کنید یا از طریق پشتیبانی انسانی سوال خود را مطرح نمایید.';
    }
  }

  if (!assistantReply) {
    assistantReply =
      'پاسخی از سرویس دریافت نشد. لطفاً سوال خود را با جزئیات بیشتری مطرح کنید تا بتوانم بهتر راهنمایی کنم.';
  }

  const assistantMessage: ChatMessage = {
    id: `msg-${Date.now()}-assistant`,
    role: 'assistant',
    content: assistantReply,
    createdAt: new Date().toISOString()
  };

  const sessionWithAssistant = appendAiMessage(sessionId, assistantMessage);
  if (!sessionWithAssistant) {
    return NextResponse.json({ error: 'FAILED_TO_APPEND_MESSAGE' }, { status: 500 });
  }

  const recalculatedSatisfaction = Math.min(
    100,
    Math.round(((sessionWithAssistant.satisfaction || 90) + 95) / 2)
  );
  const latestSession = updateAiSession(sessionId, { satisfaction: recalculatedSatisfaction });

  return NextResponse.json({
    session: latestSession ?? sessionWithAssistant,
    reply: assistantMessage
  });
}
