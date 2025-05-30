import { useState, useCallback, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface SupportChatProps {
  className?: string;
}

export function SupportChat({ className = '' }: SupportChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  // Load messages from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('pheme-support-chat-history');
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm PHEME Support. How can I help you today?",
        timestamp: new Date().toISOString()
      }]);
    }
  }, []);

  // Save messages to localStorage when they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('pheme-support-chat-history', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      inputRef.current?.focus();
    } else {
      previousActiveElement.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleTabKey = (e: KeyboardEvent) => {
      if (!document.getElementById('support-chat-dialog')?.contains(document.activeElement)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    // Clear chat history
    setMessages([{
      role: 'assistant',
      content: "Hi! I'm PHEME Support. How can I help you today?",
      timestamp: new Date().toISOString()
    }]);
    localStorage.removeItem('pheme-support-chat-history');
  }, []);

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);
    setMessages(prev => [...prev, {
      role: 'user',
      content: userMessage,
      timestamp: new Date().toISOString()
    }]);

    try {
      setIsTyping(true);
      const response = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const data = await response.json();
      
      // Add artificial delay (between 1-2 seconds)
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000));
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString()
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or email support@phemeai.xyz if the issue persists.',
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === '/') {
        e.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isOpen, handleClose]);

  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }, [handleClose]);

  return (
    <div className={className}>
      {isOpen && (
        <div
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/5 backdrop-blur-sm transition-all duration-300 z-40"
          role="presentation"
          aria-hidden="true"
          tabIndex={-1}
        />
      )}

      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-primary-light dark:bg-primary-dark text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50 group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open support chat"
        aria-expanded={isOpen}
        aria-controls="support-chat-dialog"
      >
        <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
      </button>

      <div
        id="support-chat-dialog"
        className={`fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-300 transform z-50 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Support chat window"
        aria-modal="true"
        tabIndex={isOpen ? 0 : -1}
      >
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700" role="banner">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-light dark:bg-primary-dark p-1">
              <Image
                src="/Pheme_wave.svg"
                alt="PHEME Logo"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">PHEME Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Always here to help</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close support chat"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4 h-96 overflow-y-auto space-y-4" role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-start' : 'justify-end'}`}
              role="article"
              aria-label={`Message from ${message.role === 'user' ? 'you' : 'PHEME Support'}`}
            >
              <div className="flex flex-col gap-1">
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.role === 'user'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm'
                      : 'bg-primary-light dark:bg-primary-dark text-white rounded-tr-sm'
                  }`}
                >
                  {message.content}
                </div>
                <span className={`text-xs text-gray-500 ${message.role === 'user' ? 'text-left' : 'text-right'}`}>
                  {formatTimestamp(message.timestamp)}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-end" role="status" aria-label="PHEME Support is typing">
              <div className="bg-primary-light dark:bg-primary-dark p-3 rounded-2xl rounded-tr-sm max-w-[80%] flex items-center gap-2">
                <span className="text-white text-sm">PHEME Support is typing</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                </div>
              </div>
            </div>
          )}
          {isLoading && !isTyping && (
            <div className="flex justify-end" role="status" aria-label="Loading response">
              <div className="bg-primary-light dark:bg-primary-dark p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                <Loader2 className="w-5 h-5 animate-spin text-white" aria-hidden="true" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700" role="form" aria-label="Chat message input">
          <div className="flex gap-2">
            <label htmlFor="support-chat-input" className="sr-only">
              Type your message
            </label>
            <input
              id="support-chat-input"
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              disabled={isLoading}
              aria-disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-disabled={!input.trim() || isLoading}
              className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                !input.trim() || isLoading
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  : 'bg-primary-light hover:bg-primary-light/90 dark:bg-primary-dark dark:hover:bg-primary-dark/90 text-white'
              }`}
            >
              <Send className="w-4 h-4" aria-hidden="true" />
              <span className="sr-only">Send message</span>
            </button>
          </div>
        </form>
      </div>

      <div role="status" aria-live="polite" className="sr-only">
        {isOpen ? 'Support chat opened' : 'Support chat closed'}
      </div>
    </div>
  );
}