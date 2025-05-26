/**
 * Aura Chat - A Web3-enabled chat application with wallet integration
 * Copyright (C) 2024 Aura Chat
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

// components/AuraChat.tsx
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import Image from 'next/image';

export function AuraChat() {
  const { isConnected } = useAccount();
  const [messages, setMessages] = useState<{ sender: string; text: string; id: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      setMessages((prev) => [...prev, { sender: 'AURA', text: data.reply, id: generateMessageId() }]);
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
    <div className="bg-white dark:bg-gray-900 rounded-xl text-gray-900 dark:text-white shadow-lg overflow-hidden transition-colors duration-300">
      {/* Chat Header */}
      <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2.5 transition-colors duration-300">
        <div className="rounded-full bg-[#60A5FA] p-0.5">
          <Image 
            src="/Aura_wave.svg" 
            alt="AURA Logo" 
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
          <h3 className="font-bold text-lg">AURA Chat</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">AI-powered skill verification</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 mt-8 animate-fade-in">
            <p className="text-lg font-medium mb-2">Welcome to AURA Chat!</p>
            <p className="text-sm">Ask me to verify your skills or learn more about the AURA protocol.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === 'You' ? 'justify-end' : 'justify-start'} animate-message-in`}
              style={{
                opacity: 0,
                animation: 'message-fade-in 0.5s ease forwards',
                animationDelay: `${idx * 100}ms`
              }}
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
          <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-200 text-center animate-fade-in">
            {error}
          </div>
        )}
        {isLoading && (
          <div className="flex justify-center animate-fade-in">
            <div className="animate-pulse text-gray-400 dark:text-gray-500">AURA is typing...</div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 border-2 border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors duration-300"
            placeholder="Talk to AURA..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${
              isLoading || !input.trim()
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-400 hover:scale-105'
            }`}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
