import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { Bot, Send, X, Loader2 } from 'lucide-react';

interface AIAssistantProps {
  context?: string;
}

export function AIAssistant({ context }: AIAssistantProps) {
  const { aiAssistant, aiMessages, isAILoading, sendAIMessage, clearAIHistory } = useStore();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [aiMessages]);

  if (!aiAssistant) {
    return null;
  }

  const handleSend = async () => {
    if (!input.trim() || isAILoading) return;

    const message = input.trim();
    setInput('');

    try {
      await sendAIMessage(message, context);
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* AI Assistant Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-all z-50"
        title="AI Assistant"
      >
        <Bot size={28} />
      </button>

      {/* AI Assistant Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-blue-700 rounded p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Context Info */}
          {context && (
            <div className="bg-blue-50 p-2 text-sm text-blue-800 border-b border-blue-200">
              <strong>Context:</strong> {context.substring(0, 100)}...
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {aiMessages.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                <Bot size={48} className="mx-auto mb-4 text-gray-400" />
                <p className="mb-2">How can I help you today?</p>
                <p className="text-sm">
                  Ask me anything about your life planning, finances, estate planning, or get
                  suggestions for what to include.
                </p>
              </div>
            ) : (
              aiMessages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">{message.content}</div>
                  </div>
                </div>
              ))
            )}
            {isAILoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="animate-spin" size={20} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isAILoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isAILoading}
                className="btn-primary"
              >
                <Send size={20} />
              </button>
            </div>
            {aiMessages.length > 0 && (
              <button
                onClick={clearAIHistory}
                className="text-sm text-gray-500 hover:text-gray-700 mt-2"
              >
                Clear conversation
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
