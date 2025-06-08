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
import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import TypingAnimation from './TypingAnimation';
import { useAccount } from 'wagmi';
import { Send } from 'lucide-react';

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
  const [localInput, setLocalInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isConnected } = useAccount();

  // Handle keyboard visibility
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        const visualViewport = window.visualViewport;
        if (visualViewport) {
          setIsKeyboardVisible(visualViewport.height < window.innerHeight);
        }
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  // Handle input focus for mobile
  const handleInputFocus = () => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        const container = messagesContainerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      }, 100);
    }
  };

  // Handle input blur
  const handleInputBlur = () => {
    setIsKeyboardVisible(false);
  };

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

  // Focus input when component mounts
  useEffect(() => {
    if (isConnected) {
      inputRef.current?.focus();
    }
  }, [isConnected]);

  // Generate unique ID for messages
  const generateMessageId = () => `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  const handleSend = useCallback(async (e: React.FormEvent) => {
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
      const errorMessage = err instanceof Error ? err.message : 'Failed to send message. Please try again.';
      setError(errorMessage);
      // Remove both the user's message and typing indicator
      setMessages((prev) => prev.filter(msg => msg.id !== userMessageId && msg.id !== typingIndicatorId));
    } finally {
      setIsLoading(false);
    }
  }, [localInput, setMessages]);

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
  }, [localInput, isLoading, handleSend]);

  return (
    <div className={`flex flex-col h-full ${isConnected ? 'bg-white dark:bg-gray-900 rounded-[16px] sm:rounded-[40px] text-gray-900 dark:text-white p-1 sm:p-3 shadow-[0_0_60px_-15px_rgba(0,0,0,0.2)] dark:shadow-[0_0_60px_-15px_rgba(255,255,255,0.1)] border-[4px] sm:border-[12px] border-gray-900 dark:border-gray-950 relative overflow-hidden ring-1 ring-gray-900/30 dark:ring-white/20' : ''}`}>
      {/* Mobile Backdrop */}
      {isConnected && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[-1] sm:hidden"
          aria-hidden="true"
        />
      )}

      {isConnected && (
        <>
          {/* Device Frame Details */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-gray-800/20 to-transparent pointer-events-none" 
            aria-hidden="true"
            tabIndex={-1}
          ></div>
          <div className="absolute inset-x-0 top-0 h-[1px] sm:h-[2px] bg-gradient-to-r from-transparent via-gray-200/40 to-transparent"></div>
          
          {/* iPhone Notch */}
          <div className="bg-gray-950 h-2.5 sm:h-6 w-24 sm:w-40 rounded-b-md sm:rounded-b-2xl mx-auto mb-1 sm:mb-2 relative shadow-xl">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-0.5 sm:top-1 w-8 sm:w-16 h-1 sm:h-3 bg-black rounded-full flex items-center justify-center">
              <div className="w-0.5 sm:w-2 h-0.5 sm:h-2 bg-gray-800 rounded-full absolute left-1 sm:left-3"></div>
              <div className="w-0.5 sm:w-1.5 h-0.5 sm:h-1.5 bg-gray-700 rounded-full absolute right-1 sm:right-3"></div>
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-1.5 sm:gap-2 p-1.5 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm relative z-10">
        <Image
          src="/Pheme_wave.svg"
          alt="PHEME Logo"
          width={40}
          height={40}
          className="w-8 h-8 sm:w-16 sm:h-16 rounded-full"
        />
        <h3 className="font-bold text-xs sm:text-lg">PHEME Chat</h3>
      </div>

      <div 
        ref={messagesContainerRef}
        className="flex-1 min-h-0 overflow-y-auto p-1 sm:p-4 bg-gray-50 dark:bg-gray-800 relative z-10"
        style={{ 
          WebkitOverflowScrolling: 'touch',
          paddingBottom: isKeyboardVisible ? 'calc(220px + env(safe-area-inset-bottom, 0px))' : 'calc(0.5rem + env(safe-area-inset-bottom, 0px))',
          maxHeight: 'calc(100vh - 140px)'
        }}
      >
        {messages.length === 0 ? (
          <div className="text-center p-2 sm:p-6 bg-white dark:bg-gray-900 rounded-lg sm:rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs sm:text-lg font-medium mb-1 sm:mb-2">Welcome to PHEME Chat!</p>
            <p className="text-[10px] sm:text-base text-gray-600 dark:text-gray-400">Ask me to verify your skills or learn more about the PHEME protocol.</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={msg.id}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className={`flex ${msg.sender === 'You' ? 'justify-start' : 'justify-end'} mb-1.5 sm:mb-4`}
              role="article"
              aria-label={`Message from ${msg.sender === 'You' ? 'you' : 'PHEME Support'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[80%] p-1.5 sm:p-3 rounded-lg sm:rounded-2xl shadow-sm border ${
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
                      <div key={index} className={`${index > 0 ? 'mt-1 sm:mt-4' : ''}`}>
                        {paragraph.startsWith('- ') ? (
                          <ul className="list-disc list-inside space-y-0.5 sm:space-y-2 ml-2">
                            {paragraph.split('\n').map((item, i) => (
                              <li key={i} className="text-[10px] sm:text-base">
                                <span dangerouslySetInnerHTML={{ 
                                  __html: item.replace('- ', '')
                                }} />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-[10px] sm:text-base leading-relaxed">
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
            className="p-1.5 sm:p-3 rounded-lg bg-error-light/10 dark:bg-error-dark/10 text-error-text-light dark:text-error-text-dark text-center animate-fade-in text-[10px] sm:text-base"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}
        {isLoading && (
          <div 
            className="flex justify-end mb-1.5 sm:mb-4"
            role="status" 
            aria-label="PHEME is processing your request"
          >
            <div className="bg-white dark:bg-gray-900 p-1.5 sm:p-3 rounded-lg sm:rounded-2xl rounded-tr-sm border border-gray-200 dark:border-gray-700 shadow-sm max-w-[90%] sm:max-w-[80%]">
              <TypingAnimation />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="p-1.5 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 relative z-20" role="form" aria-label="Chat message input">
        <div className="flex gap-1 sm:gap-2">
          <label htmlFor="pheme-chat-input" className="sr-only">
            Type your message
          </label>
          <input
            id="pheme-chat-input"
            ref={inputRef}
            type="text"
            value={localInput}
            onChange={(e) => setLocalInput(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder="Type your message..."
            autoComplete="off"
            autoCorrect="off"
            className="flex-1 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark text-[10px] sm:text-base"
            disabled={isLoading}
            aria-disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!localInput.trim() || isLoading}
            aria-disabled={!localInput.trim() || isLoading}
            className={`px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium flex items-center gap-1 sm:gap-2 transition-colors min-w-[36px] min-h-[36px] sm:min-w-[44px] sm:min-h-[44px] justify-center ${
              !localInput.trim() || isLoading
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-primary-light hover:bg-primary-light/90 dark:bg-primary-dark dark:hover:bg-primary-dark/90 text-white active:scale-95'
            }`}
          >
            <Send className="w-3 h-3 sm:w-4 sm:h-4" aria-hidden="true" />
            <span className="sr-only">Send message</span>
          </button>
        </div>
      </form>
    </div>
  );
}