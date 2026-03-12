'use client';

import { useEffect, useRef } from 'react';
import type { PatientSession } from '@/types';
import { useChatHistory } from '@/hooks/useChatHistory';
import { MessageBubble } from '@/components/MessageBubble';
import { TextInput } from '@/components/TextInput';

interface ChatInterfaceProps {
  session: PatientSession;
}

export function ChatInterface({ session }: ChatInterfaceProps) {
  const { messages, isLoading, sendMessage } = useChatHistory();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (text: string) => {
    sendMessage(text, session);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-700 text-white px-4 py-4 flex items-center justify-between shadow-md flex-shrink-0">
        <h1 className="text-xl font-bold">Health Concierge</h1>
        <span className="text-sm opacity-80">{session.email}</span>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
            <div className="text-5xl mb-4">🏥</div>
            <p className="text-xl font-semibold text-gray-700 mb-2">Olá! Como posso ajudar?</p>
            <p className="text-base text-gray-500 mb-1">Posso ajudar você com:</p>
            <ul className="text-base text-gray-500 list-none">
              <li>🩺 Orientação sobre sintomas</li>
              <li>📅 Agendamento de consultas</li>
            </ul>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.timestamp} message={msg} />
        ))}

        {isLoading && (
          <div className="flex justify-start mb-3">
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <span className="text-gray-500 text-lg">digitando...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="flex-shrink-0">
        <TextInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
