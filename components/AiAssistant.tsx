'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { ChatMessage, ChatSession } from '@/lib/types';

interface AiAssistantProps {
  initialSessions: ChatSession[];
}

interface ApiResponse {
  session: ChatSession;
  reply?: ChatMessage;
  error?: string;
}

const quickPrompts = [
  'چه روغنی برای 206 تیپ 5 در تابستان پیشنهاد می‌کنید؟',
  'چرا بعد از تعویض روغن چراغ چک روشن می‌ماند؟',
  'بهترین بازه زمانی تعویض فیلتر هوا برای رانندگی شهری چقدر است؟'
];

export default function AiAssistant({ initialSessions }: AiAssistantProps) {
  const [sessions, setSessions] = useState<ChatSession[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(
    initialSessions[0]?.id ?? null
  );
  const [composerValue, setComposerValue] = useState('');
  const [newSessionTopic, setNewSessionTopic] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceReplyEnabled, setVoiceReplyEnabled] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const [recordingSupported, setRecordingSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setSpeechSupported('speechSynthesis' in window);

    const SpeechRecognitionConstructor =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = 'fa-IR';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript ?? '')
          .join(' ');
        setComposerValue(transcript);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognition.onerror = () => {
        setIsRecording(false);
      };
      recognitionRef.current = recognition;
      setRecordingSupported(true);
      return () => {
        recognition.stop();
      };
    }

    setRecordingSupported(false);
  }, []);

  const activeSession = useMemo(
    () => sessions.find((session) => session.id === activeSessionId) ?? null,
    [sessions, activeSessionId]
  );

  const handleCreateSession = useCallback(async () => {
    setError(null);
    const topic = newSessionTopic.trim();
    try {
      const response = await fetch('/api/ai-assistant/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ topic })
      });

      if (!response.ok) {
        throw new Error('SESSION_CREATE_FAILED');
      }

      const data = (await response.json()) as { session: ChatSession };
      setSessions((prev) => [data.session, ...prev.filter((item) => item.id !== data.session.id)]);
      setActiveSessionId(data.session.id);
      setNewSessionTopic('');
    } catch (creationError) {
      console.error(creationError);
      setError('ایجاد گفت‌وگوی جدید با خطا مواجه شد. دوباره تلاش کنید.');
    }
  }, [newSessionTopic]);

  const speak = useCallback(
    (text: string) => {
      if (!speechSupported || !voiceReplyEnabled || typeof window === 'undefined') {
        return;
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fa-IR';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [speechSupported, voiceReplyEnabled]
  );

  const handleSend = useCallback(async () => {
    if (!activeSessionId) {
      setError('ابتدا یک گفت‌وگو بسازید یا یکی از گفتگوهای قبلی را انتخاب کنید.');
      return;
    }

    const message = composerValue.trim();
    if (!message) {
      setError('برای ارسال پیام، ابتدا سوال یا مشکل فنی خود را بنویسید.');
      return;
    }

    setError(null);
    setIsLoading(true);

    const optimisticId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      id: optimisticId,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString()
    };

    setSessions((prev) =>
      prev.map((session) =>
        session.id === activeSessionId
          ? { ...session, messages: [...session.messages, optimisticMessage] }
          : session
      )
    );
    setComposerValue('');

    try {
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sessionId: activeSessionId, message })
      });

      if (!response.ok) {
        throw new Error('REQUEST_FAILED');
      }

      const data = (await response.json()) as ApiResponse;
      if (data.error) {
        throw new Error(data.error);
      }

      setSessions((prev) => {
        const withoutCurrent = prev.filter((session) => session.id !== data.session.id);
        return [data.session, ...withoutCurrent];
      });

      if (data.reply?.content) {
        speak(data.reply.content);
      }
    } catch (requestError) {
      console.error(requestError);
      setError('ارسال پیام با مشکل مواجه شد. اتصال اینترنت یا تنظیمات کلید Google AI را بررسی کنید.');
      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? {
                ...session,
                messages: session.messages.filter((messageItem) => messageItem.id !== optimisticId)
              }
            : session
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId, composerValue, speak]);

  const handleComposerSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (!isLoading) {
        void handleSend();
      }
    },
    [handleSend, isLoading]
  );

  const toggleRecording = useCallback(() => {
    if (!recordingSupported || !recognitionRef.current) {
      setError('مرورگر شما از ورودی صوتی Google Web Speech پشتیبانی نمی‌کند.');
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      return;
    }

    setError(null);
    setIsRecording(true);
    recognitionRef.current.start();
  }, [isRecording, recordingSupported]);

  return (
    <div className="ai-assistant">
      <header className="ai-assistant__header">
        <div>
          <span className="badge">دستیار فنی هوشمند</span>
          <h1>چت تخصصی با Google AI</h1>
          <p>
            هر سوالی درباره نگهداری خودرو، انتخاب روغن یا عیب‌یابی فنی دارید بپرسید تا پاسخ دقیق و مرحله‌به‌مرحله دریافت کنید.
          </p>
        </div>
        <div className="ai-assistant__toggles">
          <label className={`toggle ${speechSupported ? '' : 'toggle--disabled'}`}>
            <input
              type="checkbox"
              disabled={!speechSupported}
              checked={voiceReplyEnabled && speechSupported}
              onChange={(event) => setVoiceReplyEnabled(event.target.checked)}
            />
            پاسخ صوتی Google
          </label>
          <button
            type="button"
            className={`btn btn-ghost ai-assistant__record ${isRecording ? 'is-active' : ''}`}
            onClick={toggleRecording}
            disabled={!recordingSupported}
          >
            {isRecording ? 'در حال گوش دادن...' : 'افزودن سوال با صدا'}
          </button>
        </div>
      </header>

      <div className="ai-assistant__layout">
        <aside className="ai-assistant__sidebar">
          <div className="card ai-assistant__new-session">
            <h2>شروع گفت‌وگوی جدید</h2>
            <p>موضوع گفتگو را مشخص کنید تا تاریخچه‌های مختلف را بهتر مدیریت کنید.</p>
            <div className="ai-assistant__new-session-form">
              <input
                type="text"
                value={newSessionTopic}
                placeholder="مثلاً: سرویس دوره‌ای رنو کپچر"
                onChange={(event) => {
                  setNewSessionTopic(event.target.value);
                  if (error) {
                    setError(null);
                  }
                }}
              />
              <button type="button" className="btn btn-primary" onClick={() => void handleCreateSession()}>
                ایجاد گفتگو
              </button>
            </div>
          </div>

          <div className="card ai-assistant__sessions">
            <h2>گفتگوهای اخیر</h2>
            {sessions.length > 0 ? (
              <ul>
                {sessions.map((session) => (
                  <li key={session.id}>
                    <button
                      type="button"
                      className={`ai-assistant__session ${activeSessionId === session.id ? 'is-active' : ''}`}
                      onClick={() => setActiveSessionId(session.id)}
                    >
                      <span>{session.topic}</span>
                      <small>
                        آخرین فعالیت:{' '}
                        {new Date(session.lastActive).toLocaleString('fa-IR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </small>
                      <small>رضایت: {session.satisfaction}%</small>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="ai-assistant__sessions-empty">هنوز گفتگویی ایجاد نشده است.</p>
            )}
          </div>

          <div className="card ai-assistant__prompts">
            <h2>نمونه سوالات</h2>
            <div className="ai-assistant__prompt-buttons">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => setComposerValue(prompt)}
                  className="btn btn-ghost"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="card ai-assistant__conversation">
          {activeSession ? (
            <>
              <div className="ai-assistant__conversation-header">
                <div>
                  <h2>{activeSession.topic}</h2>
                  <p>گفتگوی متصل به Google AI با تمرکز بر موضوعات فنی خودرو.</p>
                </div>
                <div className="ai-assistant__conversation-meta">
                  <span>رضایت میانگین: {activeSession.satisfaction}%</span>
                  <span>{activeSession.messages.length} پیام</span>
                </div>
              </div>

              <div className="ai-assistant__messages" role="log" aria-live="polite">
                {activeSession.messages.map((message) => (
                  <article
                    key={message.id}
                    className={`ai-message ai-message--${message.role}`}
                    aria-label={message.role === 'assistant' ? 'پاسخ دستیار' : 'پیام شما'}
                  >
                    <header>
                      <strong>{message.role === 'assistant' ? 'دستیار هوشمند' : 'شما'}</strong>
                      <time dateTime={message.createdAt}>
                        {new Date(message.createdAt).toLocaleTimeString('fa-IR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </header>
                    <p>{message.content}</p>
                  </article>
                ))}
              </div>

              <form className="ai-assistant__composer" onSubmit={handleComposerSubmit}>
                <textarea
                  value={composerValue}
                  onChange={(event) => {
                    setComposerValue(event.target.value);
                    if (error) {
                      setError(null);
                    }
                  }}
                  placeholder="سوال فنی خود را بنویسید یا با صدا مطرح کنید..."
                  rows={3}
                />
                <div className="ai-assistant__composer-actions">
                  <button type="submit" className="btn btn-primary" disabled={isLoading}>
                    {isLoading ? 'در حال دریافت پاسخ...' : 'ارسال پیام'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setComposerValue('')}
                    disabled={isLoading || composerValue.length === 0}
                  >
                    پاک کردن
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="ai-assistant__empty">
              <strong>برای شروع گفت‌وگو، یک موضوع انتخاب کنید یا گفت‌وگوی جدید بسازید.</strong>
              <p>دستیار هوشمند تنها روی سوالات فنی خودرو پاسخ می‌دهد و از Google AI برای تحلیل‌های تخصصی استفاده می‌کند.</p>
            </div>
          )}
        </section>
      </div>

      {error && <div className="ai-assistant__error">{error}</div>}
    </div>
  );
}

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}
