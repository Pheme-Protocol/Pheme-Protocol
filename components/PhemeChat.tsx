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

export function PhemeChat() {
  const { isConnected } = useAccount();
  const [messages, setMessages] = useState<{ sender: string; text: string; id: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
      const res = await fetch(`${baseUrl}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      setMessages((prev) => [...prev, { sender: 'PHEME', text: data.reply, id: generateMessageId() }]);
      setInput('');
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to send message. Please try again.');
      // Remove the user's message if it failed
      setMessages((prev) => prev.filter(msg => msg.id !== userMessageId));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="bg-white dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white shadow-lg overflow-hidden transition-colors duration-300"
      role="region"
      aria-label="PHEME Chat Interface"
    >
      {/* Chat Header */}
      <div 
        className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2.5 transition-colors duration-300"
        role="banner"
        aria-label="Chat header"
      >
        <div 
          className="rounded-full bg-[#60A5FA] p-0.5"
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
            style={{
              transform: 'translateZ(0)'
            }}
          />
        </div>
        <div>
          <h1 className="font-bold text-lg">PHEME Chat</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400" aria-label="Chat description">AI-powered skill verification</p>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300"
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
        aria-atomic="false"
      >
        {messages.length === 0 ? (
          <div 
            className="text-center text-gray-500 dark:text-gray-400 mt-8 animate-fade-in"
            role="status"
            aria-label="Welcome message"
          >
            <p className="text-lg font-medium mb-2">Welcome to PHEME Chat!</p>
            <p className="text-sm">Ask me to verify your skills or learn more about the PHEME protocol.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
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
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                } transform transition-all duration-300 hover:scale-[1.02]`}
              >
                <div className="text-sm font-medium mb-1 opacity-75">{msg.sender}</div>
                <div className="break-words">{msg.text}</div>
              </div>
            </div>
          ))
        )}
        {error && (
          <div 
            className="p-3 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-200 text-center animate-fade-in"
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
            <div className="animate-pulse text-gray-400 dark:text-gray-500">
              PHEME is typing...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} tabIndex={-1} />
      </div>

      {/* Input Form */}
      <form 
        onSubmit={handleSend}
        className="p-4 border-t border-gray-200 dark:border-gray-700"
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
            placeholder="Ask about skill verification..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            disabled={isLoading}
            aria-disabled={isLoading}
            aria-label="Chat message input"
            aria-describedby={error ? "chat-error" : undefined}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            aria-disabled={!input.trim() || isLoading}
            className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
              !input.trim() || isLoading
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
            aria-label="Send message"
          >
            Send
          </button>
        </div>
        {error && (
          <div id="chat-error" className="sr-only" role="alert">
            {error}
          </div>
        )}
      </form>
    </div>
  );
}