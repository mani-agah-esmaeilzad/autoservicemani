import { NextResponse } from 'next/server';
import { appendAiMessage, getAiSession, updateAiSession } from '@/lib/data';
import type { ChatMessage } from '@/lib/types';

const GOOGLE_AI_ENDPOINT =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

function mapMessagesToGoogleFormat(messages: ChatMessage[]) {
  return messages.slice(-12).map((message) => ({
    role: message.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: message.content }]
  }));
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
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    assistantReply =
      'برای دریافت پاسخ‌های زنده از Google AI لازم است متغیر GOOGLE_AI_API_KEY در سرور تنظیم شود. در حالت نمایشی فعلی، این پاسخ به صورت داخلی تولید شده است: برای انتخاب روغن مناسب، دفترچه خودرو، شرایط آب و هوا و نحوه کارکرد موتور را در نظر بگیرید و از ویسکوزیته پیشنهادی سازنده خارج نشوید.';
  } else {
    try {
      const history = mapMessagesToGoogleFormat(sessionWithUser.messages);
      const response = await fetch(`${GOOGLE_AI_ENDPOINT}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: history,
          systemInstruction: {
            role: 'system',
            parts: [
              {
                text:
                  'You are an automotive technical expert for Auto Service Mani in Tehran. Answer in Persian (fa-IR) with clear, step-by-step guidance about vehicle maintenance, engine oils, diagnostics, and service recommendations. Do not discuss unrelated topics.'
              }
            ]
          },
          generationConfig: {
            temperature: 0.35,
            topP: 0.7,
            topK: 32,
            maxOutputTokens: 512
          },
          safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_DANGEROUS', threshold: 'BLOCK_MEDIUM_AND_ABOVE' }
          ]
        })
      });

      const payload = await response.json();
      if (!response.ok) {
        throw new Error(payload?.error?.message ?? 'Google AI response error');
      }

      const candidate = payload?.candidates?.[0];
      assistantReply = candidate?.content?.parts
        ?.map((part: { text?: string }) => part.text?.trim())
        .filter(Boolean)
        .join('\n')
        ?.trim();
    } catch (error) {
      console.error('Google AI request failed', error);
      assistantReply =
        'در حال حاضر اتصال به سرویس Google AI با مشکل مواجه شده است. لطفاً بعداً مجدداً تلاش کنید یا از طریق پشتیبانی انسانی سوال خود را مطرح نمایید.';
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
