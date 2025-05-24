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
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from './ConnectButton';
import Image from 'next/image';

export function AuraChat() {
  const { isConnected } = useAccount();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!input.trim()) return;

    setIsLoading(true);
    setMessages((prev) => [...prev, { sender: 'You', text: input }]);

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

      setMessages((prev) => [...prev, { sender: 'AURA', text: data.reply }]);
      setInput('');
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to send message. Please try again.');
      // Remove the user's message if it failed
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <h1 className="text-3xl font-bold text-blue-400">Welcome to AURA Chat</h1>
        <p className="text-gray-400 text-center max-w-md">
          Connect your wallet to start chatting with AURA, your AI assistant.
        </p>
        <ConnectButton />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg space-y-3">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-400 flex items-center">
          <div className="relative w-12 h-12 mr-2">
            <Image 
              src="/Aura_wave.svg" 
              alt="AURA Wave" 
              width={48} 
              height={48} 
              priority 
              quality={100}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          </div>
          Talk to AURA
        </h2>
        <ConnectButton />
      </div>

      <div className="h-96 overflow-y-scroll space-y-3 mb-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded ${
              msg.sender === 'You'
                ? 'bg-yellow-600 text-white'
                : 'bg-gray-700 text-blue-200'
            }`}
          >
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
        {error && (
          <div className="p-3 rounded bg-red-500 text-white">
            Error: {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex">
        <input
          type="text"
          className="flex-1 p-3 rounded-l-lg bg-gray-700 text-white outline-none"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
        />
        <button
          type="submit"
          className={`px-6 rounded-r-lg font-semibold ${
            isLoading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          } text-white`}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
