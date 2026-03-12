import { useState } from 'react';
import type { Message, PatientSession } from '@/types';
import { sendTextMessage } from '@/services/api';

export function useChatHistory() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (msg: Message) =>
    setMessages((prev) => [...prev, msg]);

  const sendMessage = async (text: string, session: PatientSession) => {
    const userMsg: Message = {
      role: 'user',
      content: text,
      timestamp: Date.now(),
      type: 'text',
    };
    // Optimistic UI: adiciona a mensagem do usuário imediatamente
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const response = await sendTextMessage(text, updatedMessages, session);
      const assistantMsg: Message = {
        role: 'assistant',
        content: response.resposta,
        timestamp: Date.now(),
        type: 'text',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errorMsg: Message = {
        role: 'assistant',
        content:
          'Desculpe, ocorreu um erro ao processar sua mensagem. Por favor, tente novamente.',
        timestamp: Date.now(),
        type: 'text',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage, addMessage };
}
