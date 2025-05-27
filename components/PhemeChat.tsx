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
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <Image
          src="/Pheme_wave.svg"
          alt="PHEME Logo"
          width={24}
          height={24}
          className="rounded-full"
        />
        <h3 className="font-bold text-lg">PHEME Chat</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {messages.length === 0 ? (
          <div className="text-center">
            <p className="text-lg font-medium mb-2">Welcome to PHEME Chat!</p>
            <p className="text-sm">Ask me to verify your skills or learn more about the PHEME protocol.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 ${
                msg.sender === 'You' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-3 rounded-lg ${
                  msg.sender === 'You'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-800'
                }`}
              >
                {msg.text}
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
          <div className="animate-pulse text-gray-400 dark:text-gray-500">PHEME is typing...</div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to PHEME..."
            className="flex-1 p-2 border rounded-lg dark:bg-gray-800"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}