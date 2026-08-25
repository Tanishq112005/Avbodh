import { useState, useEffect, useRef } from 'react';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport } from 'ai';
import { useChatStore } from '@/store/chat';
import { getDynamicGreeting } from '@/lib/time';
import { useSidebar } from '@/components/ui/sidebar';

export function useChatArea(threadId: string) {
  const setHasMessages = useChatStore((s) => s.setHasMessages);
  const addRecentChat = useChatStore((s) => s.addRecentChat);
  const hasMessages = useChatStore((s) => s.hasMessages);

  const { messages, sendMessage, status, stop } = useChat({
    id: threadId,
    messages: useChatStore.getState().threads[threadId] || [],
    transport: new TextStreamChatTransport({
      api: `/api/chat?thread_id=${threadId}`,
    }),
  });

  useEffect(() => {
    if (messages.length > 0 && !hasMessages) {
      setHasMessages(true);
      const firstUserMsg = messages.find((m) => m.role === 'user');
      const textContent =
        firstUserMsg?.parts
          ?.filter((p) => p.type === 'text')
          .map((p) => (p as any).text)
          .join('') || 'New Conversation';
      const title =
        textContent.length > 25
          ? textContent.substring(0, 25) + '...'
          : textContent;
      addRecentChat({ id: threadId, title, updatedAt: Date.now() });
    }
  }, [messages, hasMessages, threadId, setHasMessages, addRecentChat]);

  const [inputValue, setInputValue] = useState('');
  const [greeting, setGreeting] = useState('Avbodh AI');

  const { state, isMobile } = useSidebar();
  const isSidebarOpen = state === 'expanded' && !isMobile;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendMessage({ role: 'user', parts: [{ type: 'text', text: inputValue }] });
    setInputValue('');
  };

  useEffect(() => {
    if (messages.length > 2)
      messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  }, [messages]);

  useEffect(() => {
    setGreeting(getDynamicGreeting());
  }, []);

  return {
    messages,
    status,
    stop,
    inputValue,
    setInputValue,
    greeting,
    isSidebarOpen,
    messagesEndRef,
    submitForm,
    isStreaming: status === 'streaming' || status === 'submitted',
    isNewChat: messages.length === 0,
  };
}
