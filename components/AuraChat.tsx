// components/AuraChat.tsx
import { useState } from 'react';
import { useAccount } from 'wagmi';
import { ConnectButton } from './ConnectButton';

export function AuraChat() {
  const { isConnected } = useAccount();
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState('');

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    setMessages((prev) => [...prev, { sender: 'You', text: input }]);

    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { sender: 'AURA', text: data.reply }]);
    setInput('');
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
        <h2 className="text-xl font-semibold text-blue-400">🔮 Talk to AURA</h2>
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
      </div>

      <form onSubmit={handleSend} className="flex">
        <input
          type="text"
          className="flex-1 p-3 rounded-l-lg bg-gray-700 text-white outline-none"
          placeholder="Ask me anything..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-r-lg font-semibold"
        >
          Send
        </button>
      </form>
    </div>
  );
}
