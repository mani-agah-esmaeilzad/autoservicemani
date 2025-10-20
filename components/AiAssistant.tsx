'use client';

import {
  FormEvent,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes
} from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage, ChatSession } from '@/lib/types';

interface SpeechRecognitionEventLike {
  results: ArrayLike<{ 0?: { transcript?: string } }>;
}

interface SpeechRecognitionInstance {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: ((event: unknown) => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance;

interface WindowWithSpeechRecognition extends Window {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
}

interface AiAssistantProps {
  initialSessions: ChatSession[];
}

interface ApiResponse {
  session: ChatSession;
  reply?: ChatMessage;
  error?: string;
}

type MarkdownCodeComponentProps = HTMLAttributes<HTMLElement> & {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
};

const CodeBlock = ({ inline, className, children, ...props }: MarkdownCodeComponentProps) => {
  if (inline) {
    return (
      <code className={`ai-message__code ${className ?? ''}`} {...props}>
        {children}
      </code>
    );
  }

  return (
    <pre className={`ai-message__pre ${className ?? ''}`} {...props}>
      <code>{children}</code>
    </pre>
  );
};

const markdownComponents: Components = {
  a: ({ ...props }) => <a {...props} target="_blank" rel="noreferrer" />,
  code: CodeBlock
};

const quickPrompts = [
  'چه روغنی برای ترافیک سنگین تهران پیشنهاد می‌دهید؟',
  'چطور می‌توانم صدای غیرعادی موتور را بررسی کنم؟',
  'برای سفر طولانی چه روغنی مناسب است؟'
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
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    setSpeechSupported('speechSynthesis' in window);

    const { SpeechRecognition, webkitSpeechRecognition } = window as WindowWithSpeechRecognition;
    const SpeechRecognitionConstructor = SpeechRecognition ?? webkitSpeechRecognition;

    if (SpeechRecognitionConstructor) {
      const recognition = new SpeechRecognitionConstructor();
      recognition.lang = 'fa-IR';
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;
      recognition.onresult = (event: SpeechRecognitionEventLike) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0]?.transcript ?? '')
          .join(' ');
        setComposerValue(transcript);
      };
      recognition.onend = () => setIsRecording(false);
      recognition.onerror = () => setIsRecording(false);
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

  useEffect(() => {
    if (!scrollRef.current) {
      return;
    }
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeSession?.messages.length]);

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

  const handleCreateSession = useCallback(async () => {
    setError(null);
    const topic = newSessionTopic.trim();
    try {
      const response = await fetch('/api/ai-assistant/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });

      if (!response.ok) {
        throw new Error('SESSION_CREATE_FAILED');
      }

      const data = (await response.json()) as { session: ChatSession };
      setSessions((prev) => [data.session, ...prev.filter((item) => item.id !== data.session.id)]);
      setActiveSessionId(data.session.id);
      setNewSessionTopic('');
      setComposerValue('');
    } catch (creationError) {
      console.error(creationError);
      setError('ایجاد گفت‌وگوی جدید با خطا مواجه شد. دوباره تلاش کنید.');
    }
  }, [newSessionTopic]);

  const handleSend = useCallback(async () => {
    if (!activeSessionId) {
      setError('ابتدا یک گفت‌وگو را انتخاب کنید یا جدید بسازید.');
      return;
    }

    const message = composerValue.trim();
    if (!message) {
      setError('لطفاً سوال یا مشکل فنی خود را بنویسید.');
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: activeSessionId, message })
      });

      if (!response.ok) {
        throw new Error('ASSISTANT_REQUEST_FAILED');
      }

      const data = (await response.json()) as ApiResponse;
      setSessions((prev) =>
        prev.map((session) =>
          session.id === activeSessionId
            ? { ...data.session }
            : session
        )
      );

      if (data.reply) {
        speak(data.reply.content);
      }
    } catch (sendError) {
      console.error(sendError);
      setError('پاسخ دستیار هوشمند در دسترس نیست. بعداً دوباره تلاش کنید.');
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
      setComposerValue(message);
    } finally {
      setIsLoading(false);
    }
  }, [activeSessionId, composerValue, speak]);

  const handleComposerSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      await handleSend();
    },
    [handleSend]
  );

  const toggleRecording = () => {
    if (!recordingSupported) {
      setError('مرورگر شما از ضبط صوتی پشتیبانی نمی‌کند.');
      return;
    }

    if (!isRecording) {
      recognitionRef.current?.start();
      setIsRecording(true);
      return;
    }

    recognitionRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="ai-shell">
      <aside className="ai-shell__sidebar">
        <div className="ai-shell__sidebar-header">
          <h2>گفت‌وگوها</h2>
          <p>مسائل فنی خود را دسته‌بندی شده نگه دارید.</p>
        </div>
        <div className="ai-shell__new-session">
          <input
            value={newSessionTopic}
            onChange={(event) => setNewSessionTopic(event.target.value)}
            placeholder="موضوع جلسه جدید..."
            aria-label="موضوع گفت‌وگوی جدید"
          />
          <button type="button" onClick={handleCreateSession} className="btn btn-secondary">
            شروع گفت‌وگو
          </button>
        </div>
        <div className="ai-shell__session-list" role="tablist">
          {sessions.map((session) => (
            <button
              key={session.id}
              type="button"
              className={`ai-session ${session.id === activeSessionId ? 'active' : ''}`}
              onClick={() => setActiveSessionId(session.id)}
              role="tab"
              aria-selected={session.id === activeSessionId}
            >
              <strong>{session.topic || 'گفت‌وگوی بدون عنوان'}</strong>
              <span>{new Date(session.lastActive).toLocaleString('fa-IR')}</span>
            </button>
          ))}
          {sessions.length === 0 && <p className="ai-shell__empty">هنوز گفت‌وگویی ثبت نشده است.</p>}
        </div>
        <div className="ai-shell__quick-prompts">
          <h3>پیشنهاد آماده</h3>
          <div className="ai-shell__prompt-chips">
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => setComposerValue(prompt)}>
                {prompt}
              </button>
            ))}
          </div>
        </div>
      </aside>

      <section className="ai-shell__body">
        <header className="ai-shell__body-header">
          <div>
            <h1>دستیار هوشمند مانی اویل</h1>
            <p>پرسش‌های فنی خودرو، تشخیص صداهای غیرعادی و انتخاب قطعات را به دستیار هوشمند بسپارید.</p>
          </div>
          <div className="ai-shell__toggles">
            <label className="ai-toggle">
              <input
                type="checkbox"
                checked={voiceReplyEnabled}
                onChange={(event) => setVoiceReplyEnabled(event.target.checked)}
                disabled={!speechSupported}
              />
              <span>پخش صوتی پاسخ</span>
            </label>
          </div>
        </header>

        <div className="ai-shell__messages" ref={scrollRef}>
          {activeSession?.messages.map((message) => (
            <article
              key={message.id}
              className={`ai-message ai-message--${message.role === 'assistant' ? 'assistant' : 'user'}`}
            >
              <div className="ai-message__bubble">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                  {message.content}
                </ReactMarkdown>
              </div>
              <time dateTime={message.createdAt}>
                {new Date(message.createdAt).toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
              </time>
            </article>
          ))}
          {!activeSession && <p className="ai-shell__empty">یکی از گفت‌وگوها را انتخاب کنید.</p>}
        </div>

        <footer className="ai-shell__composer">
          {error && <div className="ai-shell__error" role="alert">{error}</div>}
          <form onSubmit={handleComposerSubmit} className="ai-shell__composer-form">
            <button
              type="button"
              className={`ai-shell__composer-mic ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              aria-pressed={isRecording}
              aria-label="ضبط صوت"
            >
              🎙️
            </button>
            <textarea
              value={composerValue}
              onChange={(event) => setComposerValue(event.target.value)}
              placeholder="سوال فنی یا مشکل خودرو را بنویسید..."
              rows={2}
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'در حال ارسال...' : 'ارسال پیام'}
            </button>
          </form>
          <p className="ai-shell__composer-hint">
            دستیار هوشمند مانی اویل بر پایه دانش تخصصی خودرو پاسخ می‌دهد و جایگزین معاینه حضوری نیست.
          </p>
        </footer>
      </section>
    </div>
  );
}
