import { useState } from 'react';

export default function App() {
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

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold mb-6 text-blue-400">Talk to AURA</h1>

      <div className="w-full max-w-2xl bg-gray-800 p-4 rounded-lg h-96 overflow-y-scroll space-y-3 mb-4">
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

      <form onSubmit={handleSend} className="w-full max-w-2xl flex">
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