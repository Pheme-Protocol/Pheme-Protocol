/**
 * Pheme Protocol - A Web3-enabled skill verification platform with wallet integration
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
import TypingAnimation from './TypingAnimation';

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
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);

  // Scroll to message function with delay
  const scrollToMessage = (element: HTMLDivElement | null) => {
    if (element && messagesContainerRef.current) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        const container = messagesContainerRef.current;
        if (!container) return;
        
        const elementTop = element.offsetTop;
        const containerHeight = container.clientHeight;
        const scrollPosition = elementTop - (containerHeight / 4);
        
        // Force a reflow to ensure accurate measurements
        container.style.scrollBehavior = 'auto';
        container.scrollTop = scrollPosition;
        
        // Reset scroll behavior after position is set
        requestAnimationFrame(() => {
          container.style.scrollBehavior = 'smooth';
        });
      }, 50);
    }
  };

  // Scroll to new message when messages change
  useEffect(() => {
    if (lastMessageRef.current) {
      scrollToMessage(lastMessageRef.current);
    }
  }, [messages]);

  // Scroll to bottom when loading state changes
  useEffect(() => {
    if (isLoading && messagesContainerRef.current) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [isLoading]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Submit on Ctrl/Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (localInput.trim() && !isLoading) {
          handleSend(e as unknown as React.FormEvent);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [localInput, isLoading]);

  // Generate unique ID for messages
  const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const messageText = localInput.trim();
    if (!messageText) return;

    // Clear input field and save to localStorage
    setLocalInput('');
    localStorage.setItem('pheme-chat-input', '');

    setIsLoading(true);
    const userMessageId = generateMessageId();
    const typingIndicatorId = generateMessageId();

    try {
      // Add message to UI first
      setMessages((prev) => [...prev, { 
        sender: 'You', 
        text: messageText, 
        id: userMessageId 
      }]);

      // Add typing indicator message
      setMessages((prev) => [...prev, {
        sender: 'PHEME',
        text: '<typing>',
        id: typingIndicatorId
      }]);

      // Make API request
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.details || 'Failed to get response');
      }

      // Remove typing indicator and add bot response
      setMessages((prev) => prev.filter(msg => msg.id !== typingIndicatorId).concat({
        sender: 'PHEME',
        text: data.reply,
        id: generateMessageId()
      }));

    } catch (err) {
      console.error('Chat error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
      // Remove both the user's message and typing indicator
      setMessages((prev) => prev.filter(msg => msg.id !== userMessageId && msg.id !== typingIndicatorId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md">
        <Image
          src="/Pheme_wave.svg"
          alt="PHEME Logo"
          width={64}
          height={64}
          className="rounded-full"
        />
        <h3 className="font-bold text-lg">PHEME Chat</h3>
      </div>

      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-800"
      >
        {messages.length === 0 ? (
          <div className="text-center p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-lg font-medium mb-2">Welcome to PHEME Chat!</p>
            <p className="text-base text-gray-600 dark:text-gray-400">Ask me to verify your skills or learn more about the PHEME protocol.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`flex ${msg.sender === 'You' ? 'justify-start' : 'justify-end'} mb-4`}
              role="article"
              aria-label={`Message from ${msg.sender === 'You' ? 'you' : 'PHEME Support'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl shadow-md border ${
                  msg.sender === 'You'
                    ? 'bg-primary-light dark:bg-primary-dark text-white rounded-tr-sm border-primary-light/50 dark:border-primary-dark/50'
                    : 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white rounded-tl-sm border-gray-200 dark:border-gray-700'
                }`}
              >
                {msg.text === '<typing>' ? (
                  <TypingAnimation />
                ) : (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {msg.text.split('\n\n').map((paragraph, index) => (
                      <div key={index} className={`${index > 0 ? 'mt-4' : ''}`}>
                        {paragraph.startsWith('- ') ? (
                          <ul className="list-disc list-inside space-y-2 ml-2">
                            {paragraph.split('\n').map((item, i) => (
                              <li key={i} className="text-base">
                                <span dangerouslySetInnerHTML={{ 
                                  __html: item.replace('- ', '')
                                }} />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-base leading-relaxed">
                            <span dangerouslySetInnerHTML={{ __html: paragraph }} />
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
            className="flex justify-end mb-4"
            role="status" 
            aria-label="PHEME is processing your request"
          >
            <div className="bg-white dark:bg-gray-900 p-3 rounded-2xl rounded-tr-sm border border-gray-200 dark:border-gray-700 shadow-md max-w-[80%]">
              <TypingAnimation />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form 
        onSubmit={handleSend} 
        className="p-4 border-t dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg"
        role="form"
        aria-label="Chat message input"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={localInput}
            onChange={(e) => {
              setLocalInput(e.target.value);
              localStorage.setItem('pheme-chat-input', e.target.value);
            }}
            placeholder="Talk to PHEME..."
            disabled={isLoading}
            className="flex-1 px-4 py-3 text-base rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isLoading || !localInput.trim()}
            className="px-4 py-2 bg-primary-light hover:bg-primary-light/90 dark:bg-primary-dark dark:hover:bg-primary-dark/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
}