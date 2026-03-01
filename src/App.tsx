import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { GojoAvatar, GojoSmallAvatar } from './components/GojoAvatar';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const API_KEY = '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';

const SYSTEM_PROMPT = `Ты — GoshaAI, продвинутый ИИ-ассистент. Ты дружелюбный, умный и полезный. Отвечай на русском языке, если пользователь пишет на русском. Будь лаконичным, но информативным. Используй эмодзи, чтобы быть более выразительным. Ты можешь отвечать на любые вопросы и помогать с любыми задачами.`;

function generateId() {
  return Math.random().toString(36).substring(2, 15);
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
}

const TypingIndicator = () => (
  <div className="flex items-center gap-3 animate-fade-in">
    <div className="flex-shrink-0">
      <GojoSmallAvatar size={36} />
    </div>
    <div className="message-ai rounded-2xl rounded-bl-md px-5 py-3">
      <div className="flex items-center gap-1.5">
        <div className="w-2 h-2 bg-cyan-400 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-cyan-400 rounded-full typing-dot" />
        <div className="w-2 h-2 bg-cyan-400 rounded-full typing-dot" />
      </div>
    </div>
  </div>
);

const WelcomeScreen = () => (
  <div className="flex flex-col items-center justify-center h-full px-4 animate-fade-in">
    <div className="relative mb-6">
      <div className="absolute inset-0 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-glow" />
      <div className="relative animate-float gojo-eyes">
        <GojoAvatar size={160} />
      </div>
    </div>
    <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-3 animate-gradient">
      GoshaAI
    </h2>
    <p className="text-slate-400 text-center max-w-md mb-8 leading-relaxed">
      Привет! Я GoshaAI — твой умный ИИ-помощник. Задай мне любой вопрос, и я помогу тебе найти ответ ⚡
    </p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg w-full">
      {[
        { icon: '💡', text: 'Объясни квантовую физику' },
        { icon: '🎨', text: 'Помоги с дизайном' },
        { icon: '💻', text: 'Напиши код на Python' },
        { icon: '📝', text: 'Составь план обучения' },
      ].map((item, i) => (
        <div
          key={i}
          className="glass-light rounded-xl px-4 py-3 cursor-pointer hover:bg-slate-700/50 transition-all duration-300 hover:scale-[1.02] hover:border-indigo-500/30 group"
          style={{ animationDelay: `${i * 0.1}s` }}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="text-sm text-slate-300 group-hover:text-slate-100 transition-colors">{item.text}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MessageBubble = ({ message }: { message: Message }) => {
  const isUser = message.role === 'user';
  return (
    <div className={`flex items-end gap-3 animate-slide-up ${isUser ? 'flex-row-reverse' : ''}`}>
      {!isUser && (
        <div className="flex-shrink-0 mb-1">
          <GojoSmallAvatar size={34} />
        </div>
      )}
      {isUser && (
        <div className="flex-shrink-0 mb-1 w-[34px] h-[34px] rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold shadow-lg shadow-indigo-500/20">
          G
        </div>
      )}
      <div className={`max-w-[75%] ${isUser ? 'message-user text-white' : 'message-ai text-slate-200'} rounded-2xl ${isUser ? 'rounded-br-md' : 'rounded-bl-md'} px-4 py-3 shadow-lg`}>
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-chat text-sm leading-relaxed">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        )}
        <p className={`text-[10px] mt-1.5 ${isUser ? 'text-indigo-200/60' : 'text-slate-500'} text-right`}>
          {formatTime(message.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading, scrollToBottom]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: trimmed,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    try {
      const apiMessages = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content,
      }));

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error?.message || `Ошибка API: ${response.status}`);
      }

      const data = await response.json();
      const assistantContent = data.content?.[0]?.text || 'Нет ответа от модели.';

      const assistantMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: assistantContent,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.message || 'Произошла ошибка при отправке сообщения.');
      const errorMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: `⚠️ Ошибка: ${err.message || 'Не удалось получить ответ.'}`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaInput = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
      inputRef.current.style.height = Math.min(inputRef.current.scrollHeight, 150) + 'px';
    }
  };

  const clearChat = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-indigo-600/5 blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-cyan-600/5 blur-3xl animate-pulse-glow" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-600/3 blur-3xl animate-pulse-glow" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* Header */}
      <header className="relative z-10 glass border-b border-indigo-500/10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <GojoSmallAvatar size={42} />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#0f172a] shadow-lg shadow-emerald-400/30" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                GoshaAI
              </h1>
              <p className="text-[11px] text-emerald-400/80 font-medium flex items-center gap-1">
                <span className="inline-block w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                Онлайн • Claude Sonnet
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button
                onClick={clearChat}
                className="text-xs text-slate-400 hover:text-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/50 hover:border-slate-600"
              >
                🗑️ Очистить
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Chat area */}
      <div
        ref={chatContainerRef}
        className="relative z-10 flex-1 overflow-y-auto px-4 py-6"
      >
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <WelcomeScreen />
          ) : (
            <div className="flex flex-col gap-4">
              {messages.map(msg => (
                <MessageBubble key={msg.id} message={msg} />
              ))}
              {isLoading && <TypingIndicator />}
              {error && !isLoading && (
                <div className="flex justify-center animate-fade-in">
                  <button
                    onClick={sendMessage}
                    className="text-xs text-indigo-400 hover:text-indigo-300 px-4 py-2 rounded-lg glass-light transition-all hover:scale-105"
                  >
                    🔄 Попробовать снова
                  </button>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="relative z-10 glass border-t border-indigo-500/10">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-end gap-3 glass-light rounded-2xl px-4 py-2 input-glow transition-all duration-300">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                handleTextareaInput();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Напишите сообщение..."
              rows={1}
              className="flex-1 bg-transparent text-slate-200 placeholder-slate-500 resize-none outline-none text-sm leading-relaxed py-1.5 max-h-[150px]"
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading}
              className="btn-send flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4 31.4" strokeLinecap="round" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-[10px] text-slate-600 text-center mt-2">
            GoshaAI использует Claude от Anthropic • Shift+Enter для новой строки
          </p>
        </div>
      </div>
    </div>
  );
}
