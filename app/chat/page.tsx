'use client';

import { FormEvent, HTMLAttributes, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '@/lib/types';

const initialAssistantMessage: ChatMessage = {
  id: 'intro',
  role: 'assistant',
  content:
    'سلام! من دستیار هوشمند Auto Service Mani هستم. هر سوالی درباره روغن، سرویس‌های فنی و نگهداری خودرو دارید بپرسید تا راهنمایی تخصصی دریافت کنید.',
  createdAt: new Date().toISOString()
};

interface SpeechRecognitionEventLike {
  results: ArrayLike<{ 0?: { transcript: string } }>;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

type MarkdownCodeComponentProps = HTMLAttributes<HTMLElement> & {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

const CodeBlock = ({ inline, className, children, ...props }: MarkdownCodeComponentProps) => {
  if (inline) {
    return (
      <code className={`chat-bubble__code ${className ?? ''}`} {...props}>
        {children}
      </code>
    );
  }

  return (
    <pre className={`chat-bubble__pre ${className ?? ''}`} {...props}>
      <code>{children}</code>
    </pre>
  );
};

const markdownComponents: Components = {
  a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
  code: CodeBlock
};

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([initialAssistantMessage]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const conversationEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const { SpeechRecognition, webkitSpeechRecognition } = window as WindowWithSpeechRecognition;
    const RecognitionConstructor = SpeechRecognition ?? webkitSpeechRecognition;
    if (!RecognitionConstructor) return;
    setVoiceSupported(true);
    const recognition = new RecognitionConstructor();
    recognition.lang = 'fa-IR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0]?.transcript)
        .join(' ')
        .trim();
      if (transcript) {
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
      }
    };
    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognitionRef.current = recognition;
    return () => recognition.stop();
  }, []);

  useEffect(() => {
    conversationEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (event?: FormEvent<HTMLFormElement>) => {
    if (event) event.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: trimmed,
          history: messages.slice(-6).map((message) => ({ role: message.role, content: message.content }))
        })
      });
      const payload = (await response.json()) as { reply?: string; error?: string };
      if (!response.ok || !payload.reply) {
        throw new Error(payload.error ?? 'پاسخ هوش مصنوعی دریافت نشد.');
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: payload.reply,
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const fallback: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content:
          error instanceof Error
            ? error.message
            : 'در حال حاضر اتصال به دستیار هوشمند در دسترس نیست. لطفاً بعداً تلاش کنید یا با پشتیبانی تماس بگیرید.',
        createdAt: new Date().toISOString()
      };
      setMessages((prev) => [...prev, fallback]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRecording = () => {
    if (!voiceSupported || !recognitionRef.current) return;
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  const timeline = useMemo(() => messages, [messages]);

  return (
    <div className="section">
      <div className="container chat-page">
        <header className="chat-page__header">
          <div>
            <span className="badge">دستیار هوشمند</span>
            <h1>چت تخصصی فنی خودرو</h1>
            <p>
              گفت‌وگو با دستیار هوشمند برای دریافت راهکارهای نگهداری، انتخاب روغن مناسب و تشخیص مشکلات رایج خودرو.
            </p>
          </div>
          <div className="chat-page__status">
            <span className="status-dot status-dot--online" aria-hidden />
            <span>اتصال دستیار هوشمند</span>
          </div>
        </header>

        <div className="chat-page__conversation" role="log" aria-live="polite">
          {timeline.map((message) => (
            <div key={message.id} className={`chat-bubble chat-bubble--${message.role}`}>
              <div className="chat-bubble__meta">
                <strong>{message.role === 'assistant' ? 'دستیار فنی' : 'شما'}</strong>
                <span>{new Date(message.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <ReactMarkdown
                className="chat-bubble__content"
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          ))}
          {isLoading && (
            <div className="chat-bubble chat-bubble--assistant chat-bubble--typing">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          )}
          <div ref={conversationEndRef} />
        </div>

        <form className="chat-page__composer" onSubmit={handleSend}>
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="سوال فنی خود را تایپ کنید یا با آیکن میکروفون بپرسید..."
            rows={2}
          />
          <div className="chat-page__actions">
            <button type="submit" className="btn btn-primary" disabled={isLoading || input.trim().length === 0}>
              ارسال
            </button>
            <button
              type="button"
              className={`btn btn-ghost chat-page__voice ${isRecording ? 'is-recording' : ''}`}
              onClick={toggleRecording}
              disabled={!voiceSupported}
              aria-pressed={isRecording}
              aria-label={isRecording ? 'پایان ضبط صوت' : 'شروع ضبط صوت'}
            >
              {voiceSupported ? '🎙️' : '🔇'}
            </button>
          </div>
        </form>

        <footer className="chat-page__footer">
          <p>
            پاسخ‌های ارائه شده توسط دستیار هوشمند صرفاً جهت راهنمایی هستند. برای تعمیرات حساس حتماً با کارشناسان حضوری Auto Service Mani هماهنگ کنید.
          </p>
        </footer>
      </div>
    </div>
  );
}
