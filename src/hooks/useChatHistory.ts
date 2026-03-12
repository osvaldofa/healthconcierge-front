import { useState } from 'react';
import type { Message, PatientSession } from '@/types';
import { sendTextMessage, sendVoiceMessage } from '@/services/api';

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

  const sendVoice = async (wavFile: File, session: PatientSession) => {
    const userMsg: Message = {
      role: 'user',
      content: '[Mensagem de voz]',
      timestamp: Date.now(),
      type: 'voice',
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      const responseText = await sendVoiceMessage(wavFile, messages, session);
      const assistantMsg: Message = {
        role: 'assistant',
        content: responseText,
        timestamp: Date.now(),
        type: 'text',
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('[sendVoice] erro:', err);
      const detail = err instanceof Error ? ` (${err.message})` : '';
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Não foi possível processar sua mensagem de voz. Tente novamente.${detail}`,
          timestamp: Date.now(),
          type: 'text',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, isLoading, sendMessage, sendVoice, addMessage };
}
