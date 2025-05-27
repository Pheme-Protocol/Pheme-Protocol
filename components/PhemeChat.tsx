/**
 * Pheme Protocol - A Web3-enabled chat application with wallet integration
 * Copyright (C) 2024 Pheme Protocol
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// components/PhemeChat.tsx
import { useState, useEffect, useRef } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';

interface Message {
  sender: string;
  text: string;
  id: string;
}

interface PhemeChatProps {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}

export function PhemeChat({ messages, setMessages }: PhemeChatProps) {
  const { isConnected } = useAccount();
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current && messagesEndRef.current) {
      const container = messagesContainerRef.current;
      const scrollHeight = container.scrollHeight;
      const height = container.clientHeight;
      const maxScroll = scrollHeight - height;
      container.scrollTop = maxScroll > 0 ? maxScroll : 0;
    }
  }, [messages]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Submit on Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (input.trim() && !isLoading) {
          handleSend(e as unknown as React.FormEvent);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [input, isLoading]);

  // Generate unique ID for messages
  const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.trim()) return;

    setIsLoading(true);
    const userMessageId = generateMessageId();
    setMessages((prev) => [...prev, { sender: 'You', text: input, id: userMessageId }]);

    try {
      console.log('Sending chat request...');
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      
      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to get response');
      }

      setMessages((prev) => [...prev, { sender: 'PHEME', text: data.reply, id: generateMessageId() }]);
      setInput('');
    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
      // Remove the user's message if it failed
      setMessages((prev) => prev.filter(msg => msg.id !== userMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="bg-background-light dark:bg-background-dark rounded-xl text-text-light dark:text-text-dark shadow-lg overflow-hidden transition-colors duration-300 flex flex-col h-full"
      role="region"
      aria-label="PHEME Chat Interface"
    >
      {/* Chat Header */}
      <div 
        className="bg-surface-light dark:bg-surface-dark px-6 py-4 border-b border-border-light dark:border-border-dark flex items-center gap-2.5 transition-colors duration-300 flex-shrink-0"
        role="banner"
        aria-label="Chat header"
      >
        <div 
          className="rounded-full bg-primary-light dark:bg-primary-dark p-0.5"
          role="img"
          aria-label="PHEME Logo"
        >
          <Image 
            src="/Pheme_wave.svg" 
            alt="PHEME Logo" 
            width={20} 
            height={20}
            priority
            quality={100}
            className="flex-shrink-0"
          />
        </div>
        <div>
          <h1 className="font-bold text-[19px] text-text-light dark:text-text-dark">PHEME Chat</h1>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">AI-powered skill verification</p>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-surface-light dark:bg-surface-dark"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.length === 0 ? (
          <div 
            className="text-center text-text-muted-light dark:text-text-muted-dark mt-8 animate-fade-in"
            role="status"
          >
            <p className="text-[19px] font-bold mb-2">Welcome to PHEME Chat!</p>
            <p className="text-base">Ask me to verify your skills or learn more about the PHEME protocol.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} animate-message-in`}
              role="article"
              aria-label={`Message from ${msg.sender}`}
              tabIndex={0}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'You'
                    ? 'bg-primary-light hover:bg-primary-hover-light dark:bg-primary-dark dark:hover:bg-primary-hover-dark text-white'
                    : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark'
                }`}
              >
                <div className="text-[15px] font-bold mb-1">{msg.sender}</div>
                <div className="break-words text-base">{msg.text}</div>
              </div>
            </div>
          ))
        )}
        {error && (
          <div 
            className="p-3 rounded-lg bg-error-light/10 dark:bg-error-dark/10 text-error-text-light dark:text-error-text-dark text-center animate-fade-in text-base"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        {isLoading && (
          <div 
            className="flex justify-center animate-fade-in"
            role="status"
            aria-live="polite"
          >
            <div className="animate-pulse text-text-muted-light dark:text-text-muted-dark text-base">
              PHEME is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} className="h-0" aria-hidden="true" />
      </div>

      {/* Input Form */}
      <form 
        onSubmit={handleSend}
        className="p-4 border-t border-border-light dark:border-border-dark flex-shrink-0"
        role="form"
        aria-label="Message input form"
      >
        <div className="flex gap-2">
          <label className="sr-only" htmlFor="chat-input">
            Type your message
          </label>
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 px-4 py-2 rounded-lg border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark placeholder-text-placeholder-light dark:placeholder-text-placeholder-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-base"
            disabled={isLoading}
            aria-disabled={isLoading}
            aria-label="Chat message input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-disabled={!input.trim() || isLoading}
            className={`px-4 py-2 rounded-lg font-bold text-base transition-colors duration-300 ${
              !input.trim() || isLoading
                ? 'bg-surface-light dark:bg-surface-dark text-text-muted-light dark:text-text-muted-dark cursor-not-allowed'
                : 'bg-primary-light hover:bg-primary-hover-light dark:bg-primary-dark dark:hover:bg-primary-hover-dark text-white'
            }`}
            aria-label="Send message"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}