import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { appendAiMessage, getAiSession, updateAiSession } from '@/lib/data';
import type { ChatMessage } from '@/lib/types';

const MODEL_NAME = 'gemini-2.0-flash';

function buildGenerativeHistory(messages: ChatMessage[]) {
  return messages.map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }]
  }));
}

async function requestAssistantReply(messages: ChatMessage[]) {
  const apiKey = process.env.ASM_ASSISTANT_API_KEY;

  if (!apiKey) {
    return {
      reply:
        'برای دریافت پاسخ‌های زنده از دستیار هوشمند اتو سرویس مانی لازم است متغیر ASM_ASSISTANT_API_KEY در محیط سرور تنظیم شود. در حالت نمایشی فعلی، این پاسخ به صورت داخلی تولید شده است: برای انتخاب روغن مناسب، دفترچه خودرو، شرایط آب و هوا و نحوه عملکرد موتور را در نظر بگیرید و از ویسکوزیته پیشنهادی سازنده خارج نشوید.',
      fallback: true
    } as const;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      systemInstruction:
        'شما دستیار هوشمند اتو سرویس مانی هستید. همیشه به فارسی پاسخ دهید، روی راهکارهای فنی خودرو تمرکز کنید، و در صورت نیاز مشتری را به سرویس‌های حضوری یا کارشناسان انسانی ارجاع دهید. از ارائه مشاوره‌های خطرناک خودداری کنید و اگر اطلاعات کافی در اختیار ندارید صادقانه اعلام نمایید.'
    });

    const result = await model.generateContent({
      contents: buildGenerativeHistory(messages)
    });

    const text = result.response?.text()?.trim();

    if (!text) {
      return { reply: '', fallback: false } as const;
    }

    return { reply: text, fallback: false } as const;
  } catch (error) {
    console.error('Intelligent assistant request failed', error);
    return {
      reply:
        'در حال حاضر اتصال به دستیار هوشمند اتو سرویس مانی با مشکل مواجه شده است. لطفاً بعداً مجدداً تلاش کنید یا از طریق پشتیبانی انسانی سوال خود را مطرح نمایید.',
      fallback: true
    } as const;
  }
}

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

  const sessionExists = await getAiSession(sessionId);
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

  const sessionWithUser = await appendAiMessage(sessionId, userMessage);
  if (!sessionWithUser) {
    return NextResponse.json({ error: 'FAILED_TO_APPEND_MESSAGE' }, { status: 500 });
  }

  const { reply } = await requestAssistantReply(sessionWithUser.messages);
  let assistantReply = reply;

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

  const sessionWithAssistant = await appendAiMessage(sessionId, assistantMessage);
  if (!sessionWithAssistant) {
    return NextResponse.json({ error: 'FAILED_TO_APPEND_MESSAGE' }, { status: 500 });
  }

  const recalculatedSatisfaction = Math.min(
    100,
    Math.round(((sessionWithAssistant.satisfaction || 90) + 95) / 2)
  );
  const latestSession = await updateAiSession(sessionId, { satisfaction: recalculatedSatisfaction });

  return NextResponse.json({
    session: latestSession ?? sessionWithAssistant,
    reply: assistantMessage
  });
}
