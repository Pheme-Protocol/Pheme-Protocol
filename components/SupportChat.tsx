import { useState, useCallback } from 'react';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import Image from 'next/image';

export function SupportChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: 'Hi! I\'m AURA Support. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = useCallback(() => {
    if (messages.length > 1) {
      const confirmClose = window.confirm('Closing the chat will clear your conversation history. Are you sure?');
      if (confirmClose) {
        setIsOpen(false);
        // Reset messages to initial state after closing
        setTimeout(() => {
          setMessages([{ role: 'assistant', content: 'Hi! I\'m AURA Support. How can I help you today?' }]);
        }, 300);
      }
    } else {
      setIsOpen(false);
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    // Add user message immediately
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
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
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again or email support@aurabot.app if the issue persists.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 bg-primary-light dark:bg-primary-dark text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all duration-300 z-50 group ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
        aria-label="Open support chat"
      >
        <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:rotate-12" />
      </button>

      {/* Chat Interface */}
      <div 
        className={`fixed bottom-6 right-6 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl transition-all duration-300 transform z-50 ${
          isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
        }`}
        role="dialog"
        aria-label="Support chat window"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-primary-light dark:bg-primary-dark p-1">
              <Image 
                src="/Aura_wave.svg" 
                alt="AURA Support" 
                width={20} 
                height={20}
                className="w-5 h-5"
              />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">AURA Support</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Always here to help</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="Close support chat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div 
          className="p-4 h-96 overflow-y-auto space-y-4"
          role="log"
          aria-live="polite"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-2xl ${
                  message.role === 'user'
                    ? 'bg-primary-light dark:bg-primary-dark text-white rounded-tr-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-sm'
                }`}
                role={message.role === 'assistant' ? 'status' : 'none'}
              >
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div 
                className="bg-gray-100 dark:bg-gray-800 p-3 rounded-2xl rounded-tl-sm max-w-[80%]"
                role="status"
                aria-label="Loading response"
              >
                <Loader2 className="w-5 h-5 animate-spin text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-4 border-t dark:border-gray-700">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-2 border dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              aria-label="Message input"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`p-2 rounded-lg transition-all duration-300 ${
                !input.trim() || isLoading
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                  : 'bg-primary-light dark:bg-primary-dark text-white hover:scale-105'
              }`}
              aria-label="Send message"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
} 